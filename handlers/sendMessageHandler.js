import * as messageService from '../services/messageService.js';
import {authService} from '../services/authService.js';
import { uuid } from 'expo-modules-core';

export const sendMessageHandler = async ({ message_id, conversation_id, content, recipient_id }) => {
  const user = authService.getUser();
  const messageData = {message_id ,conversation_id, sender_id: user.phone_number, recipient_id, content };
  console.log("Message data inside handler:", messageData);
  try { 
      const success = await messageService.sendMessage(messageData);
      if (success) {
        console.log('Message sent successfully');
        return success;
      } else {
        throw new Error('Error sending message');
        return false;
      }
  } catch (error) {
    
  }
};
