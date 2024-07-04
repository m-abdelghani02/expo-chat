import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'


const OnboardLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name='screen1' 
          options={{headerShown:false}} />
        <Stack.Screen 
          name='screen2' 
          options={{headerShown:false}} />
        <Stack.Screen 
          name='screen3' 
          options={{headerShown:false}} />
      </Stack>

      <StatusBar backgroundColor="#161622" style='light'/>
    </>
  )
}

export default OnboardLayout