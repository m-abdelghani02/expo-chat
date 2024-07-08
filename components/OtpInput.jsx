import { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const OtpInput = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
    
    const numericValue = value.replace(/[^0-9]/g, '');

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    
    if (numericValue !== '') {
      if (index < length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (index > 0) {
      inputRefs.current[index - 1].focus();
    }

    
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => (inputRefs.current[index] = ref)}
          keyboardType="numeric"
          maxLength={1}
          value={digit}
          onChangeText={value => handleInputChange(index, value)}
          className='rounded-2xl bg-[#0F0028] text-white font-pregular text-3xl text-center w-12 h-14 border border-solid border-[#190043] pt-2'
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}); 

export default OtpInput;
