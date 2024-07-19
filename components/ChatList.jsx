import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { useRouter } from 'expo-router';

const ChatList = ({ conversations}) => {
    const router = useRouter();
    const handlePress = () => {
      console.log("Opened Chat !");
      router.push('/(app)/conversation')
    }

    const parseTimestamp = (timestamp) => {
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
    });

    return (
      <ScrollView className="flex-1 mb-24">
        {sortedConversations.map((conversation) => (
          <ChatItem
            key={conversation.id} // Assuming conversations have unique IDs
/*             name={conversation.participantName} // Get participant name from conversation object
            lastMessage={conversation.lastMessage} // Get last message from conversation object
            timestamp={conversation.timestamp} // Get timestamp from conversation object
            readStatus={conversation.readStatus} // Get read status from conversation object */
            item={conversation}
            router={router}
          />
      ))}
      </ScrollView>
    );
  };

export default ChatList