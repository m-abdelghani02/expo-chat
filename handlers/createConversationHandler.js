// conversationHandler.js

import * as socketService from '../services/socketService.js';
import { authService } from '../services/authService.js';

export const createConversationHandler = async (recipient_id) => {
  const user = authService.getUser();
  const sender_id = user.phone_number;
  const username = user.username;

  const conversationData = { sender_id, recipient_id, username};

  try {
    console.log("Conversation Data before emit:", conversationData);
    socketService.emit('createConversation', conversationData);
    return true;
  } catch (error) {
    console.error('Error creating conversation:', error);
  }
};
