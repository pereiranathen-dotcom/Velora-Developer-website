import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { getAllStoreValues, getStoreValue, setStoreValue, setBulkStoreValues } from './src/db/store.ts';
import { getUsers, getOrCreateUser } from './src/db/users.ts';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Support large payloads for optimized photos / base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'app_state.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create data dir:', err);
  }
}

// In-memory store initialized from disk as fallback
let appState: Record<string, any> = {};
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    appState = JSON.parse(raw);
    console.log(`Loaded ${Object.keys(appState).length} keys from persistent disk store.`);
  } catch (err) {
    console.warn('Failed to load initial app_state.json:', err);
  }
}

function persistToDisk() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appState, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write app_state.json:', err);
  }
}

// Migrate initial state into Cloud SQL and memory from Supabase or disk
async function initDbState() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bbgcvexhjvcvbowhxabc.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_e5YSuryYTC47WsEeXfUAfg_iKO9uMRx';

  // If local memory is empty, attempt to hydrate from Supabase
  if (Object.keys(appState).length === 0 && typeof fetch !== 'undefined') {
    try {
      const restEndpoint = `${supabaseUrl.replace(/\/rest\/v1\/?$/, '')}/rest/v1/app_store?select=*`;
      const res = await fetch(restEndpoint, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          for (const row of rows) {
            if (row?.key && row?.data !== undefined) {
              appState[row.key] = row.data;
            }
          }
          console.log(`Loaded ${Object.keys(appState).length} keys from Supabase into server memory.`);
          persistToDisk();
        }
      }
    } catch (err) {
      console.warn('Hydration from Supabase note:', err);
    }
  }

  if (process.env.SQL_HOST) {
    try {
      const existing = await getAllStoreValues();
      const keys = Object.keys(existing);
      if (keys.length === 0 && Object.keys(appState).length > 0) {
        console.log('Cloud SQL app_store is empty. Migrating appState to Cloud SQL...');
        await setBulkStoreValues(appState);
        console.log(`Migrated ${Object.keys(appState).length} keys to Cloud SQL successfully.`);
      } else if (keys.length === 0 && fs.existsSync(DATA_FILE)) {
        console.log('Cloud SQL app_store is empty. Migrating data/app_state.json to Cloud SQL...');
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const diskData = JSON.parse(raw);
        await setBulkStoreValues(diskData);
        console.log(`Migrated ${Object.keys(diskData).length} keys to Cloud SQL successfully.`);
      } else {
        console.log(`Cloud SQL connected with ${keys.length} keys in app_store.`);
      }
    } catch (err) {
      console.warn('Initial Cloud SQL migration check note:', err);
    }
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    cloudSql: Boolean(process.env.SQL_HOST),
    keys: Object.keys(appState),
    timestamp: new Date().toISOString(),
  });
});

// GET all store state from Cloud SQL
app.get('/api/store', async (req, res) => {
  try {
    if (process.env.SQL_HOST) {
      const dbData = await getAllStoreValues();
      if (Object.keys(dbData).length > 0) {
        return res.json({ success: true, data: dbData, source: 'cloudsql' });
      }
    }
    res.json({ success: true, data: appState, source: 'fallback' });
  } catch (err: any) {
    console.warn('GET /api/store falling back to memory/disk:', err?.message || err);
    res.json({ success: true, data: appState, source: 'fallback' });
  }
});

// GET specific key from Cloud SQL
app.get('/api/store/:key', async (req, res) => {
  const { key } = req.params;
  try {
    if (process.env.SQL_HOST) {
      const dbVal = await getStoreValue(key);
      if (dbVal !== null) {
        return res.json({ success: true, data: dbVal, source: 'cloudsql' });
      }
    }
    res.json({ success: true, data: appState[key] ?? null, source: 'fallback' });
  } catch (err: any) {
    console.warn(`GET /api/store/${key} falling back:`, err?.message || err);
    res.json({ success: true, data: appState[key] ?? null, source: 'fallback' });
  }
});

// POST update specific key to Cloud SQL
app.post('/api/store/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  appState[key] = value;
  persistToDisk();
  try {
    if (process.env.SQL_HOST) {
      await setStoreValue(key, value);
    }
    res.json({ success: true, key });
  } catch (err: any) {
    console.error(`POST /api/store/${key} database write error:`, err?.message || err);
    res.json({ success: true, key, dbWarning: true });
  }
});

// POST bulk update store to Cloud SQL
app.post('/api/store', async (req, res) => {
  const updates = req.body;
  if (updates && typeof updates === 'object') {
    appState = { ...appState, ...updates };
    persistToDisk();
    try {
      if (process.env.SQL_HOST) {
        await setBulkStoreValues(updates);
      }
      res.json({ success: true, keys: Object.keys(updates) });
    } catch (err: any) {
      console.error('POST /api/store database write error:', err?.message || err);
      res.json({ success: true, keys: Object.keys(updates), dbWarning: true });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid payload' });
  }
});

// User routes (Firebase Auth verification)
app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
  try {
    const usersList = await getUsers();
    res.json(usersList);
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (req.user) {
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error: any) {
    console.error('Failed to sync user:', error);
    res.status(500).json({ error: error.message || 'Failed to sync user' });
  }
});

async function bootstrap() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
    // Run DB initialization concurrently without delaying container port readiness
    initDbState().catch((err) => console.warn('Background DB init note:', err));
  });
}

bootstrap();
