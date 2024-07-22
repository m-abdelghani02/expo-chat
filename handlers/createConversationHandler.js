// conversationHandler.js

import * as socketService from '../services/socketService.js';
import { authService } from '../services/authService.js';

export const createConversationHandler = async (recipient_id) => {
  const user = await authService.getUser();
  const sender_id = user.phone_number;
  const username = user.username;
  console.log('User data inside handler:', { sender_id, username });

  const conversationData = { sender_id, recipient_id, username};

  try {
    console.log("Conversation Data before emit:", conversationData);
    socketService.emit('createConversation', conversationData);
    return true;
  } catch (error) {
    console.error('Error creating conversation:', error);
  }
};
