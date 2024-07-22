import * as dbService from '../db/dbService.js';

export const createConversation = async ({ conversation_id, user1_id, user2_id, last_message_id }) => {
    try {
        const conversation = dbService.createConversation({ conversation_id, user1_id, user2_id, last_message_id });
        return true;
    } catch (error) {
        console.log(error);
    }
}

export const getConversationById = async (conversation_id) => {
    try {
        const conversation = dbService.getConversation(conversation_id);
        return conversation;
    } catch (error) {
        console.log(error);
    }
}

export const getConversations = async () => {
    try {
        const conversations = dbService.getConversations();
        return conversations;
    } catch (error) {
        console.log(error);
    }
}

export const getRecipientFromConversationId = async (conversation_id) => {
    try {
        const conversation = dbService.getConversation(conversation_id);
        const recipient_id =  conversation.user2_id;
        return recipient_id;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const updateLastMessageId = async ({ conversation_id, last_message_id }) => {
    try {
        const conversation = dbService.updateConversation({ conversation_id, last_message_id });
        if(conversation) 
            {
            console.log('Updated conversation ', conversation_id, ' successfully with last_message_id ', last_message_id);
            } 
        //else throw new Error('Error updating conversation');
    } catch (error) {
        console.log(error);
    }
}