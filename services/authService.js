
export const authService = {
    user: {
        id: null,
        username: null,
        profile_pic: null
    },
    setUser(user) {
      this.user = user;
    },
    getUser() {
      return this.user;
    },
  };
  