import * as socketService from './socketService.js';
import * as dbService from '../db/dbService.js';

const sendMessage = async ({ message_id, conversation_id, sender_id, recipient_id, content }) => {
  const messageData = { message_id, conversation_id, sender_id, recipient_id, content };
  try {
    // Ensure the socket is connected
    if (!socketService.socket) {
      console.log('Socket not connected. Attempting reconnection...');
      socketService.connect(); // Attempt to reconnect
      // Wait a moment to ensure connection is established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if socket is connected after attempting to connect
      if (!socketService.socket) {
        throw new Error('Failed to reconnect. Socket still not connected.');
      }
    }

    // Send message to database
    await dbService.createMessage(messageData);

    // Emit message through socket
    socketService.emit('sendMessage', messageData);

    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false; // Indicate error
  }
};


// Handle a new message and update the corresponding conversation
const receiveMessage = async (message) => {
  try {
    const { message_id, conversation_id, sender_id, recipient_id, content } = message;
    
    // Check if the message already exists in the database
    const existingMessage = dbService.getMessage(message_id);
    if (!existingMessage) {
      // Create the new message
      console.log('Trying to create new message from recieved:', message);
      dbService.createMessage(message);
      console.log('New message added to the database:', message);
      
      // Update conversation with the new message ID
      dbService.updateConversation({ conversation_id, last_message_id: message_id });
      
      // Update the user's last message ID
      await dbService.updateUserLastMessageId(recipient_id, message_id);
    } else {
      console.log('Message already exists:', existingMessage);
    }
  } catch (error) {
    console.error('Error handling new message:', error);
  }
};

const getConversationMessages = async (conversationId) => {
  try {
    const messages = dbService.getMessages(conversationId);
    return messages;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { sendMessage, receiveMessage, getConversationMessages };
