import { db } from './index.ts';
import { appStore } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getStoreValue(key: string): Promise<any | null> {
  try {
    const rows = await db
      .select({ data: appStore.data })
      .from(appStore)
      .where(eq(appStore.key, key));

    if (rows.length > 0) {
      return rows[0].data;
    }
    return null;
  } catch (error) {
    console.error(`Database query failed for store key ${key}:`, error);
    throw new Error(`Database query failed for key ${key}`, { cause: error });
  }
}

export async function getAllStoreValues(): Promise<Record<string, any>> {
  try {
    const rows = await db.select().from(appStore);
    const result: Record<string, any> = {};
    for (const row of rows) {
      result[row.key] = row.data;
    }
    return result;
  } catch (error) {
    console.error('Database query failed for getAllStoreValues:', error);
    throw new Error('Database query failed for store values', { cause: error });
  }
}

export async function setStoreValue(key: string, data: any): Promise<void> {
  try {
    await db
      .insert(appStore)
      .values({
        key,
        data,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appStore.key,
        set: {
          data,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error(`Database write failed for store key ${key}:`, error);
    throw new Error(`Database write failed for key ${key}`, { cause: error });
  }
}

export async function setBulkStoreValues(entries: Record<string, any>): Promise<void> {
  try {
    for (const [key, data] of Object.entries(entries)) {
      if (data !== undefined && data !== null) {
        await setStoreValue(key, data);
      }
    }
  } catch (error) {
    console.error('Database bulk write failed:', error);
    throw new Error('Database bulk write failed', { cause: error });
  }
}
