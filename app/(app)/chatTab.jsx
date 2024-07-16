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
import React, { useState } from "react";
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

const Chat = () => {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        style={styles.background}
      />
      <View className="bg-[#141414] h-32 justify-center pl-6 pt-10">
        <Text className="text-white font-pmedium text-4xl ">Chat</Text>
      </View>
      <StatusBar style="light" />

      <ChatList />

      <View className="bg-[#141414] h-24">
        <BottomBar />
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

export default Chat;
