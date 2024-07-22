import { View, Text, Image } from "react-native";
import React from "react";

const MessageIcon = ({ icon }) => {
  return (
    <View>
      <Image source={icon} resizeMode="contain" className="w-7 h-7" />
    </View>
  );
};

export default MessageIcon;
