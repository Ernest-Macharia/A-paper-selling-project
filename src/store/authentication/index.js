import api from '@/api';
import { toast } from 'vue3-toastify';

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
        if (token) {
            state.token = token;
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('access', token);
        }
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
    SET_AUTH0_USER(state, user) {
        state.auth0User = user;
    },
    SET_AUTH_METHOD(state, method) {
        state.authMethod = method;
    },
};

const actions = {
    async register({ commit }, userData) {
        const res = await api.post('/users/register/', userData);
        return res;
    },

    async login({ commit }, userData) {
        const res = await api.post('/users/login/', userData);
        commit('SET_TOKEN', res.data.access);
        commit('SET_USER', res.data.user);
        localStorage.setItem('refresh', res.data.refresh);
        return res;
    },

    async logout({ commit }, auth0) {
        try {
            if (auth0?.isAuthenticated) {
                await auth0.logout({
                    logoutParams: {
                        returnTo: window.location.origin,
                    },
                });
            }

            // Standard logout
            commit('LOGOUT');
            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            return false;
        }
    },

    async requestPasswordReset(_, email) {
        const res = await api.post('/users/request-password-reset/', { email });
        return res.data;
    },

    async resetPassword(_, payload) {
        const res = await api.post('/users/reset-password-confirm/', payload);
        return res.data;
    },

    async activateAccount(_, { uid, token }) {
        try {
            await api.get(`/users/activate/${uid}/${token}/`);
            return true;
        } catch (err) {
            console.error('Activation error:', err?.response?.data || err.message);
            return false;
        }
    },

    async auth0Login({ commit }, auth0Token) {
        try {
            const response = await api.post('/users/auth0-login/', { token: auth0Token });
            commit('SET_TOKEN', response.data.access);
            commit('SET_USER', response.data.user);
            commit('SET_AUTH_METHOD', 'traditional');
            return true;
        } catch (error) {
            console.error('Auth0 backend sync failed:', error);
            return false;
        }
    },

    async handleAuth0Callback({ commit, dispatch }) {
        try {
            const auth0 = useAuth0();
            if (auth0.isAuthenticated.value) {
                const token = await auth0.getAccessTokenSilently();
                const user = auth0.user.value;
                commit('SET_AUTH0_USER', user);
                return await dispatch('auth0Login', token);
            }
            return false;
        } catch (error) {
            console.error('Auth0 callback handling failed:', error);
            return false;
        }
    },

    async fetchCurrentUserDetails({ commit }) {
        const res = await api.get('/users/current-user/');
        commit('SET_USER', res.data);
        return res.data;
    },

    async refreshToken({ commit }) {
        const refreshClient = axios.create({
            baseURL: api.defaults.baseURL,
        });
        const refresh = localStorage.getItem('refresh');
        if (!refresh) throw new Error('No refresh token found');

        try {
            const res = await refreshClient.post('/users/token/refresh/', { refresh });
            commit('SET_TOKEN', res.data.access);
            return res.data.access;
        } catch (err) {
            commit('LOGOUT');
            throw new Error('Session expired. Please log in again.');
        }
    },

    async resendActivation(_, email) {
        const res = await api.post('/users/resend-activation/', { email });
        return res.data;
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
