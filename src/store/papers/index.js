import api from '@/api';

const state = {
    categories: [],
    courses: [],
    popularCourses: [],
    popularCategories: [],
    schools: [],
    allPapers: [],
    paperDetails: null,
    uploadedPapers: [],
    downloadedPapers: [],
    orders: [],
    orderDetails: null,
};

const mutations = {
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    SET_COURSES(state, courses) {
        state.courses = courses;
    },
    SET_POPULAR_COURSES(state, popularCourses) {
        state.popularCourses = popularCourses;
    },
    SET_POPULAR_CATEGORIES(state, popularCategories) {
        state.popularCategories = popularCategories;
    },
    SET_SCHOOLS(state, schools) {
        state.schools = schools;
    },
    SET_ALL_PAPERS(state, papers) {
        state.allPapers = papers;
    },
    SET_PAPER_DETAILS(state, paper) {
        state.paperDetails = paper;
    },
    SET_UPLOADED_PAPERS(state, papers) {
        state.uploadedPapers = papers;
    },
    SET_DOWNLOADED_PAPERS(state, papers) {
        state.downloadedPapers = papers;
    },
    SET_ORDERS(state, orders) {
        state.orders = orders;
    },
    SET_ORDER_DETAILS(state, order) {
        state.orderDetails = order;
    },
};

const actions = {
    async fetchCategories({ commit }, { search = '', page = 1 } = {}) {
        try {
            const response = await api.get('/exampapers/categories/', {
                params: {
                    search,
                    page,
                    ordering: '-paper_count',
                },
            });
            commit('SET_CATEGORIES', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async fetchCourses({ commit }, { search = '', page = 1 } = {}) {
        try {
            const response = await api.get('/exampapers/courses/', {
                params: { search, page },
            });
            commit('SET_COURSES', response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized - Please log in again.');
            } else {
                console.error('Error fetching courses:', error);
            }
        }
    },

    async fetchPopularCourses({ commit }) {
        try {
            const response = await api.get('/exampapers/popular-courses/');
            commit('SET_POPULAR_COURSES', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular courses:', error);
        }
    },

    async fetchPopularCategories({ commit }) {
        try {
            const response = await api.get('/exampapers/popular-categories/');
            commit('SET_POPULAR_CATEGORIES', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular categories:', error);
        }
    },

    async fetchSchools({ commit, rootState }) {
        try {
            const response = await api.get('/exampapers/schools/');
            commit('SET_SCHOOLS', response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized - Please log in again.');
            } else {
                console.error('Error fetching schools:', error);
            }
        }
    },

    async fetchAllPapers({ commit }) {
        try {
            const response = await api.get('/exampapers/papers/');
            commit('SET_ALL_PAPERS', response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async fetchPaperById({ commit }, paperId) {
        try {
            const response = await api.get(`/exampapers/papers/${paperId}/`);
            commit('SET_PAPER_DETAILS', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching paper by ID:', error);
            throw error;
        }
    },

    async fetchUploadedPapers({ commit }, { search = '', page = 1 } = {}) {
        try {
            const response = await api.get('/exampapers/my-uploads/', {
                params: {
                    search,
                    page,
                    ordering: '-paper_count',
                },
            });
            commit('SET_UPLOADED_PAPERS', response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async fetchDownloadedPapers({ commit }, { search = '', page = 1 } = {}) {
        try {
            const response = await api.get('/exampapers/my-downloads/', {
                params: {
                    search,
                    page,
                    ordering: '-paper_count',
                },
            });
            commit('SET_DOWNLOADED_PAPERS', response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async fetchDashboardStatistics({ commit }) {
        try {
            const response = await api.get('/exampapers/dashboard-stats/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async uploadPaper({ rootState }, formData) {
        try {
            const response = await api.post('/exampapers/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async downloadPaperById(_, paperId) {
        try {
            const { data } = await api.get(`/exampapers/papers/${paperId}/download/`);
            return data.file_url;
        } catch (error) {
            console.error('Error downloading paper:', error.response?.data || error.message);
            throw error;
        }
    },

    async fetchOrders({ commit }) {
        const { data } = await api.get('/exampapers/orders/');
        commit('SET_ORDERS', data);
        return data;
    },
    async fetchOrderById({ commit }, orderId) {
        const { data } = await api.get(`/exampapers/orders/${orderId}/`);
        commit('SET_ORDER_DETAILS', data);
        return data;
    },

    async createOrder({ dispatch }, { paperId, price }) {
        const { data } = await api.post('/exampapers/create-order/', {
            paper: paperId,
            price,
        });
        // optionally: reload orders list
        await dispatch('fetchOrders');
        return data;
    },
};

const getters = {
    categories: (state) => state.categories,
    courses: (state) => state.courses,
    schools: (state) => state.schools,
    paperDetails: (state) => state.paperDetails,
    allOrders: (state) => state.orders,
    orderDetails: (state) => state.orderDetails,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
