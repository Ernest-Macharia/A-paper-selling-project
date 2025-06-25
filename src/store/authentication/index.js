import api from '@/api';

const state = {
    user: null,
    token: '',
    users: [],
};

const getters = {
    isAuthenticated: (state) => !!state.token && typeof state.token === 'string',
    allUsers: (state) => state.users,
};

const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_TOKEN(state, token) {
        state.token = token;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    LOGOUT(state) {
        state.user = null;
        state.token = '';
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        delete api.defaults.headers.common['Authorization'];
    },
    SET_USERS(state, users) {
        state.users = users;
    },
};

const actions = {
    async register({ commit }, userData) {
        const res = await api.post('/users/register/', userData);
        commit('SET_TOKEN', res.data.access);
        commit('SET_USER', res.data.user);
        localStorage.setItem('refresh', res.data.refresh);
        return res;
    },

    async login({ commit }, userData) {
        const res = await api.post('/users/login/', userData);
        commit('SET_TOKEN', res.data.access);
        commit('SET_USER', res.data.user);
        localStorage.setItem('refresh', res.data.refresh);
        return res;
    },

    logout({ commit }) {
        commit('LOGOUT');
        return Promise.resolve();
    },

    async fetchCurrentUserDetails({ commit }) {
        const res = await api.get('/users/current-user/');
        commit('SET_USER', res.data);
        return res.data;
    },

    async refreshToken({ commit }) {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) throw new Error('No refresh token found');

        try {
            const res = await api.post('/users/token/refresh/', { refresh });
            commit('SET_TOKEN', res.data.access);
            return res.data.access;
        } catch (err) {
            commit('LOGOUT');
            throw new Error('Session expired. Please log in again.');
        }
    },

    async updateCurrentUserDetails({ commit }, updatedData) {
        const res = await api.put('/users/current-user/update/', updatedData);
        commit('SET_USER', res.data);
        return res.data;
    },

    async fetchUsers({ commit }) {
        const res = await api.get('/users/all_users/');
        commit('SET_USERS', res.data);
        return res.data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
