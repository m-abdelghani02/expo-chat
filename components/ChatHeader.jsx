import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
const ChatHeader = ({user, router}) => {
  return (
    <Stack.Screen
        options={{
            title:'',
            headerShadowVisible:false,
            headerTintColor:'white',
            headerBackground:() => <View className="bg-[#141414] h-full"/> ,
            headerTransparent:true,
            headerLeft: () => (
              <View className='flex-row items-center gap-2 pl-2'>
                    <TouchableOpacity onPress={() => {
                        router.back()
                    }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className='flex-row items-center gap-x-3'>
                        <Image
                            source={{ uri: 'https://avatar.iran.liara.run/public/boy' }} 
                            className="w-12 h-12 rounded-full" 
                        />
                        <View>
                            <Text className='text-white font-pmedium text-lg'>{user.participantName}</Text>
                            <Text className='text-[#ADADAD] font-plight'>Online</Text>
                        </View>
                        
                    </View>
                    
              </View>
            ),
            headerRight: () => (
                <View className='flex-row items-center gap-x-8'>
                    <Ionicons name="call-outline" size={24} color="white" />
                    <Ionicons name="videocam-outline" size={24} color="white" />
                </View>
            )
        }}
    />
  )
}

export default ChatHeader