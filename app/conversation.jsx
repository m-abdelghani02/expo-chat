import React, { useState } from "react";
import {
  Dimensions,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

const Conversation = () => {
  const item = useLocalSearchParams();
  const router = useRouter();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: uuid.v4(),
      text: "Good Afternoon!",
      type: "received",
      time: "12:34",
      isRead: true,
    },
    {
      id: uuid.v4(),
      text: "Lorem ipsum",
      type: "sent",
      time: "11:57",
      isRead: true,
    },
    {
      id: uuid.v4(),
      text: "Suspendisse pretium, purus",
      type: "sent",
      time: "12:40",
      isRead: true,
    },
    {
      id: uuid.v4(),
      text: "Aenean lobortis gravida quo augue, sed tristique",
      type: "sent",
      time: "13:43",
      isRead: false,
    },
  ]);

  const sendMessageHandler = () => {
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
  };

    const handleKeyPress = (event) => {
    if (event.nativeEvent.key === "Enter") {
      sendMessageHandler();
    }
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
              onPress={sendMessageHandler}
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
