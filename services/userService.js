import { getUser } from '../db/dbService'; // Import getUser from dbService

const userService = {
  user: null, // Store user data here (optional)

  // Function to fetch user data by ID (using local database)
  async getUserById(userId) {
    try {
    console.log("User:");
      const userData = getUser(userId);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },
};

export default userService;
