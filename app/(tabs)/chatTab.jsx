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
import { createMessage, createUser, getUsers, updateUserNumber, wipeDatabase } from "../../db/dbService";
import { authService } from "../../services/authService";
import userService from "../../services/userService";


const Chat = () => {
  
  ////////Testing DB
/*   useEffect(() => {
    const runTests = async () => {
      try {
        await wipeDatabase();
        //await populateSampleData();
        //await checkTableContents();
        console.log("\nGetting Convos...");
        await getConversations();
        console.log("\nGetting Convo by ID...");
        await getConversationById('convo1');
        console.log("\nGetting User...");
        authService.getUser();
        console.log("Getting user by ID...");
        const userById = userService.getUserById('1234567890');
        const conversationss = await getConversations();
        console.log('Conversations from hook :', conversationss);
        //console.log(userById);
      } catch (error) {
        console.error('Error running tests:', error);
      }
    };

    // Run the tests when the component mounts
    runTests();
  }, []); */


  ////////
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
        //console.log('Users...');
        //await getUsers();
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const handleConversationCreated = ({ sender_id, recipient_id, username }) => {
      Alert.alert('New Conversation', `A new conversation has been created! Sender ID: ${sender_id}, Recipient ID: ${recipient_id}, Username: ${username}`);
      try {
        // Show alert with conversation details
        Alert.alert('New Conversation', `A new conversation has been created! Sender ID: ${sender_id}, Recipient ID: ${recipient_id}, Username: ${username}`);
        const conversationId = [sender_id, recipient_id].sort().join('_');
        // Create user if not exists
        createUser({
          phone_number: sender_id, 
          username: username, 
          public_key: 'default_public_key',
          profile_pic: 'default_profile_pic',
        });

        // Create conversation
        const newConversation = {
          conversation_id: conversationId, // Example ID generation
          user1_id: recipient_id, // Current user's ID
          user2_id: sender_id, // The phone number or ID of the recipient
          last_message_id: null, // Initial last message ID
        };
        createConversation(newConversation);
        console.log('Conversation created:', newConversation);
        createMessage({ message_id: 'message1', conversation_id: conversationId, sender_id, recipient_id, content: 'Hello' });
        updateLastMessageId({ conversation_id: conversationId, last_message_id: 'message1' });
        
        fetchConversations();

      } catch (error) {
        console.log('Error handling conversation creation:', error);
      }
    };

    const initialize = async () => {
      await connectSocket();
      fetchConversations();

      if (socketService.socket) {
        socketService.socket.on('conversationCreated', handleConversationCreated);
      }
    };

    initialize();

    return () => {
      if (socketService.socket) {
        socketService.socket.off('conversationCreated', handleConversationCreated);
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
{/*       {loading ? (
      <Text>Loading...</Text>
    ) : error ? (
      <Text>Error loading conversations</Text>
    ) : (
      <Text className='text-white'>Conversations: {conversations[0].conversation_id}</Text>
    )} */}

      <ChatList conversations={conversations}  />
{/*       <View className='absolute -bottom-4 w-full z-10'>
        <TouchableOpacity className='flex-1 justify-center items-center mb-28'>
          <View className={'items-center justify-center w-16 h-16 rounded-full bg-[#3400A1]'}>
          <Image
            source={require('../../assets/message-icon.png')}
            resizeMode='contain'
            className='w-7 h-7'
            /> 
          </View>
        </TouchableOpacity> 
      </View> */}
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
    height: height + 100+ Constants.statusBarHeight + 1,
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

export default Chat;
