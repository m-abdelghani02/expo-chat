import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import * as Contacts from 'expo-contacts';
import { createConversationHandler } from "../../handlers/createConversationHandler"; // Import your handler
import { conversationExists } from "../../db/dbService";
import { authService } from "../../services/authService";

const ContactsTab = () => {
  const [contacts, setContacts] = useState([]);
  const [expandedContact, setExpandedContact] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      console.log('Status', status);
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name, Contacts.Fields.Image],
        });

        const filteredData = data.filter(contact => contact.name && contact.phoneNumbers && contact.phoneNumbers.length > 0);

        if (filteredData.length > 0) {
          setContacts(filteredData);
        }
      }
    })();
  }, []);

  const toggleExpandContact = (contact) => {
    setExpandedContact(expandedContact === contact ? null : contact);
  };

  const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, ''); // Remove all non-digit characters
  };

  const handleChatPress = async (phoneNumber) => {
    try {
      console.log(phoneNumber);
      const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
      console.log('Before get user');
      const user = await authService.getUser();
      console.log('after get user');
      const userId = user.phone_number;
      const user1_id = userId; 
      const user2_id = normalizedPhoneNumber;
      console.log('User IDs:', user1_id, user2_id);
      const conversationExistsInDb = await conversationExists(user1_id, user2_id);
      console.log('Conversation exists in contacts =', conversationExistsInDb);
      if (conversationExistsInDb) {
        const conversation_id = conversationExistsInDb.conversation_id;
        console.log('Conversation id =', conversation_id);
        router.push({ pathname: '/conversation', params: { conversation_id } });
      } else {
        await createConversationHandler(phoneNumber);
        Alert.alert('Conversation Created', `Started a chat with ${phoneNumber}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not start a chat');
    }
  };

  const renderPhoneNumbers = (contact) => {
    const phoneNumbersSet = new Set(contact.phoneNumbers.map(phone => normalizePhoneNumber(phone.number)));
    return Array.from(phoneNumbersSet).map((number, idx) => (
      <View key={idx} className="flex-row justify-between items-center">
        <Text className="text-base text-white">{number}</Text>
        <TouchableOpacity
          className="bg-[#3400A1] p-2 rounded-full shadow-lg"
          onPress={() => handleChatPress(number)}
        >
          <Text className="text-white">Chat</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#100025", "rgba(1, 0, 2, 1)"]}
        className="absolute left-0 right-0 top-0"
        style={{ height: Dimensions.get("window").height + 100 + Constants.statusBarHeight + 1 }}
      />
      <View className="bg-[#141414] h-32 justify-center pl-6 pt-10 mb-5">
        <Text className="text-white font-medium text-4xl">Contacts</Text>
      </View>
      <ScrollView>
        {contacts.map((contact, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center p-4"
            onPress={() => toggleExpandContact(contact)}
          >
            <Image
              source={contact.imageAvailable ? { uri: contact.image.uri } : require('../../assets/default-image.jpg')}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View>
              <Text className="text-lg font-bold text-white">{contact.name}</Text>
              {expandedContact === contact && renderPhoneNumbers(contact)}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ContactsTab;
