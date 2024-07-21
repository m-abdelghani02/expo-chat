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
import { useLocalSearchParams } from "expo-router";
import MessageList from "../components/MessageList";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import * as ImagePicker from 'expo-image-picker';
import { getConversationMessages } from '../services/messageService';
import { sendMessageHandler } from '../handlers/sendMessageHandler';
import { getConversationById } from "../services/conversationService";
import { authService } from "../services/authService";
import * as socketService from '../services/socketService';

const Conversation = () => {
  const item = useLocalSearchParams();
  const conversationId = Object.values(item).join('');
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [convDetails, setConvDetails] = useState({});
  const [user2_id, setUser2_id] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const conversationMessages = await getConversationMessages(conversationId);
        console.log('Fetched Messages:', conversationMessages);

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
    };

    const handleMessageReceived = (message) => {
      console.log('Received message:', message);
      receiveMessage(message);
    };

    const initializeSocket = async () => {
      if (!socketService.socket) {
        console.log('Attempting to connect socket...');
        await socketService.connect();
      } else {
        console.log('Socket already connected');
      }

      if (socketService.socket) {
        socketService.socket.on('messageSent', handleMessageReceived);
        console.log('Listener for messageSent added');
      }
    };

    initializeSocket();

    fetchConvDetails();
    fetchMessages();

    return () => {
      if (socketService.socket) {
        socketService.socket.off('messageSent', handleMessageReceived);
        console.log('Listener for messageSent removed');
      }
    };
  }, [conversationId]);

  const sendMessage = async () => {
    const newMessageId = uuid.v4();
    const newMessage = {
      id: newMessageId,
      text: messageText,
      type: "sent",
      time: formatTimestamp(new Date()),
      isRead: false,
      status: "pending",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageText("");

    const sentMessageData = { message_id: newMessageId, conversation_id: conversationId, content: messageText, recipient_id: user2_id };
    console.log("Sending from conversation", sentMessageData);

    const success = await sendMessageHandler(sentMessageData);

    if (success) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessageId ? { ...msg, status: "sent" } : msg
        )
      );
    } else {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessageId ? { ...msg, status: "failed" } : msg
        )
      );
      console.error('Error sending message');
    }
  };

  const receiveMessage = (message) => {
    const transformedMessage = {
      id: message.message_id,
      text: message.content,
      type: 'received',
      time: formatTimestamp(new Date()), // Adjust if timestamp is provided
      isRead: false,
    };
    setMessages((prevMessages) => [...prevMessages, transformedMessage]);
  };

  const transformMessages = (messages) => {
    return messages.map((message) => ({
      id: message.message_id,
      text: message.content,
      type: message.sender_id === authService.getUser().phone_number ? 'sent' : 'received',
      time: formatTimestamp(message.timestamp),
      isRead: false,
    }));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      console.log('Success');
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        style={styles.background}
      />
      <ChatHeader user={item} />
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
                  onPress={() => { openPicker('image') }}>
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
});

export default Conversation;
