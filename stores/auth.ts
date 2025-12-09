import { defineStore } from 'pinia'
 
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),

  actions: {
    login(email:any, password:any) {
      // Simulate login
      this.user = { email, name: email.split('@')[0] };
      this.isLoggedIn = true;
      return true;
    },

    logout() {
      this.user = null;
      this.isLoggedIn = false;
    }
  }
});