// store/modules/blog.js
import api from '@/api';

const state = {
    blogPosts: [],
    loading: false,
    error: null,
    selectedPost: null,
};

const mutations = {
    SET_BLOG_POSTS(state, posts) {
        state.blogPosts = posts;
    },
    SET_LOADING(state, status) {
        state.loading = status;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    SET_SELECTED_POST(state, post) {
        state.selectedPost = post;
    },
};

const actions = {
    async fetchBlogPosts({ commit }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await api.get('/blog/posts/');
            commit('SET_BLOG_POSTS', response.data.results || response.data);
        } catch (error) {
            commit('SET_ERROR', error.response?.data || 'Failed to fetch blog posts.');
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async fetchSinglePost({ commit }, postId) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await api.get(`/blog/posts/${postId}/`);
            commit('SET_SELECTED_POST', response.data);
        } catch (error) {
            commit('SET_ERROR', error.response?.data || 'Failed to fetch post.');
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async createBlogPost({ commit }, formData) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await api.post('/blog/posts/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data || 'Failed to create post.');
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },
};

const getters = {
    blogPosts: (state) => state.blogPosts,
    blogLoading: (state) => state.loading,
    blogError: (state) => state.error,
    selectedPost: (state) => state.selectedPost,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
