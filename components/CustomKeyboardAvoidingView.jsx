import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'

const CustomKeyboardAvoidingView = ({children}) => {
  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex:1}}
    >
        <ScrollView
            style={{flex:1}}
            bounces={false}
            showsVerticalScrollIndicator={false}
        >
            {
                children
            }
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CustomKeyboardAvoidingView