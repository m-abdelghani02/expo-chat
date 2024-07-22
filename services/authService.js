import * as SecureStore from 'expo-secure-store';

export const authService = {
  async setUser(user) {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      console.log('User saved successfully.');
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser() {
    try {
      const userString = await SecureStore.getItemAsync('user');
      if (userString) {
        const user = JSON.parse(userString);
        const { phone_number, username, public_key, profile_pic } = user;
        console.log('User retrieved:', { phone_number, username, public_key, profile_pic });
        return { phone_number, username, public_key, profile_pic };
      } else {
        console.log('No user found.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  },

  async isLoggedIn() {
    const user = await this.getUser();
    return user !== null;
  }
};
