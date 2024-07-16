import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Constants from 'expo-constants';
import { StatusBar } from "expo-status-bar";
import OnboardingButton from "../../components/OnboardingButton";
import Svg, { Line } from 'react-native-svg';
import countries from '../../assets/countries.json';
import { Picker } from "@react-native-picker/picker";
import OtpInput from '../../components/OtpInput';
const Verify = () => {
  

  const checkVerification = async (to, code) => {
    try {
      const response = await fetch('https://verify-1704-mk2iol.twil.io/check-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, code }), 
      });
  
      const data = await response.json();
      console.log(data); // Log the response for debugging
  
      if (data.success) {
        Alert.alert('Success', 'Verification successful');
        router.push('profileSetup');
      } else {
        // Handle verification failure (display error message)
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      // Handle network errors or other exceptions
    }
  };

  const width = Dimensions.get('window').width;
  const lineWidth = width * 0.42;
  const margin = width * 0.05;
  const svgWidth = lineWidth * 2 + 2 * margin;
  const strokeWidth = 5;
  const svgHeight = strokeWidth;
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  console.log('Selected Country =', selectedCountry);
  return (
    
    <View className='flex-1'> 
      <StatusBar style="light" /> 
      <LinearGradient 
        colors={['#100025', 'rgba(1, 0, 2, 1)']}
        style={styles.background} 
      />
      <SafeAreaView className='flex-1 items-center px-8 pt-4 '> 
        <View className='justify-center pt-8'>
          <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <Line x1={margin} y1={svgHeight / 2} x2={margin + lineWidth-4} y2={svgHeight / 2} stroke='white' strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Line x1={margin + lineWidth+4} y1={svgHeight / 2} x2={margin + 2 * lineWidth} y2={svgHeight / 2} stroke="#3400A1" strokeWidth={strokeWidth} strokeLinecap="round"/>
          </Svg>
        </View>
        <View className='justify-center pt-8 w-full'>
          <Text className='text-white font-pmedium text-3xl'>
          Verifying your Number
          </Text>
          <Text className='text-white font-plight text-[18px] mt-4 text-center'>
          Waiting for you to enter the verification code sent to 
          {"\n"}+213 543 65 38 23
          </Text>
        </View>

        <View className='w-full mt-8'>
          <OtpInput length={6} onComplete={otp => {console.log(otp); setOtpCode(otp)}} />
        </View>

        <View className ='mt-8'>
          <Text className='text-white font-plight text-[18px] text-center'>Enter the 6-digit code</Text>
          <Text className='text-[#FFA800] font-plight text-[18px] mt-2 text-center'>Not getting a code ?</Text>
        </View>
        <Image source={require('../../assets/Verify.png')}/>
        
        <Text className='text-white font-plight text-[18px] mt-6 text-center'>Resend Code 0:34</Text>

        <View className='self-center mb-20 w-full mt-10'>
          <OnboardingButton title="Continue" handlePress={() => checkVerification('+213541253104', otpCode)}
            containerStyles='bg-[#3400A1] w-full' textStyles={'text-white font-pregular text-[15px]'} isLoading={false} />
        </View>
      </SafeAreaView>
    </View>
    
  );
};
const height = Dimensions.get('window').height;
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
  picker: {
    color: 'white', // Set the Picker text color to white
    
  },
  pickerItem: {
    color: 'white', // Set the Picker item text color to white
    paddingLeft: 10, // Add some padding to the left of the Picker
    backgroundColor: '#0F0028', // Set the Picker item background color
  },
});

export default Verify