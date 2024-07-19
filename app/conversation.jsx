import React, { useState } from "react";
import { Dimensions, View, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import ChatHeader from "../components/ChatHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageList from "../components/MessageList";
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';  // Import uuid

const Conversation = () => {
  const item = useLocalSearchParams();
  const router = useRouter();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: uuidv4(), text: 'Good Afternoon!', type: 'received', time: '12:34', isRead: true },
    { id: uuidv4(), text: 'Lorem ipsum', type: 'sent', time: '11:57', isRead: false },
    { id: uuidv4(), text: 'Suspendisse pretium, purus', type: 'sent', time: '12:40', isRead: true },
    { id: uuidv4(), text: 'Aenean lobortis gravida quo augue, sed tristique', type: 'sent', time: '13:43', isRead: false },
  ]);

  const sendMessageHandler = () => {
    if (messageText) {
      setMessages([...messages, { id: uuidv4(), text: messageText, type: 'sent', time: '13:43', isRead: false }]);
      setMessageText('');
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        style={styles.background}
      />
      <ChatHeader user={item} router={router}/>
      <View className='bg-[#141414] w-full h-28'></View>

      <View className='flex-1 justify-between overflow-visible'>
        <View className='flex-1'>
          <MessageList messages={messages}/>
        </View>
        <View className='pt-2 mb-5'>
          <View className='flex-row justify-between items-center mx-3'>
            <View className='flex-grow gap-x-5 bg-[#141414] rounded-full w-36'>
              <TextInput
                placeholder="Type a message..."
                placeholderTextColor='#ADADAD'
                cursorColor={'#ADADAD'}
                className='font-pregular h-14 pl-4'
                style={{color: 'white'}}
                onChangeText={(text) => setMessageText(text)}
                value={messageText}
              />
            </View>
            <TouchableOpacity
              className='ml-3 p-4 rounded-full bg-[#3400A1]'
              onPress={sendMessageHandler}
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height + Constants.statusBarHeight + 1,
  },
  content: {
    // Center content
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  picker: {
    color: "white", // Set the Picker text color to white
  },
  pickerItem: {
    color: "white", // Set the Picker item text color to white
    paddingLeft: 10, // Add some padding to the left of the Picker
    backgroundColor: "#0F0028", // Set the Picker item background color
  },
});

export default Conversation;
