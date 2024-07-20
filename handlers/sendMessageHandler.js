import * as messageService from '../services/messageService.js';
import * as authService from '../services/messageService.js';

export const sendMessageHandler = async ({ conversationId, content, recipient_id }) => {
  // Replace with my UI logic to get the recipient ID
  const user = authService.getUser();
  const messageData = { conversationId, sender_id: user.id, recipient_id, content };
  const success = await messageService.sendMessage(messageData);
  if (success) {
    console.log('Message sent successfully');
    // Update UI or trigger notification
  } else {
    console.log('Error sending message');
  }
};

export { sendMessageHandler };
