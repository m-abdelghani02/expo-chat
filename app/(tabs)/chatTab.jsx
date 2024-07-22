import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import ChatList from "../../components/ChatList";
import { createConversation, getConversationById, getConversations, updateLastMessageId } from "../../services/conversationService";
import * as socketService from '../../services/socketService';
import { MaterialIcons } from "@expo/vector-icons"; 
import { createConversationHandler } from "../../handlers/createConversationHandler";
import { createMessage, createUser, getUsers, initDatabase, updateUserNumber, wipeDatabase } from "../../db/dbService";
import { authService } from "../../services/authService";
import userService from "../../services/userService";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const connectSocket = async () => {
      try {
        if (!socketService.socket) {
          console.log("Attempting to connect socket");
          socketService.connect();
        } else {
          console.log("Socket already connected");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchConversations = async () => {
      try {
        const fetchedConversations = await getConversations();
        setConversations(fetchedConversations);
        console.log('Convoooooooos:', fetchedConversations);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const handleConversationCreated = ({ sender_id, recipient_id, username }) => {
      try {
        createUser({
          phone_number: sender_id,
          username: username,
          public_key: 'default_public_key',
          profile_pic: 'default_profile_pic',
        });

        createUser({
          phone_number: recipient_id,
          username: username,
          public_key: 'default_public_key',
          profile_pic: 'default_profile_pic',
        });

        const conversationId = [sender_id, recipient_id].sort().join('_');
        
        const newConversation = {
          conversation_id: conversationId,
          user1_id: recipient_id,
          user2_id: sender_id,
          last_message_id: null,
        };
        createConversation(newConversation);

        createMessage({ message_id: 'message1', conversation_id: conversationId, sender_id, recipient_id, content: 'Hello' });
        updateLastMessageId({ conversation_id: conversationId, last_message_id: 'message1' });

        fetchConversations();
      } catch (error) {
        console.log('Error handling conversation creation:', error);
      }
    };
    
    const handleMessageReceived = (message) => {
      console.log('Received message:', message);
      receiveMessage(message);
    };

    const receiveMessage = async (message) => {
      console.log('Received message data in chatTab=', message);
      const { message_id, conversation_id, sender_id, recipient_id, content } = message;
      const transformedMessage = {
        id: message_id,
        text: content,
        type: 'received',
        time: formatTimestamp(new Date()),
        isRead: false,
      };
      
      // Update the conversations state
      setConversations((prevConversations) => {
        return prevConversations.map(convo =>
          convo.conversation_id === conversation_id
            ? { ...convo, last_message: transformedMessage }
            : convo
        );
      });

      const storedMessage = {
        message_id: message_id,
        conversation_id: conversation_id,
        sender_id: sender_id,
        recipient_id: recipient_id,
        content: content
      };
      await createMessage(storedMessage);
      console.log('Updating conversation', conversation_id, 'with last_message_id', message_id);
      updateLastMessageId({ conversation_id: conversation_id, last_message_id: message_id });
    };

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const initialize = async () => {
      await connectSocket();
      fetchConversations();

      if (socketService.socket) {
        socketService.socket.on('conversationCreated', handleConversationCreated);
        socketService.socket.on('messageSent', handleMessageReceived);
      }
    };

    initialize();

    return () => {
      if (socketService.socket) {
        socketService.socket.off('conversationCreated', handleConversationCreated);
        socketService.socket.off('messageSent', handleMessageReceived);
      }
    };
  }, []);

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        style={styles.background}
      />
      <View className="bg-[#141414] h-32 justify-center pl-6 pt-10 mb-5">
        <Text className="text-white font-pmedium text-4xl ">Chat</Text>
      </View>
      <ChatList conversations={conversations} />
      <View className ='absolute bottom-28 right-6 flex-row'>
        <TouchableOpacity
          onPress={() => {
            createConversationHandler(phoneNumber);
            console.log(phoneNumber);
          }}
          className="bg-[#3400A1] p-4 rounded-full shadow-lg"
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          placeholder="Type a number..."
          placeholderTextColor="#ADADAD"
          cursorColor={"#ADADAD"}
          className="font-pregular h-12 pl-4 w-3/4"
          style={{ color: "white" }}
          onChangeText={(text) => {
            setPhoneNumber(text);
          }}
          value={phoneNumber}
        />
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
    height: height + 100 + Constants.statusBarHeight + 1,
  },
});

export default Chat;
