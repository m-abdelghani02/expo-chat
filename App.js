import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useEffect } from 'react'; 
import QuickCrypto from 'react-native-quick-crypto';
import { install } from 'react-native-quick-crypto';
import { setWebCrypto } from '@privacyresearch/libsignal-protocol-typescript';
import * as libsignal from '@privacyresearch/libsignal-protocol-typescript'
import { Crypto } from '@privacyresearch/libsignal-protocol-typescript/lib/internal';
import { SignalProtocolStore } from './storage-type';
import { SignalDirectory } from './signal-directory';
import * as SQLite from 'expo-sqlite';
install();

console.log("qdsdqsdqs");

/* const db = await SQLite.openDatabaseAsync('databaseName.db');

await db.withTransactionAsync(async () => {
  const result = await db.getFirstAsync('SELECT COUNT(*) FROM USERS');
  console.log('Count:', result.rows[0]['COUNT(*)']);
}); */

function toArrayBuffer(buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return view;
}

/* const MyImplementaion = {
  getRandomValues: QuickCrypto.getRandomValues,
  subtle:{
    importKey: QuickCrypto.subtle.importKey,
    encrypt: ({name, iv}, key, data) => {
      const cipher = QuickCrypto.createCipheriv(name, key, iv);
      let newEncryptedData = cipher.update(Buffer.from(data));
      newEncryptedData = Buffer.concat([newEncryptedData, cipher.final()]);
      const arrayBuffer = newEncryptedData.buffer;
      return arrayBuffer;
    },
    decrypt: ({name, iv}, key, data) => {
      const cipher = QuickCrypto.createDecipheriv(name, key, iv);
      let newDecryptedData = cipher.update(Buffer.from(data));
      newDecryptedData = Buffer.concat([newDecryptedData, cipher.final()]);
      const arrayBuffer = newDecryptedData.buffer;
      return arrayBuffer;
    },
    sign: async (algorithm, key, data) => {
      const hmac = QuickCrypto.createHmac('sha256', key); 
      hmac.update(data); 
      const signature = await hmac.digest(); 
      const arrayBuffer = signature.buffer;
      return arrayBuffer;
    },
    digest: async (algorithm, data) => {
      console.log('Hashing: ', data);
      console.log('Algortithm is: ',algorithm);
      const hash = QuickCrypto.createHash('sha512'); 
      console.log('Hash Created');
      hash.update(data); 
      console.log('Hash Updated with data: ', data);
      const digest = await hash.digest();
      console.log('Hash digested: ', digest); 
      const arrayBuffer = toArrayBuffer(digest);
      console.log('Hash Array Buffer: ', toArrayBuffer(arrayBuffer));
      return digest;
    } 
  }
} */



/* function hash(data) {
  console.log('Hashing  locally');
  
  return MyImplementaion.subtle.digest({ name: 'SHA-512' }, data);
  } */
 
 /* const data = 'Hello, World!';
 const bufferData = Buffer.from(data, 'utf-8');
 const crypto = new Crypto;
 
 crypto.hash(bufferData)
 .then( hash => {
  console.log('Calling hash');
  
  console.log('Hash inside .then: ', hash);
  }).catch(error => {
    console.error('Error computing hash:', error);
    }); */
    
//setWebCrypto(MyImplementaion)
/* 
const data = 'Hello, World!';
const bufferData = Buffer.from(data, 'utf-8');

const crypto = new Crypto;

crypto.hash(bufferData)
  .then(async (hashPromise) => {  
    try {
      const hashBuffer = hashPromise;
      console.log('hashBuffer: ', hashBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      console.log('Calling hash');
      console.log('Hash inside .then:', hashArray);
    } catch (error) {
      console.error('Error computing hash:', error);
    }
  })
  .catch(error => {
    console.error('Error initiating hash:', error);
  });
  


  const newKey = crypto.getRandomBytes(16);
  crypto.sign(newKey, bufferData)
    .then(async (signPromise) => {  
      try {
        const signBuffer = signPromise;
        console.log('signBuffer: ', signBuffer);
        const signArray = Array.from(new Uint8Array(signBuffer));
        console.log('Calling sign');
        console.log('sign inside .then:', signArray);
      } catch (error) {
        console.error('Error computing signature:', error);
      }
    })
    .catch(error => {
      console.error('Error initiating signature:', error);
    });
     */
  
  /* crypto.hash(bufferData)
  .then(hash => {
  //const newHash = hash.toJSON();
  console.log('Calling hash');
  console.log('Hash: ', hash);
}).catch(error => {
  console.error('Error computing hash:', error);
}); */

/* 
QuickCrypto.createHmac

const setWebCrypto = (wc, n) => {
  const _webcrypto = wc;
  const array = new Uint8Array(n);
  _webcrypto.getRandomValues(array);
  return array;
}

const testArray = setWebCrypto(wc,10);
console.log('setwebcrypto: ', testArray); */



// Hashing (synchronous)
const hashed = QuickCrypto.createHash('sha256')
  .update('Damn, Margelo writes hella good software!')
  .digest('hex');


/////////////////////////////////////////////////////////////////////////////////////////////
/* const data = 'Cest a dire le wagon?';
const bufferData = Buffer.from(data, 'utf-8');

const crypto = new Crypto;
 function generateKeyAndIv() {
  try {
    const AES_KEY = crypto.getRandomBytes(32);
    const AES_IV = crypto.getRandomBytes(16);
    const aesKeyBuf = Array.from(new Uint8Array(AES_KEY));
    const ivKeyBuf = Array.from(new Uint8Array(AES_IV));
    console.log('iv value issssssssssss', aesKeyBuf);
    console.log('key value isssssssssssss', ivKeyBuf);

    return {AES_KEY, AES_IV};
  } catch (error) {
    console.error('Error generating key:', error);
  }
  
}
const keys = generateKeyAndIv();


const keyArray = Array.from(new Uint8Array(keys.AES_KEY));
const ivArray = Array.from(new Uint8Array(keys.AES_IV));


function encryptData(key, data, iv) {
  console.log('Calling crypto.encrypt');
  return crypto.encrypt(key, data, iv) // Return the promise directly
      .then((encryptedBuffer) => {
          console.log('.then of encrypt ');
          const EncryptedArray = Array.from(new Uint8Array(encryptedBuffer));
          console.log('Encrypted Array from buffer:', EncryptedArray);
          return encryptedBuffer;
      })
      .catch(error => {
          console.error('Cannot encrypt data:', error);
          throw error; // Re-throw the error
      });
}

function decryptData(key, data, iv) {
  console.log('Calling crypto.decrypt');
  return crypto.decrypt(key, data, iv) // Return the promise directly
      .then((decryptedBuffer) => {
          console.log('.then of decrypt');
          const decryptedArray = Array.from(new Uint8Array(decryptedBuffer));
          console.log('Decrypted Array from buffer:', decryptedArray);
          const text = decryptedArray.map(value => String.fromCharCode(value)).join('');
          return text;
      })
      .catch(error => {
          console.error('Cannot decrypt data:', error);
          throw error; // Re-throw the error
      });
}

// Chain the promises
encryptData(keys.AES_KEY, bufferData, keys.AES_IV)
  .then(encryptedBuffer => decryptData(keys.AES_KEY, encryptedBuffer, keys.AES_IV))
  .then(plaintext => console.log('Decrypted plaintext:', plaintext.toString('utf-8')))
  .catch(error => console.error('Error in encryption/decryption process:', error)); */
 

/////////////////////////////////////////////////////////////////////////////////////////////
const aliceAddress = new libsignal.SignalProtocolAddress('alice', 1);
const bobAddress = new libsignal.SignalProtocolAddress('bob', 2);
const aliceStore = new SignalProtocolStore();
const bobStore = new SignalProtocolStore();
const directory = new SignalDirectory()


const getReceivingSessionCipherForRecepient = (to) => {
  const store = to === 'bob' ? bobStore : aliceStore;
  const address = to === 'bob' ? aliceAddress : bobAddress;
  return new libsignal.SessionCipher(store, address);
};

const storeSomewhereSafe = (store) => (
  key,
  value
) => {
  store.put(key, value);
};


let msgID = 0;

function getNewMessageID(){
  return msgID++;
}



const sendMessage = (to, from, message) => {
  const msg = { to, from, message, delivered: false, id: getNewMessageID() };
  return msg;
};

const createID = async (name, store) => {
  const registrationId = libsignal.KeyHelper.generateRegistrationId();
  // Store registrationId somewhere durable and safe... Or do this.
  storeSomewhereSafe(store)(`registrationID`, registrationId);

  const identityKeyPair = await libsignal.KeyHelper.generateIdentityKeyPair();
  // Store identityKeyPair somewhere durable and safe... Or do this.
  storeSomewhereSafe(store)("identityKey", identityKeyPair);

  const baseKeyId = Math.floor(10000 * Math.random());
  const preKey = await libsignal.KeyHelper.generatePreKey(baseKeyId);
  store.storePreKey(`${baseKeyId}`, preKey.keyPair);

  const signedPreKeyId = Math.floor(10000 * Math.random());
  const signedPreKey = await libsignal.KeyHelper.generateSignedPreKey(
    identityKeyPair,
    signedPreKeyId
  );
  store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
  const publicSignedPreKey = {
    keyId: signedPreKeyId,
    publicKey: signedPreKey.keyPair.pubKey,
    signature: signedPreKey.signature,
  };

  // Now we register this with the server so all users can see them
  const publicPreKey = {
    keyId: preKey.keyId,
    publicKey: preKey.keyPair.pubKey,
  };
  directory.storeKeyBundle(name, {
    registrationId,
    identityPubKey: identityKeyPair.pubKey,
    signedPreKey: publicSignedPreKey,
    oneTimePreKeys: [publicPreKey],
  });
};

const createAliceId = async () => {
  await createID('alice', aliceStore);
  console.log({aliceStore});
}


const createBobId = async () => {
  await createID('bob', bobStore);
  console.log({bobStore});
}


const starterMessageBytes = Uint8Array.from([
  0xce,
  0x93,
  0xce,
  0xb5,
  0xce,
  0xb9,
  0xce,
  0xac,
  0x20,
  0xcf,
  0x83,
  0xce,
  0xbf,
  0xcf,
  0x85,
]);

const readMessage = async (msg, cipher) => {
  let plaintext = new Uint8Array().buffer;
  if (msg.message.type === 3) {
    console.log({ msg });
    plaintext = await cipher.decryptPreKeyWhisperMessage(
      msg.message.body,
      "binary"
    );
  } else if (msg.message.type === 1) {
    plaintext = await cipher.decryptWhisperMessage(
      msg.message.body,
      "binary"
    );
  }
  const stringPlaintext = new TextDecoder().decode(new Uint8Array(plaintext));
  console.log(stringPlaintext);

  const { id, to, from } = msg;
  return { id, to, from, messageText: stringPlaintext };
};

const startSessionWithBob = async () => {
  // get Brünhild' key bundle
  const bobBundle = directory.getPreKeyBundle("bob");
  console.log({ bobBundle });
  console.log(bobBundle.identityKey);

  const recipientAddress = bobAddress;
console.log('Starting session.................');
  // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
  const sessionBuilder = new libsignal.SessionBuilder(aliceStore, recipientAddress);

  // Process a prekey fetched from the server. Returns a promise that resolves
  // once a session is created and saved in the store, or rejects if the
  // identityKey differs from a previously seen identity for this address.
  console.log("Alice processing prekey");
  try {
    await sessionBuilder.processPreKey(bobBundle);
  } catch (error) {
    console.log('Error processing Prekey', error);
  }
  

  // Now we can send an encrypted message
  const aliceSessionCipher = new libsignal.SessionCipher(aliceStore, recipientAddress);
  const ciphertext = await aliceSessionCipher.encrypt(
    starterMessageBytes.buffer
  );
  console.log('Session running');
  console.log('ciphertext', ciphertext);
  const msg = sendMessage("bob", "alice", ciphertext);
  console.log('Message =', {msg});
  const text = "Hello, world!";
  const uint8Array = Buffer.from(text, 'utf-8'); 
  const ciphertext2 = await aliceSessionCipher.encrypt(
    uint8Array.buffer
  );
  const msg2 = sendMessage("bob", "alice", ciphertext2);
  console.log('Message2 =', {msg2});
  //const plaintext = await readMessage(msg, aliceSessionCipher);
  //console.log({plaintext});
  
  
};

async function main() {
  await createAliceId();  // Ensure Alice's ID is created first
  await createBobId();    // Ensure Bob's ID is created before fetching his bundle

  try {
    await startSessionWithBob(); // Now start the session
  } catch (error) {
    console.error("Error starting session with Bob:", error);
  }
}

main();




///////////////////////////////////TESTING SQLITE//////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////
export default function App() {
  const [key, setKey] = useState(null); 
  const [iv, setIv] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);
  const [encryptedDataBuffer, setEncryptedDataBuffer] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  //const [loading, setLoading] = useState(false);
  //const db = SQLite.openDatabaseAsync("signal.db");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState(undefined);


  


  useEffect(() => {
      
  }, []);

  if (isLoading) {
    return(
      <View style={styles.container}>
        <Text className="text-red-600 font-bold font-sans">Loading db...</Text>
      </View>
    )
  }
  /* const data = 'Hello, World!';
  useEffect(() => {
    console.log('Use Effect key');
    async function generateKeyAndIv() {
      try {
        const newKey = crypto.getRandomBytes(32);
        const newIv = crypto.getRandomBytes(16);
        setIv(newIv);
        setKey(newKey);
        const keyBuf = Array.from(new Uint8Array(iv));
        const ivBuf = Array.from(new Uint8Array(key));
        console.log('iv state value is',keyBuf);
        console.log('key state value is',ivBuf);
      } catch (error) {
        console.error('Error generating key:', error);
      }
    }
    generateKeyAndIv();
  }, []); 

  useEffect(() => {
    console.log('Use Effect 1');
    if (key && iv) { 
      const keyBuf = Array.from(new Uint8Array(iv));
      const ivBuf = Array.from(new Uint8Array(key));
      console.log('iv 2 state value is',keyBuf);
      console.log('key 2 state value is',ivBuf);
      async function encryptData() {
           console.log('Calling crypto.encrypt');
           crypto.encrypt(key, bufferData, iv)
           .then(async (encryptPromise) => {  
            try {
              console.log('.then of encrypt ');
              const encryptedBuffer = encryptPromise;
              const EncryptedArray = Array.from(new Uint8Array(encryptedBuffer));
              console.log('Encrypted Array from buffer:', EncryptedArray);
              setEncryptedData(EncryptedArray);
              setEncryptedDataBuffer(encryptedBuffer);

            } catch (error) {
              console.error('Error while encrypting:', error);
            }
          })
          .catch(error => {
            console.error('Cannot encrypt data:', error);
          });
      }
      encryptData();
    }
  }, []); 

  useEffect(() => {
    console.log('Use Effect 2');
    if (encryptedDataBuffer) { 
      console.log('Calling Decrypt');
      async function decryptData() {
        crypto.decrypt(key, encryptedDataBuffer, iv)
        .then(async (decryptPromise)=>{
            try {
                 console.log('.then of decrypt');
                 const decryptedBuffer = decryptPromise;
                 const DecryptedArray = Array.from(new Uint8Array(decryptedBuffer));
                 console.log('Decrypting .then:', DecryptedArray);
                 setDecryptedData(DecryptedArray);
               } catch (error) {
               console.error('Error decrypting data:', error);
              }
          })
          .catch(error =>{
            console.error('Cannot decrypt data :', error);
          });
      }
      decryptData();
    }
  }, []); */



  

  return (
    <SafeAreaView style={styles.container}>
      <TextInput value={currentData} placeholder='Data' onChange={setCurrentData}/>
{/*      <Text>Hash: {hashed}</Text>
      <Text>Testing Aes</Text>
      {key ? <Text>Key: {key}</Text> : <Text>Generating key...</Text>}
      {iv ? <Text>Iv: {iv}</Text> : <Text>Generating iv...</Text>} 
      <Text>Data: {data}</Text> */}
      {/* <Text>Encrypted Data: {encryptedData ? encryptedData.join(', ') : 'Loading...'}</Text>
      <Text>Decrypted Data: {decryptedData ? decryptedData.join(', ') : 'Loading...'}</Text> */}
      {/* {loading ? <Text>Loading...</Text> : <Text>Decrypted Data: {decryptedData}</Text>} */}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
