import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getConversationById } from '../services/conversationService';
import { getConversationMessages } from '../services/messageService';
import userService from '../services/userService';

const ChatItem = ({ conversation, router, messageLength = 30 }) => {
  const [conversationData, setConversationData] = useState(null);
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const readStatus = true;
  const { conversation_id } = conversation;

  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        console.log('convoooo id', conversation_id);
        const fetchedConversation = await getConversationById(conversation_id);
        const user2_id = fetchedConversation.user2_id;

        // Fetch user data for user2
        const user2 = await userService.getUserById(user2_id);

        // Fetch messages for the conversation
        const fetchedMessages = await getConversationMessages(conversation_id);

        // Update conversation with retrieved user2 data and messages
        const enrichedConversation = {
          ...fetchedConversation,
          user2_name: user2.username,
          messages: fetchedMessages,
        };
        setConversationData(enrichedConversation);
        setFetchedMessages(fetchedMessages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversationData();
  }, [conversation_id]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!conversationData) return null;

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const { user2_name } = conversationData;
  const lastMessage = fetchedMessages.length > 0 ? fetchedMessages[fetchedMessages.length - 1] : { content: "No messages", timestamp: "" };
  const displayedMessage = truncateText(lastMessage.content || "", messageLength);

  const openChat = () => {
    router.push({ pathname: '/conversation', params: { conversation_id } });
  };

  const ReadIcon = () => {
    return readStatus ? (
      <Image source={require('../assets/read.png')} />
    ) : (
      <Image source={require('../assets/unread.png')} />
    );
  };

  return (
    <TouchableOpacity className="flex-row items-center px-4 py-2" onPress={openChat}>
      <Image
        source={{ uri: 'https://avatar.iran.liara.run/public/boy' }} // Replace with your image URL
        className="w-14 h-14 rounded-full mr-3"
      />
      <View className="flex-1 flex-row justify-between">
        <View>
          <Text className="text-white font-pmedium text-lg">{user2_name}</Text>
          <View className="flex-row items-center">
            <ReadIcon />
            <Text className="text-gray-400 text-xs font-plight pl-2">{displayedMessage}</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-xs">{lastMessage.timestamp || "No messages"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
