import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Constants from 'expo-constants';
import { StatusBar } from "expo-status-bar";
import OnboardingButton from "../components/OnboardingButton";
import * as socketService from '../services/socketService';
const App = () => {
  console.log(height);

  
  return (
    
    <View className='flex-1'> 
      <StatusBar style="light" /> 
      <LinearGradient 
        colors={['#100025', 'rgba(1, 0, 2, 1)']}
        style={styles.background} 
      />
      <SafeAreaView className='flex-1 items-center justify-center px-8 pb-32 pt-16'> 
        <View className='mb-16'>
          <Image source={require('../assets/getstarted.png')} className="w-72 h-72"/>
        </View>
        
        <View className='justify-center'>
          <Text className='text-white font-pmedium text-3xl'>
          Privacy Isn't an Option,
          </Text>
          <Text className='text-[#FFA800] font-pmedium text-3xl mt4'>It's a <Text className='text-[#FFA800] font-pbolditalic text-3xl'>Right.</Text></Text>
          <Text className='text-white font-plight text-[18px] mt-4'>"End-to-end encrypted. No metadata stored. Your privacy guaranteed."</Text>
        </View>
        <View className='w-full mt-8'>
        <OnboardingButton
            title='Get Started'
            handlePress={() => {router.push('/screen1')}}
            containerStyles='bg-[#3400A1] mt-10'
            isLoading = {false}
            textStyles={'text-white font-pregular text-[15px]'}
            /> 
        </View>

        <View className="absolute bottom-3 right-1"> 
          <Link href="login" className="text-white font-plight">Already a member?</Link>
        </View>
      </SafeAreaView>
    </View>
    
  );
};
const  height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height + Constants.statusBarHeight+1,
  },
  content: { // Center content
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#fff',
  },
});


export default App;
