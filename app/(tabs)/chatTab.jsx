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

const Chat = () => {

  ////////Testing DB
  useEffect(() => {
    const runTests = async () => {
      try {
        // Wipe the database to start fresh
        await wipeDatabase();
        
        // Populate with sample data
        await populateSampleData();
        
        // Check table contents
        await checkTableContents();
      } catch (error) {
        console.error('Error running tests:', error);
      }
    };

    // Run the tests when the component mounts
    runTests();
  }, []);


  ////////


  const conversations = [
    {
      id: 1,
      participantName: "Alice Johnson",
      lastMessage: "Hello!",
      timestamp: "9:40 PM",
      readStatus: true,
    },
    {
      id: 2,
      participantName: "Bob Smith",
      lastMessage: "Sure thing.",
      timestamp: "9:35 AM",
      readStatus: true,
    },
    {
      id: 3,
      participantName: "Eve Brown",
      lastMessage: "See you there!",
      timestamp: "9:45 AM",
      readStatus: false,
    },
    {
      id: 4,
      participantName: "Charlie Davis",
      lastMessage: "What's up?",
      timestamp: "9:50 AM",
      readStatus: true,
    },
    {
      id: 5,
      participantName: "Grace Lee",
      lastMessage: "Not sure about that.",
      timestamp: "10:00 AM",
      readStatus: false,
    },
    {
      id: 6,
      participantName: "David Wilson",
      lastMessage: "Got it, thanks!",
      timestamp: "10:10 AM",
      readStatus: true,
    },
    {
      id: 7,
      participantName: "Sophia Garcia",
      lastMessage: "Sounds good.",
      timestamp: "10:15 AM",
      readStatus: true,
    },
    {
      id: 8,
      participantName: "James Taylor",
      lastMessage: "See you later.",
      timestamp: "10:20 AM",
      readStatus: false,
    },
    {
      id: 9,
      participantName: "Olivia Martinez",
      lastMessage: "Let me check.",
      timestamp: "10:30 AM",
      readStatus: true,
    },
    {
      id: 10,
      participantName: "Lucas Rodriguez",
      lastMessage: "Can't wait!",
      timestamp: "10:40 AM",
      readStatus: true,
    },
    {
      id: 11,
      participantName: "Lily Hernandez",
      lastMessage: "Will do.",
      timestamp: "10:50 AM",
      readStatus: false,
    },
    {
      id: 12,
      participantName: "Mateo Perez",
      lastMessage: "Got your message.",
      timestamp: "11:00 AM",
      readStatus: true,
    },
    {
      id: 13,
      participantName: "Emma Flores",
      lastMessage: "Sure thing!",
      timestamp: "11:10 AM",
      readStatus: true,
    },
    {
      id: 14,
      participantName: "Sebastian Sanchez",
      lastMessage: "Maybe later.",
      timestamp: "11:20 AM",
      readStatus: false,
    },
    {
      id: 15,
      participantName: "Isabella Rivera",
      lastMessage: "Busy right now.",
      timestamp: "11:30 AM",
      readStatus: true,
    },
    {
      id: 16,
      participantName: "Alexander Gomez",
      lastMessage: "Let's talk.",
      timestamp: "11:40 AM",
      readStatus: true,
    },
    {
      id: 17,
      participantName: "Sofia Diaz",
      lastMessage: "Tomorrow works.",
      timestamp: "11:50 AM",
      readStatus: false,
    },
    {
      id: 18,
      participantName: "Benjamin Torres",
      lastMessage: "Sure thing.",
      timestamp: "12:00 PM",
      readStatus: true,
    },
    {
      id: 19,
      participantName: "Victoria Ramirez",
      lastMessage: "Not sure about that.",
      timestamp: "12:10 PM",
      readStatus: false,
    },
    {
      id: 20,
      participantName: "Daniel Cruz",
      lastMessage: "Thanks a lot!",
      timestamp: "12:20 PM",
      readStatus: true,
    },
  ];

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
