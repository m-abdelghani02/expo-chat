import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { router } from 'expo-router';

const ChatList = () => {
    const chatItems = Array.from({ length: 15 }, (_, index) => index + 1); // Create an array of numbers from 1 to 15
    const handlePress = () => {
      console.log("Opened Chat !");
      router.push('/conversation')
    }
    return (
      <ScrollView className="flex-1">
        {chatItems.map((item, index) => (
          <ChatItem key={item} name={`User ${index+1}`} onPressHandler={handlePress}/> 
        ))}
      </ScrollView>
    );
  };

export default ChatList