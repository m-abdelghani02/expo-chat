import { View, Text, Image } from "react-native";
import React from "react";

const ChatBubble = ({ text, type, time, isConsecutive, isRead }) => {
  let readIcon;
  if (type === "sent") {
    readIcon = isRead
      ? require("../assets/read.png")
      : require("../assets/unread.png");
  } else {
    readIcon = null;
  }

  return (
    <View className={`flex ${type === "received" ? "self-start" : "self-end"}`}>
      <View
        className={`px-4 py-2 rounded-lg w-3/4 ${
          type === "received" ? "bg-[#2C2C2C]" : "bg-[#3400A1]"
        } ${isConsecutive ? "mt-1" : "mt-4"}`}
      >
        <Text
          className={`text-base font-pregular ${
            type === "received" ? "text-white" : "text-white"
          }`}
        >
          {text}
        </Text>
        <View className="flex flex-row items-center mt-1">
          <Text
            className={`text-xs ${
              type === "received" ? "text-white" : "text-white"
            } text-right`}
          >
            {time}
          </Text>
          {type === "sent" && <Image source={readIcon} className="ml-1" />}
        </View>
      </View>
    </View>
  );
};

export default ChatBubble;
