import * as SQLite from 'expo-sqlite';

type resultType = {
  'COUNT(*)': number;
  rows : number;
}
const db = SQLite.openDatabaseSync('testdb.db');

export async function initDatabase() {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS identities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      identityKey BLOB NOT NULL,
      registrationId INTEGER NOT NULL
      );`)
  });
}

export async function getIdentity(name: string): Promise<any | undefined> {
  const db = await SQLite.openDatabaseAsync('testdb.db');
  try {
    const result = await db.getFirstAsync(
      'SELECT * FROM identities WHERE name = ?', // Use prepared statement placeholder
      [name]  // Bind the parameter
    );
    return result ? result : undefined;  // Return result directly, no need for _array access
  } catch (error) {
    console.error("Error fetching identity:", error); 
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}

export async function storeIdentity(
  name: string,
  identityKey: Uint8Array,
  registrationId: number
): Promise<void> {
  await db.runAsync(
    'INSERT INTO identities (name, identityKey, registrationId) VALUES (?, ?, ?)',
    [name, identityKey, registrationId]
  );
}



export default {
  initDatabase,
  getIdentity,
  storeIdentity,

};
