import api from '@/api';

const state = {
    loading: false,
    newsletter: {
        subscribed: false,
        error: null,
    },
};

const mutations = {
    SET_LOADING(state, value) {
        state.loading = value;
    },
    SET_NEWSLETTER_SUBSCRIBED(state, value) {
        state.newsletter.subscribed = value;
    },
    SET_NEWSLETTER_ERROR(state, error) {
        state.newsletter.error = error;
    },
};

const actions = {
    async sendContactMessage({ commit }, payload) {
        commit('SET_LOADING', true);
        try {
            const response = await api.post('/communications/contact/', payload);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async subscribeToNewsletter({ commit }, email) {
        commit('SET_LOADING', true);
        commit('SET_NEWSLETTER_ERROR', null);

        try {
            const response = await api.post('/communications/subscribe/', { email });
            commit('SET_NEWSLETTER_SUBSCRIBED', true);
            return response.data;
        } catch (error) {
            commit('SET_NEWSLETTER_ERROR', error.response?.data?.message || 'Subscription failed');
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async submitCopyrightReport({ commit }, reportData) {
        commit('SET_LOADING', true);
        try {
            const response = await api.post('/communications/copyright-reports/', {
                paper: reportData.paper_id,
                reason: reportData.reason,
                details: reportData.details,
                contact_email: reportData.contact_email,
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting copyright report:', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },
};

const getters = {
    isLoading: (state) => state.loading,
    isNewsletterSubscribed: (state) => state.newsletter.subscribed,
    newsletterError: (state) => state.newsletter.error,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
