// conversationHandler.js
import * as dbService from '../db/dbService';
import * as socketService from '../services/socketService';

// Handle a new conversation based on the sender and recipient IDs
const handleNewConversation = async ({ sender_id, recipient_id }) => {
  try {
    // Generate a unique conversation ID
    const conversation_id = `${sender_id}_${recipient_id}`;

    // Check if conversation already exists in the database
    const existingConversation = dbService.getConversation(conversation_id);
    if (!existingConversation) {
      // Create the new conversation
      dbService.createConversation({
            conversation_id,
            user1_id: sender_id,
            user2_id: recipient_id,
            last_message_id: null
        });
      console.log('New conversation added to the database:', { sender_id, recipient_id });
    } else {
      console.log('Conversation already exists:', existingConversation);
    }
  } catch (error) {
    console.error('Error handling new conversation:', error);
  }
};

// Handle a new message and update the corresponding conversation
const handleNewMessage = async (message) => {
  try {
    const { message_id, conversation_id, sender_id, recipient_id, content, timestamp } = message;
    
    // Check if the message already exists in the database
    const existingMessage = dbService.getMessage(message_id);
    if (!existingMessage) {
      // Create the new message
      dbService.createMessage(message);
      console.log('New message added to the database:', message);
      
      // Update conversation with the new message ID
      dbService.updateConversation({ conversation_id, last_message_id: message_id });
    } else {
      console.log('Message already exists:', existingMessage);
    }
  } catch (error) {
    console.error('Error handling new message:', error);
  }
};

// Setup socket listener for new conversations
export const setupNewConversationListener = (callback) => {
  socketService.socket.on('newConversation', (data) => {
    console.log('New conversation received via socket:', data);
    handleNewConversation(data); // Handle the incoming conversation
    callback(data); // Call the provided callback with the new conversation
  });
};

// Teardown socket listener for new conversations
export const teardownNewConversationListener = () => {
  socketService.socket.off('newConversation');
};

// Setup socket listener for new messages
export const setupNewMessageListener = (callback) => {
  socketService.socket.on('newMessage', (message) => {
    console.log('New message received via socket:', message);
    handleNewMessage(message); // Handle the incoming message
    callback(message); // Call the provided callback with the new message
  });
};

// Teardown socket listener for new messages
export const teardownNewMessageListener = () => {
  socketService.socket.off('newMessage');
};
