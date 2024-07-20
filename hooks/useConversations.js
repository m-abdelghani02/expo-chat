import { useState, useEffect } from 'react';
import * as conversationService from '../services/conversationService.js';

const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const fetchedConversations = await conversationService.getConversations();
        setConversations(fetchedConversations);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []); // Fetch conversations on component mount

  return { conversations, loading, error };
};

export default useConversations;
