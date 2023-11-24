import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',

  state: () => ({
    token: null,
    user: null
  }),

  getters: {
    isAuthenticated() {
      return !!this.token; // Chuyển đổi token sang giá trị boolean, nếu có token sẽ trả về true
    }
  },

  actions: {
    setUser(userData) {
      this.user = userData;
    },

    setToken(token) {
      this.token = token;
    },

    clearData() {
      this.token = null;
      this.user = null;
    }
  }
});
