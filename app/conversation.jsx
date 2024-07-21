import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import ChatHeader from "../components/ChatHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageList from "../components/MessageList";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid"; // Import uuid
import * as ImagePicker from 'expo-image-picker'
import {getConversationMessages} from '../services/messageService';
import { sendMessageHandler } from '../handlers/sendMessageHandler.js'; 
import { getConversationById } from "../services/conversationService";

const Conversation = () => {
  const item = useLocalSearchParams();
  const conversationId = Object.values(item).join('');
  const router = useRouter();
  const [messageText, setMessageText] = useState("");
  const [convMessages, setConvMessages] = useState([])
  const [messages, setMessages] = useState([]);
  const [convDetails, setConvDetails] = useState({});
  const [user2_id, setUser2_id] = useState('');
  //const convMessages = getConversationMessages(item.conversationId);
  useEffect(() => {
    console.log('Conversation ID:', conversationId);
    const fetchMessages = async () => {
      try {
        const conversationMessages = await getConversationMessages(conversationId);
        console.log('Fetched Messages:', conversationMessages);

        // Transforming the messages
        const transformedMessages = transformMessages(conversationMessages);
        setMessages(transformedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    const fetchConvDetails = async () => {
      try {
        const convDetails = await getConversationById(conversationId);
        setConvDetails(convDetails);
        setUser2_id(convDetails.user2_id);
      } catch (error) {
        console.log(error);
      }
    }
    fetchConvDetails();
    fetchMessages();
  }, [conversationId]);
  
  useEffect(() => {
    console.log('Conversation Messages State:', convMessages);
    console.log('Conversation Details State:', convDetails);
    console.log('Conversation Recipient State:', user2_id);
  }, [convMessages, convDetails, user2_id]);

  
  
  const sendMessage = async () => {
    const newMessageId = uuid.v4();
    const newMessage = {
      id: newMessageId,
      text: messageText,
      type: "sent",
      time: formatTimestamp(new Date()), // Current time
      isRead: false,
      status: "pending", // Mark as pending initially
    };

    // Optimistically update the UI
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageText("");

    const sentMessageData = { conversationId, content: messageText, recipient_id: user2_id };
    console.log("Sending from conversation", sentMessageData);

    const success = await sendMessageHandler(sentMessageData);

    if (success) {
      // Update the message status to sent
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessageId ? { ...msg, status: "sent" } : msg
        )
      );
    } else {
      // Update the message status to failed
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessageId ? { ...msg, status: "failed" } : msg
        )
      );
      console.error('Error sending message');
    }
  };
  
/*   const sendMessageHandler = () => {
    if (messageText) {
      setMessages([
        ...messages,
        {
          id: uuid.v4(),
          text: messageText,
          type: "sent",
          time: "13:43",
          isRead: false,
        },
      ]);
      setMessageText("");
    }
  }; */

  const transformMessages = (messages) => {
    return messages.map((message) => ({
      id: message.message_id, // Generating a new unique ID
      text: message.content, // Mapping the 'content' field
      type: message.sender_id === '1234567890' ? 'sent' : 'received', // Determining message type based on HARDCODED sender_id
      time: formatTimestamp(message.timestamp), // Formatting the timestamp
      isRead: false, // Assuming all messages are unread initially
    }));
  };
  
  // Utility function to format timestamp
  const formatTimestamp = (timestamp) => {
    // Convert timestamp to HH:MM format (for example)
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };




  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    })
    console.log(result);
    if(!result.canceled){
      console.log('Success');
      setSelectedImage(result.assets[0].uri);
    } 
  }
  
  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        style={styles.background}
      />
      <ChatHeader user={item} router={router} />
      <View className="bg-[#141414] w-full h-28 "></View>

      <View className="flex-1 justify-between overflow-visible">
        <View className="flex-1">
          <MessageList messages={messages} />
        </View>
        <View className="mb-5">
          <View className="flex-row justify-center items-center mx-3 ">
            <View className="bg-[#141414] rounded-full w-5/6 flex-row items-center">
              <View className="flex-1">
                <TextInput
                  placeholder="Type a message..."
                  placeholderTextColor="#ADADAD"
                  cursorColor={"#ADADAD"}
                  className="font-pregular h-12 pl-4 w-3/4"
                  style={{ color: "white" }}
                  onChangeText={(text) => {
                    setMessageText(text);
                  }}
                  value={messageText}
                />
              </View>
              {messageText === "" && (
                <TouchableOpacity 
                  className="pr-4"
                  onPress={() => {openPicker('image')}}>
                  <Ionicons name="camera-outline" size={24} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              className="ml-3 p-3 rounded-full bg-[#3400A1]"
              onPress={sendMessage}
            >
              <Ionicons name="send" size={20} color="white" />
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
    color: "white",
  },
  pickerItem: {
    color: "white", 
    backgroundColor: "#0F0028", 
  },
});

export default Conversation;
