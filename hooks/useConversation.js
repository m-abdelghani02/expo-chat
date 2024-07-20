import { useState, useEffect } from 'react';
import * as conversationService from '../services/conversationService.js';

const useConversation = (conversationId) => {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const fetchedConversation = await conversationService.getConversationById(conversationId);
        setConversation(fetchedConversation);
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
