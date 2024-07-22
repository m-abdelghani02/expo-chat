// useTabStore.js
import {create} from 'zustand';

const useTabStore = create((set) => ({
  onChatPress: () => {},
  setOnChatPress: (newOnPress) => set({ onChatPress: newOnPress }),

  onNotesPress: () => {},
  setOnNotesPress: (newOnPress) => set({ onNotesPress: newOnPress }),

  // Add similar state and actions for other tabs as needed
}));

export default useTabStore;
