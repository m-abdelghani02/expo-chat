import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
const Phone = () => {
  
  const width = Dimensions.get('window').width;
  const lineWidth = width * 0.42;
  const margin = width * 0.05;
  const svgWidth = lineWidth * 2 + 2 * margin;
  const strokeWidth = 5;
  const svgHeight = strokeWidth;
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
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
            <Line x1={margin} y1={svgHeight / 2} x2={margin + lineWidth-4} y2={svgHeight / 2} stroke='#3400A1' strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Line x1={margin + lineWidth+4} y1={svgHeight / 2} x2={margin + 2 * lineWidth} y2={svgHeight / 2} stroke="white" strokeWidth={strokeWidth} strokeLinecap="round"/>
          </Svg>
        </View>
        <View className='justify-center pt-8 w-full'>
          <Text className='text-white font-pmedium text-3xl'>
          Enter your Phone Number
          </Text>
          <Text className='text-white font-plight text-[18px] mt-4'>
            We'll need to verify your number 
          </Text>
        </View>

        <View className='w-full h-12 bg-[#0F0028] rounded-3xl mt-20'>
        <Picker
        selectedValue={selectedCountry}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        
        onValueChange={(itemValue) => setSelectedCountry(itemValue)}
        >
        {
          countries.map((country) => (
            <Picker.Item key={country.code} label={country.country} value={country} 
            style={{
              inputAndroid: styles.inputAndroid,
            }} />
          ))
          
          
        }
        </Picker>
        </View>
        {selectedCountry && (
          <View className='w-full mt-8 flex flex-row justify-center space-x-4'>
            <View className='bg-[#0F0028] rounded-3xl h-12 justify-center items-center w-1/4'>
              <Text className='text-white'>{selectedCountry.code}</Text>
            </View>
            <View className='bg-[#0F0028] rounded-3xl h-12 justify-center items-center w-3/4'>
              <TextInput className='text-white' 
                placeholder="Enter your phone number"
                placeholderTextColor="gray"
                keyboardType="phone-pad" 
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
        )}
        <View className='bottom-0 absolute self-center mb-20 w-full'>
          <OnboardingButton 
            title="Send Code" 
            handlePress={() => {router.push('verify')}}
            containerStyles='bg-[#3400A1] w-full' 
            textStyles={'text-white font-pregular text-[15px]'} 
            isLoading={false} />
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

export default Phone