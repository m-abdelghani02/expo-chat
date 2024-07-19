import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const ChatItem = ({item, router, messageLength = 30}) => {
    console.log('Name= ', item.participantName);

    const openChat = () => {
      router.push({pathname: '/conversation', params:item});
    }
    const ReadIcon = () => {
      if (item.readStatus) { // Check if readStatus is true (assuming true means read)
        return <Image source={require('../assets/read.png')} />;
      } else {
        return <Image source={require('../assets/unread.png')} />;
      }
    };

    const truncateText = (text, maxLength) => {
      return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };
  
    const displayedMessage = truncateText(item.lastMessage || "", messageLength); // Handle missing lastMessage
  
    return (
        <TouchableOpacity className="flex-row items-center px-4 py-2" onPress={openChat}>
          <Image
            source={{ uri: 'https://avatar.iran.liara.run/public/boy' }} // Replace with your image URL
            className="w-14 h-14 rounded-full mr-3" 
          />
          <View className="flex-1 flex-row justify-between">

            <View>
              <Text className="text-white font-pmedium text-lg">{item.participantName}</Text>
              <View className="flex-row items-center"> 
                <ReadIcon />
                <Text className="text-gray-400 text-xs font-plight pl-2">{displayedMessage}</Text>
              </View>
            </View>

            <Text className="text-gray-500 text-xs">{item.timestamp}</Text>

          </View>
        </TouchableOpacity>
      );
    };

export default ChatItem