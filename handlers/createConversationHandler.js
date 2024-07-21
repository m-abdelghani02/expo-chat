// conversationHandler.js

import * as socketService from '../services/socketService.js';
import { authService } from '../services/authService.js';

export const createConversationHandler = async (recipient_id) => {
  const user = authService.getUser();
  const sender_id = user.id;
  const username = user.username;

  const conversationData = { sender_id, recipient_id, username};

  try {
    // Emit the event to create a new conversation
    socketService.emit('createConversation', conversationData);
  } catch (error) {
    console.error('Error creating conversation:', error);
  }
};
