import { create } from 'zustand';

const useStore = create((set) => ({
  conversations: [],
  messages: {},
  addConversation: (conversation) => set((state) => ({
    conversations: [...state.conversations, conversation]
  })),
  updateConversation: (conversationId, newMessage) => set((state) => ({
    conversations: state.conversations.map((conv) =>
      conv.conversation_id === conversationId ? { ...conv, last_message: newMessage } : conv
    )
  })),
  addMessage: (conversationId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: [...(state.messages[conversationId] || []), message]
    }
  })),
  setMessages: (conversationId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: messages
    }
  })),
}));

export default useStore;
