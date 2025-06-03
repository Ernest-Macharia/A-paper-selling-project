import api from "@/api";

const state = { 
  user: (() => { 
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  })(),
  token: localStorage.getItem("access") || ""
};

const getters = {
  isAuthenticated: (state) => !!state.user,
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  },
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem("access", token);
  },
  LOGOUT(state) {
    state.user = null;
    state.token = "";
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
};

const actions = {
  async register({ commit }, userData) {
    try {
      const response = await api.post('/users/register/', userData);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      commit("SET_USER", response.data.user);
      commit("SET_TOKEN", response.data.access);
      return response;
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async login({ commit }, userData) {
    try {
      const response = await api.post('/users/login/', userData);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      commit("SET_USER", response.data.user);
      commit("SET_TOKEN", response.data.access);
      return response;
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  logout({ commit }) {
    commit("LOGOUT");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
