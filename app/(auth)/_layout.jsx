import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'


const AuthLayout = () => {
  return (
    <>
      <Stack 
        screenOptions={{animation:'none', animationDuration:2000}}
      >
        <Stack.Screen 
          name='phone'
          options={{headerShown:false}} />
        <Stack.Screen 
          name='verify'
          options={{headerShown:false}} />
      </Stack>

      <StatusBar backgroundColor="#161622" style='light'/>
    </>
  )
}

export default AuthLayout