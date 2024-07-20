import { useState, useEffect } from 'react';
import * as conversationService from '../services/conversationService.js';
import userService from '../services/userService';

const useConversation = (conversationId) => {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const fetchedConversation = await conversationService.getConversationById(conversationId);
        const user2_id = fetchedConversation.user2_id;

        // Fetch user data for user2
        const user2 = await userService.getUserById(user2_id);

        // Update conversation with retrieved user2 data
        const enrichedConversation = {
          ...fetchedConversation,
          user2_name:user2.username,
        };
        setConversation(enrichedConversation);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]); // Re-fetch conversation on conversationId change

  return { conversation, loading, error };
};

export default useConversation;
