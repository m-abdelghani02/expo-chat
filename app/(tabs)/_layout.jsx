import { View, Text, Image, TouchableOpacity } from 'react-native'
import {Tabs, Redirect} from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import TabBarBackground from '../../components/TabBarBackground';
import { Line, Svg } from 'react-native-svg';


const TabIcon = ({icon, color, name, focused}) => {
  return(
    <View className={'items-center justify-center gap-2'}>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-6 h-6'
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-plight'} text-xs`}
        style={{color: color}}>
        {name}
      </Text>
      {focused ? 
        <Svg height="2" width="42" style={{ marginTop: 4 }}>
          <Line x1="0" y1="0" x2="100%" y2="0" stroke={color} strokeWidth="4" />
        </Svg>
        :
        <Svg height="2" width="42" style={{ marginTop: 4 }}>
          <Line x1="0" y1="0" x2="100%" y2="0" stroke={'transparent'} strokeWidth="4" />
        </Svg>
      }
  
    </View>
  )
}


const TabsLayout = () => {
  return (
    <>
    <Tabs 
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#6DAEDB',
        tabBarInactiveTintColor: '#ADADAD',
        tabBarLabelStyle:{marginBottom:20, },
        tabBarStyle:{
          backgroundColor:'#141414',
          height:90,
          borderTopWidth:0,
          borderTopLeftRadius:20,
          borderTopRightRadius:20,
          position:'absolute',
        },
        
        /* tabBarBackground: () => <TabBarBackground />, */
      }}
    >
      <Tabs.Screen
        name="chatTab"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={require('../../assets/chatIcon.png')} // Replace with your chat icon path
              color={color}
              name="Chat"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={
          {
            title:'Notes',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={require('../../assets/notes-icon.png')} // Replace with your chat icon path
                color={color}
                name="Notes"
                focused={focused}
              />
            ),
          }
        }
      />
      <Tabs.Screen
        name="contactsTab"
        options={{
          title: 'Contacts',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={require('../../assets/contacts-icon.png')} // Replace with your chat icon path
              color={color}
              name="Contacts"
              focused={focused}
            />)
        }}
      />
      <Tabs.Screen
        name="call"
        options={{
          title: 'Call',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={require('../../assets/phone-icon.png')} // Replace with your chat icon path
              color={color}
              name="Call"
              focused={focused}
            />)
        }}
      />
    </Tabs>
    </>
  )
}

export default TabsLayout