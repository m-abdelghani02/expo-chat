import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const ChatItem = ({name, onPressHandler}) => {
    console.log('Name= ', name);
    return (
        <TouchableOpacity className="flex-row items-center px-4 py-2" onPress={onPressHandler}>
          <Image
            source={{ uri: 'https://avatar.iran.liara.run/public/boy' }} // Replace with your image URL
            className="w-14 h-14 rounded-full mr-3" 
          />
          <View className="flex-1 flex-row justify-between">

            <View>
              <Text className="text-white font-pmedium text-lg">{name}</Text>
              <View className="flex-row items-center"> 
                <Image source={require('../assets/read.png')}/>
                <Text className="text-gray-400 text-xs font-plight pl-2">Hello world</Text>
              </View>
            </View>

            <Text className="text-gray-500 text-xs">Just Now</Text>

          </View>
        </TouchableOpacity>
      );
    };

export default ChatItem