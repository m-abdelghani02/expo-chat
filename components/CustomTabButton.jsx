// CustomTabButton.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Svg, Line } from 'react-native-svg';
import useTabStore from '../hooks/useTabStore'; // Import the Zustand store

const CustomTabButton = ({ icon, color, name, focused, tab }) => {
  const onPress = useTabStore((state) => state[`on${tab}Press`]); // Get the onPress handler from Zustand

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Image
          source={icon}
          resizeMode='contain'
          style={{ width: 24, height: 24, tintColor: color }}
        />
        <Text style={{ color: color, fontSize: 12 }}>
          {name}
        </Text>
        {focused ? (
          <Svg height="2" width="42" style={{ marginTop: 4 }}>
            <Line x1="0" y1="0" x2="100%" y2="0" stroke={color} strokeWidth="4" />
          </Svg>
        ) : (
          <Svg height="2" width="42" style={{ marginTop: 4 }}>
            <Line x1="0" y1="0" x2="100%" y2="0" stroke="transparent" strokeWidth="4" />
          </Svg>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomTabButton;
