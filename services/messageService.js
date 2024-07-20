import * as socketService from './socketService.js';
import * as dbService from '../db/dbService.js'; 
const socket = socketService.socket
const sendMessage = async ({ conversation_id, sender_id, recipient_id, content }) => {
    // Format message data (if needed)
    const messageData = { conversation_id, sender_id, recipient_id, content };
    try {
      // Send message to database (using dbService if separate from messageService)
      
      // Emit message through socket if real-time updates are desired
      if (socket) {
          socketService.emit('sendMessage', messageData);
        }
        
      //await dbService.sendMessage(messageData); // Assuming a sendMessage function in dbService
        
      return true;
    } catch (error) {
      console.log(error);
      return false; // Indicate error
    }
  };
  
  const getConversationMessages = async (conversationId) => {
    try {
      const messages =  dbService.getMessages(conversationId);
      return messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  
  export { sendMessage, getConversationMessages };
  