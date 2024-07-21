import * as messageService from '../services/messageService.js';
import {authService} from '../services/authService.js';
import { uuid } from 'expo-modules-core';

export const sendMessageHandler = async ({ conversationId, content, recipient_id }) => {
  const user = authService.getUser();
  const message_id = uuid.v4();
  const messageData = {message_id ,conversation_id: conversationId, sender_id: user.id, recipient_id, content };
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
