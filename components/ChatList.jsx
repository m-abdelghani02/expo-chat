import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import ChatItem from './ChatItem'
import { useRouter, useFocusEffect } from 'expo-router';

const ChatList = ({ conversations}) => {
    const router = useRouter();
    useEffect(() => {
      console.log('Conversations inside ChatList changed: ', conversations);
    

    }, [conversations])
    
    

/*     const parseTimestamp = (timestamp) => {
      const [time, period] = timestamp.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === 'PM') {
        totalMinutes += 12 * 60;
      }
      return totalMinutes;
    };
  
   const sortedConversations = conversations.sort((a, b) => {
      const timeA = parseTimestamp(a.timestamp);
      const timeB = parseTimestamp(b.timestamp);
      return timeA - timeB;
    }); */


return (
  <ScrollView className="flex-1 mb-24">
    {conversations.length > 0 ? (
      conversations.map((conversation) => (
        <ChatItem
          key={conversation.conversation_id}
          conversation={conversation}
          router={router}
        />
      ))
    ) : (
      <Text>No conversations available</Text>
    )}
  </ScrollView>
);
  };

export default ChatList