import { Dimensions, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Constants from 'expo-constants';
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker';
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView';
import { authService } from '../../services/authService';
import { router } from "expo-router";

const ProfileSetup = () => {
  const width = Dimensions.get('window').width;
  const lineWidth = width * 0.42;
  const margin = width * 0.05;
  const svgWidth = lineWidth * 2 + 2 * margin;
  const strokeWidth = 5;
  const svgHeight = strokeWidth;
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      console.log('Success');
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const user = {
        phone_number: phoneNumber,
        username: name,
        public_key: 'default',
        profile_pic: selectedImage || 'default', // Use selectedImage or default
        bio: bio, // Include bio
      };

      // Save user to secure storage
      await authService.setUser(user);
      console.log('User set', await authService.getUser());

      // Navigate to chat screen
      router.push('/chatTab');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <CustomKeyboardAvoidingView className='flex-1'>
      <StatusBar style="light" />
      <LinearGradient 
        colors={['#100025', 'rgba(1, 0, 2, 1)']}
        style={styles.background} 
      />
      <SafeAreaView className='flex-1 items-center px-8'>
        <View className='w-full items-end'>
          <TouchableOpacity 
            onPress={() => { router.push('/chatTab') }}>
            <Text className='text-white font-plight'>
              Skip 
            </Text>
          </TouchableOpacity>

        </View>
        <View className='justify-center pt-8 w-full'>
          <Text className='text-white font-pmedium text-3xl'>
            Welcome to Enigma!
          </Text>
          <Text className='text-[#FFA800] font-plight text-[16px] mt-4'>
            Let's personalize your experience! 
          </Text>
          <Text className='text-white font-plight text-[16px] mt-4'>
            Add a profile picture and tell us your name so your friends can easily find you. 
          </Text>
        </View>

        <View className='bg-[#0F0028] justify-center items-center rounded-full mt-14'>
          <TouchableOpacity
            onPress={() => { openPicker('image') }}
            className="w-40 h-40 justify-center items-center"
          >
            {selectedImage ? (
              <Image 
                source={{ uri: selectedImage }} 
                className="w-full h-full rounded-full" 
              />
            ) : (
              <Image
                source={require('../../assets/ImageIcon.png')}
                className="w-8 h-8"
              />
            )}
          </TouchableOpacity>
        </View>

        <View className='bg-[#0F0028] rounded-3xl h-12 justify-center w-full mt-6'>
          <TextInput className='text-white pl-6' 
            placeholder="Name"
            placeholderTextColor="gray"
            keyboardType="default" 
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className='bg-[#0F0028] rounded-3xl h-20 w-full mt-6'>
          <TextInput className='text-white pl-6' 
            placeholder="Bio"
            placeholderTextColor="gray"
            multiline={true}
            numberOfLines={6}
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <View className='bg-[#0F0028] rounded-3xl h-12 justify-center w-full mt-6'>
          <TextInput className='text-white pl-6' 
            placeholder="Phone Number"
            placeholderTextColor="gray" 
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View className='w-16 self-end justify-end mb-10 mt-20'>
          <TouchableOpacity 
            onPress={handleSaveProfile}
            activeOpacity={0.7}
            className={`bg-[#3400A1] rounded-3xl min-h-[62px] justify-center items-center`}
          >
            <Text className={`text-lg text-white`}>
              ➜
            </Text>
          </TouchableOpacity> 
        </View>
      </SafeAreaView>
    </CustomKeyboardAvoidingView>
  );
};

const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height + Constants.statusBarHeight + 1,
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

export default ProfileSetup;
