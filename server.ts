import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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

// In-memory store initialized from disk
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    keys: Object.keys(appState),
    timestamp: new Date().toISOString(),
  });
});

// GET all store state
app.get('/api/store', (req, res) => {
  res.json({ success: true, data: appState });
});

// GET specific key
app.get('/api/store/:key', (req, res) => {
  const { key } = req.params;
  res.json({ success: true, data: appState[key] ?? null });
});

// POST update specific key
app.post('/api/store/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  appState[key] = value;
  persistToDisk();
  res.json({ success: true, key });
});

// POST bulk update store
app.post('/api/store', (req, res) => {
  const updates = req.body;
  if (updates && typeof updates === 'object') {
    appState = { ...appState, ...updates };
    persistToDisk();
    res.json({ success: true, keys: Object.keys(updates) });
  } else {
    res.status(400).json({ success: false, error: 'Invalid payload' });
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
  });
}

bootstrap();
