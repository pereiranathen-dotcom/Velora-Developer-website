import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Function to create or retrieve the connection pool.
export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 10000, // Proactively close idle clients before server-side timeout
    });

    // Handle idle connection events without crashing or emitting false alarms
    global._postgresPool.on('error', (err: any) => {
      const isExpectedIdleTermination =
        err?.code === '57P01' || // PostgreSQL administrator command termination (scale-to-zero / idle timeout)
        err?.code === 'ECONNRESET' ||
        err?.message?.includes('terminating connection') ||
        err?.message?.includes('Connection terminated');

      if (isExpectedIdleTermination) {
        // Normal Cloud SQL idle lifecycle cleanup
        console.debug('Cloud SQL idle connection recycled by pool:', err?.message || err);
      } else {
        console.warn('Notice on idle SQL pool client:', err?.message || err);
      }
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });
