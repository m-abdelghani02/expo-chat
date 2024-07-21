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
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import OnboardingButton from "../../components/OnboardingButton";
import Svg, { Line } from "react-native-svg";
import countries from "../../assets/countries.json";
import { Picker } from "@react-native-picker/picker";
import BottomBar from "../../components/BottomBar";
import ChatItem from "../../components/ChatItem";
import ChatList from "../../components/ChatList";
import { checkTableContents, initDatabase, populateSampleData, wipeDatabase } from "../../db/dbService";
import { getConversationById, getConversations } from "../../services/conversationService";
import { getConversationMessages } from "../../services/messageService";
import { authService } from "../../services/authService";
import userService from "../../services/userService";
import useConversations from "../../hooks/useConversations";

const Chat = () => {
  
/*   ////////Testing DB
  useEffect(() => {
    const runTests = async () => {
      try {
        await wipeDatabase();
        await populateSampleData();
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

  useEffect(() => {
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

    fetchConversations();
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
