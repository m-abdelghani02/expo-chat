import {
  Alert,
  Dimensions,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { io } from "socket.io-client";
import { KeyHelper, SessionBuilder, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript";
import {SignalProtocolStore} from '../../db/signalStoreSql';
import Buffer from 'buffer';

const NewMessage = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [socket, setSocket] = useState(null);
  const [clientList, setClientList] = useState([]);

  const getAllUsers = () => {
    socket.emit('get users');
  };

  useEffect(() => {
    const socketInstance = io('http://192.168.1.20:3000');
    setSocket(socketInstance);

    socketInstance.on('chat message', (message) => {
      Alert.alert('Server response:', message);
    });

    socketInstance.on('allClientIDs', (clientIDs) => {
      console.log('All connected client IDs:', clientIDs);
      setClientList(clientIDs);
    });

    socketInstance.on('private message', (message) => {
      Alert.alert('Private message:', message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const setUserNameHandler = () => {
    if (name.trim()) {
      socket.emit('setUserName', name); // Send to server
      setName(''); // Clear input field
    } else {
      Alert.alert('Please enter a name.');
    }
  };

  const sendMessageToClient = (clientID) => {
    if (message) {
      socket.emit('sendToSpecificClient', { message, targetClientId: clientID });
      setMessage('');
    } else {
      Alert.alert('Please enter a message.');
    }
  };

  useEffect(() => {
    const store = new SignalProtocolStore();
    const address = new SignalProtocolAddress('test', 1)
    const setup = async () => {
      //await store.createSampleTable();
      //await store.insertIntoSampleData('Test Insert', 324)
      //await store.getSampleData();
     await store.listAllTables();
      const keypair = await KeyHelper.generateIdentityKeyPair();
      //const pubkey = Buffer.Buffer.from((keypair.pubKey))
      //const privkey = Buffer.Buffer.from((keypair.privKey))
      //console.log('pub keypair generated:', pubkey);
      //console.log('priv keypair generated:', privkey);
      await store.saveIdentity('test', keypair);
      //const loadedIdentityKey = await store.loadIdentity('myself');
      //console.log("loaded key", Buffer.Buffer.from(loadedIdentityKey)); 
      //console.log("loaded priv key", Buffer.Buffer.from(loadedIdentityKey.privKey));
      try {
        const session = new SessionBuilder(store, address);
        if (session) {
          console.log('Session created');
        }
        else{
          throw new Error("Session not created");
        }
        const identityKey = await session.storage.getIdentityKeyPair();
        console.log("Identity key pair from session: ",identityKey);
        await store.getSampleData();
      } catch (error) {
        console.log(error); 
      }
      
    };
    setup();

  }, [])
  
  
  

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: Dimensions.get("window").height + 100 + Constants.statusBarHeight + 1 }}
      />
      <View className="bg-[#141414] h-32 justify-center pl-6 pt-10 mb-5">
        <Text className="text-white text-4xl">New Message</Text>
      </View>
      <View className='w-3/4 self-center mb-4'>
        <TextInput
          className='bg-[#ADADAD] h-10 px-3'
          placeholder="Enter your name"
          autoCorrect={false}
          onChangeText={text => setName(text)}
          value={name}
        />
        <TouchableOpacity
          className='bg-blue-500 p-2 rounded mt-2'
          onPress={setUserNameHandler}
        >
          <Text className='text-white text-center'>Set Name</Text>
        </TouchableOpacity>
      </View>
      <View className='w-3/4 self-center mb-4'>
        <TextInput
          className='bg-[#ADADAD] h-10 px-3'
          placeholder="Message"
          autoCorrect={false}
          onChangeText={chatMessage => setMessage(chatMessage)}
          value={message}
        />
      </View>
      <ScrollView className='w-3/4 self-center mt-5'>
        {clientList.map(([id, clientName]) => (
          <TouchableOpacity
            key={id}
            className='bg-blue-500 p-2 mb-2 rounded'
            onPress={() => sendMessageToClient(id)}
          >
            <Text className='text-white'>{clientName}</Text> 
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View className='w-3/4 self-center mt-10'>
        <TouchableOpacity
          className='bg-red-500 h-10 justify-center rounded mb-2'
          onPress={getAllUsers}
        >
          <Text className='text-white text-center'>Get all user IDs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='bg-red-500 h-10 justify-center rounded'
          onPress={() => {
            socket.emit('disconnectAllClients');
          }}
        >
          <Text className='text-white text-center'>Disconnect all users</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewMessage;
