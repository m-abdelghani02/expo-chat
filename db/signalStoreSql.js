import * as SQLite from 'expo-sqlite';
export class SignalProtocolStore {

  constructor() { 
    this.db = null
    this.initDatabase();
   }

  async initDatabase(){
    try {
      this.db = SQLite.openDatabaseSync('signal_store_sql.db');
      if (this.db) {
        console.log("Db connected successfully", this.db);
      }
      else throw new Error("Db connection failed");
      //Key Pairs Table
      this.db.execSync(`
        CREATE TABLE IF NOT EXISTS key_pairs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key_type TEXT NOT NULL,
          key_id INTEGER,
          pub_key BLOB NOT NULL,
          priv_key BLOB,
          signature BLOB,
          UNIQUE(key_type, key_id)
        );
      `);
      // Sessions Table
       this.db.execSync(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          identifier TEXT NOT NULL UNIQUE,
          record BLOB NOT NULL
        );
      `);
       this.db.execSync(`
        CREATE TABLE IF NOT EXISTS identity_keys (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          identifier TEXT NOT NULL UNIQUE,
          identity_key BLOB NOT NULL
        );
      `);
    } catch (error) {
      console.log(error);
    }
    
  }
  async createSampleTable(){
    if(this.db){
       this.db.execSync(
        `CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
        INSERT INTO test (value, intValue) VALUES ('test1', 123);
        INSERT INTO test (value, intValue) VALUES ('test2', 456);
        INSERT INTO test (value, intValue) VALUES ('test3', 789);
        `);
    }
  }

  async getSampleData(){
    try {
        const allRows = await this.db.getAllAsync('SELECT * FROM identity_keys');
        if (allRows){
        console.log("All rows:");
        for (const row of allRows) {
            console.log(row.identifier, row.identity_key);
          }
      }
      else {
        console.log("No data found");}
    } catch (error) {
      console.log(error);
    }
  }

  async insertIntoSampleData(value, intValue){
    const result = this.db.runSync('INSERT INTO test (value, intValue) VALUES (?, ?)', value, intValue);
  }
  async listAllTables() {
    try {
      const result = this.db.getAllSync('SELECT name FROM sqlite_master WHERE type="table";')
      if (result) {
        console.log('All tables:');
        for (const row of result) {
          console.log(row);
        }
      } else {
        console.log("No Tables Found");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getIdentityKeyPair(){
    try {
      const kp = this.db.getFirstSync('SELECT pub_key, priv_key FROM key_pairs WHERE key_type = ?', 'identity');
      if (kp) {
        console.log(kp);
        return kp
      }
      else {
        throw new Error("Identity key pair not found");
      }
    } catch (error) {
      console.log(error);
      return null;
    }
    
  }

  async getLocalRegistrationId(){
    try {
      const rid = this.db.getFirstSync('SELECT key_id FROM key_pairs WHERE key_type = ?', 'registrationId');
      if (rid) {
        console.log(rid);
        return rid;
      }
      else {
        throw new Error("Registration ID not found");
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async isTrustedIdentity () {

  }
  async loadPreKey(keyId) {
    try {
      const kp = this.db.getFirstSync
        ('SELECT pub_key, priv_key FROM key_pairs WHERE key_type = ? AND key_id = ?', ['preKey', keyId]);
      if (kp) {
        console.log(kp);
        return kp;
      }
      else {
        throw new Error("Pre Key pair not found");
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async loadSignedPreKey(keyId) {
    try {
      const spk = this.db.getFirstSync
        ('SELECT pub_key, priv_key FROM key_pairs WHERE key_type = ? AND key_id = ?', ['signedPreKey', keyId]);
      if (spk) {
        console.log(spk);
        return spk;
      }
      else {
        throw new Error("Session not found");
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async loadIdentity(identifier) {
    try {
      const idKey = this.db.getFirstSync
        ('SELECT identity_key FROM identity_keys WHERE identifier = ? ', identifier);
      if (idKey) {
        console.log('key=',idKey);
        return idKey.identity_key;
      }
      else {
        throw new Error("Identity key not found");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async saveIdentity(identifier, identityKey) {
    try {
      this.db.runSync(
        'INSERT OR REPLACE INTO identity_keys (identifier, identity_key) VALUES (?, ?)', [identifier, identityKey]
      );
      console.log('Identity key inserted');
    } catch (error) {
      console.log(error);
    }
  }
  async loadSession(identifier) {
    try {
      const session = this.db.getFirstSync
        ('SELECT record FROM sessions WHERE identifier = ?', 'identifier');
      if (session) {
        console.log(session);
        return session;
      }
      else {
        throw new Error("Session not found");
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }



  async storeSession (identifier, record) {
    try {
      const result = this.db.runSync(
        'INSERT OR REPLACE INTO sessions (identifier, record) VALUES (?, ?)', [identifier, record]
      );
    } catch (error) {
      console.log(error);
    }
  }


  async storePreKey(keyId, keyPair) {
    try {
      const result = this.db.runSync(
        'INSERT OR REPLACE INTO key_pairs (key_type, key_id, pub_key, priv_key) VALUES (?, ?, ?, ?)', 
        ['preKey', keyId, keyPair.pubKey, keyPair.privKey]
      );
    } catch (error) {
      console.log(error);
    }
  }

  async storeSignedPreKey(keyId, keyPair) {
    try {
      const result = this.db.runSync(
        'INSERT OR REPLACE INTO key_pairs (key_type, key_id, pub_key, priv_key) VALUES (?, ?, ?, ?)', 
        ['signedPreKey', keyId, keyPair.pubKey, keyPair.privKey]
      );
    } catch (error) {
      console.log(error);
    }
  }
  
  async removePreKey(keyId) {
    try {
      const session = this.db.getFirstSync
        ('DELETE FROM key_pairs WHERE key_type = ? AND key_id = ?', ['preKey', keyId]);
        console.log('Prekey removed');
    } catch (error) {
      console.log(error);
    }
  }


  async removeSignedPreKey(keyId) {
    try {
        const spk = this.db.getFirstSync
        ('SELECT * FROM key_pairs WHERE key_type = ? AND key_id = ? ', ['signedPreKey', keyId]);
      if (spk) {
        console.log(spk);
      }
      else {
        throw new Error("Signed Pre key not found to remove");
      }
      const result = this.db.runSync(
        'DELETE FROM key_pairs WHERE key_type = ? AND key_id = ?',
        ['signedPreKey', keyId]
      );
    } catch (error) {
      console.log('Error removing Key', error);
    }
  }

  async removeAllSessions(identifier) {
    try {
      const pattern = '${identifier}$';
      const sessions = this.db.getAllSync
      ('SELECT * FROM sessions WHERE identifier LIKE ?', pattern);
    if (sessions.length > 0) {
      for (const row of sessions)
      console.log(row);
    }
    else {
      throw new Error("Sessions not found to remove");
    }
    const result = this.db.runSync(
      'DELETE FROM sessions WHERE identifier LIKE ?', pattern
    );
    console.log("Sessions removed Successfully");
  } catch (error) {
    console.log('Error removing sessions', error);
  }
  }

}

