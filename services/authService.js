
export const authService = {
    
    user: {
        id: '1234567890',
        username: 'currentUser',
        profile_pic: null
    },
    setUser(user) {
      this.user = user;
    },
    getUser() {
      console.log(this.user);
      return this.user;
    },
    isLoggedIn() {
      return true;
    }
  };
  