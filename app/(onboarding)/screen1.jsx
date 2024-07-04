import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Constants from 'expo-constants';
import { StatusBar } from "expo-status-bar";
import OnboardingButton from "../../components/OnboardingButton";
const Screen1 = () => {
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
          <Image source={require('../../assets/Screen1.png')} className="w-72 h-72"/>
        </View>

        <View className='justify-center pt-8'>
          <Text className='text-white font-pmedium text-3xl textce'>
          Your Conversations are <Text className='text-[#3400A1] font-pbolditalic text-3xl'>Private</Text>
          </Text>
          <Text className='text-white font-plight text-[18px] mt-4'>We use end-to-end encryption, so only <Text className='text-[#FFA800]'>you </Text><Text>and </Text><Text className='text-[#FFA800]'>your recepient</Text><Text> can read your messages. Not even we can access them.</Text></Text>
        </View>


      </SafeAreaView>
      <View className='w-16 self-end justify-end mx-6 mb-10'>
          <TouchableOpacity 
              onPress={() => {
                router.push('screen2');
              }}
              activeOpacity={0.7}
              className={`bg-[#3400A1] rounded-3xl min-h-[62px] justify-center items-center`}
              >
            <Text className={`text-lg text-white`}>
                ➜
            </Text>
          </TouchableOpacity> 
        </View>
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


export default Screen1;
