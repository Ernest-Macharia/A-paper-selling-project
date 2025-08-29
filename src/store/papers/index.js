import api from '@/api';

const state = {
    categories: [],
    courses: [],
    popularCourses: [],
    popularCategories: [],
    popularSchools: [],
    schools: [],
    schoolDetails: null,
    schoolPapers: [],
    schoolCourses: [],
    schoolPagination: {
        count: 0,
        next: null,
        previous: null,
    },
    schoolPapersPagination: {
        count: 0,
        next: null,
        previous: null,
    },
    schoolCoursesPagination: {
        count: 0,
        next: null,
        previous: null,
    },
    allPapers: [],
    paperDetails: null,
    uploadedPapers: [],
    downloadedPapers: [],
    mostViewedPapers: [],
    latestUserPapers: [],
    reviewsGiven: {
        results: [],
        count: 0,
        next: null,
        previous: null,
    },
    reviewsReceived: {
        results: [],
        count: 0,
        next: null,
        previous: null,
    },
    earnings: null,
    withdrawals: [],
    loading: false,
    error: null,
    orders: [],
    orderDetails: null,
    currentEditingPaper: null,
    deletingPapers: [],
};

const mutations = {
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    SET_COURSES(state, data) {
        state.courses = data.results || data;
        state.coursePagination = {
            count: data.count,
            next: data.next,
            previous: data.previous,
        };
    },

    SET_POPULAR_COURSES(state, popularCourses) {
        state.popularCourses = popularCourses;
    },
    SET_POPULAR_CATEGORIES(state, popularCategories) {
        state.popularCategories = popularCategories;
    },
    SET_POPULAR_SCHOOLS(state, popularSchools) {
        state.popularSchools = popularSchools;
    },
    SET_SCHOOLS(state, schools) {
        state.schools = schools;
    },
    SET_ALL_PAPERS(state, papers) {
        state.allPapers = papers;
    },
    SET_SCHOOL_DETAILS(state, school) {
        state.schoolDetails = school;
    },
    SET_SCHOOL_PAPERS(state, data) {
        state.schoolPapers = data;
    },
    SET_SCHOOL_COURSES(state, data) {
        state.schoolCourses = data;
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
    SET_MOST_VIEWED_PAPERS(state, papers) {
        state.mostViewedPapers = papers;
    },
    SET_LATEST_USER_PAPERS(state, papers) {
        state.latestUserPapers = papers;
    },
    SET_REVIEWS_GIVEN(state, reviews) {
        state.reviewsGiven = reviews;
    },
    SET_REVIEWS_RECEIVED(state, reviews) {
        state.reviewsReceived = reviews;
    },
    SET_EARNINGS(state, earnings) {
        state.earnings = earnings;
    },
    SET_WITHDRAWALS(state, withdrawals) {
        state.withdrawals = withdrawals;
    },
    ADD_WITHDRAWAL(state, newWithdrawal) {
        state.withdrawals.unshift(newWithdrawal);
    },
    SET_LOADING(state, value) {
        state.loading = value;
    },
    SET_ERROR(state, payload) {
        state.error = payload;
    },
    SET_ORDERS(state, orders) {
        state.orders = orders;
    },
    SET_ORDER_DETAILS(state, order) {
        state.orderDetails = order;
    },
    SET_CURRENT_EDITING_PAPER(state, paper) {
        state.currentEditingPaper = paper;
    },

    CLEAR_SCHOOL_STATE(state) {
        state.schoolDetails = null;
        state.schoolPapers = [];
        state.schoolCourses = [];
        state.error = null;
    },

    UPDATE_PAPER_IN_STATE(state, updatedPaper) {
        if (state.allPapers && Array.isArray(state.allPapers)) {
            state.allPapers = state.allPapers.map((p) =>
                p.id === updatedPaper.id ? updatedPaper : p,
            );
        }

        if (state.uploadedPapers) {
            if (Array.isArray(state.uploadedPapers)) {
                state.uploadedPapers = state.uploadedPapers.map((p) =>
                    p.id === updatedPaper.id ? updatedPaper : p,
                );
            } else if (state.uploadedPapers.results) {
                state.uploadedPapers.results = state.uploadedPapers.results.map((p) =>
                    p.id === updatedPaper.id ? updatedPaper : p,
                );
            }
        }

        state.mostViewedPapers = state.mostViewedPapers.map((p) =>
            p.id === updatedPaper.id ? updatedPaper : p,
        );

        state.latestUserPapers = state.latestUserPapers.map((p) =>
            p.id === updatedPaper.id ? updatedPaper : p,
        );

        if (state.paperDetails?.id === updatedPaper.id) {
            state.paperDetails = updatedPaper;
        }

        if (state.currentEditingPaper?.id === updatedPaper.id) {
            state.currentEditingPaper = updatedPaper;
        }
    },

    ADD_DELETING_PAPER(state, paperId) {
        if (!state.deletingPapers.includes(paperId)) {
            state.deletingPapers.push(paperId);
        }
    },

    REMOVE_DELETING_PAPER(state, paperId) {
        state.deletingPapers = state.deletingPapers.filter((id) => id !== paperId);
    },

    REMOVE_PAPER_FROM_STATE(state, paperId) {
        // Remove from allPapers array
        if (state.allPapers && Array.isArray(state.allPapers)) {
            state.allPapers = state.allPapers.filter((p) => p.id !== paperId);
        }

        // Remove from uploadedPapers (handling both array and paginated response)
        if (state.uploadedPapers) {
            if (Array.isArray(state.uploadedPapers)) {
                state.uploadedPapers = state.uploadedPapers.filter((p) => p.id !== paperId);
            } else if (state.uploadedPapers.results) {
                state.uploadedPapers.results = state.uploadedPapers.results.filter(
                    (p) => p.id !== paperId,
                );
                // Update count if exists
                if (state.uploadedPapers.count !== undefined) {
                    state.uploadedPapers.count--;
                }
            }
        }

        // Remove from other lists
        if (state.mostViewedPapers && Array.isArray(state.mostViewedPapers)) {
            state.mostViewedPapers = state.mostViewedPapers.filter((p) => p.id !== paperId);
        }

        if (state.latestUserPapers && Array.isArray(state.latestUserPapers)) {
            state.latestUserPapers = state.latestUserPapers.filter((p) => p.id !== paperId);
        }

        // Clear current editing paper if it's the one being deleted
        if (state.currentEditingPaper?.id === paperId) {
            state.currentEditingPaper = null;
        }

        // Clear paperDetails if it's the current paper
        if (state.paperDetails?.id === paperId) {
            state.paperDetails = null;
        }
    },
};

const actions = {
    async fetchCategories({ commit }, { search = '', page, ordering = '-paper_count' } = {}) {
        try {
            const params = { search };

            if (page) params.page = page;
            if (ordering) params.ordering = ordering;

            const response = await api.get('/exampapers/categories/', { params });
            commit('SET_CATEGORIES', response.data.results);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async fetchCourses(
        { commit },
        { search = '', page = 1, ordering = '-paper_count', schoolName = null } = {},
    ) {
        try {
            const params = {
                search,
                page,
            };

            if (ordering) params.ordering = ordering;
            if (schoolName) params.school_name = schoolName;

            const response = await api.get('/exampapers/courses/', { params });
            commit('SET_COURSES', response.data.results);
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    async fetchUploadCourses(
        { commit },
        { search = '', page, ordering = null, schoolName = null } = {},
    ) {
        try {
            const params = { search };

            if (page) {
                params.page = page;
            } else {
                params.all = true;
            }

            if (ordering) {
                params.ordering = ordering;
            }

            if (schoolName) {
                params.school_name = schoolName;
            }

            const response = await api.get('/exampapers/upload-courses/', { params });
            commit('SET_COURSES', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
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

    async fetchPopularSchools({ commit }) {
        try {
            const response = await api.get('/exampapers/popular-schools/');
            commit('SET_POPULAR_SCHOOLS', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular schools:', error);
        }
    },

    async fetchCategoryPapers({ commit }, { categoryId, params = {} }) {
        try {
            const response = await api.get(`/exampapers/categories/category-papers/`, {
                params: { category: categoryId, ...params },
            });
            const data = response.data;
            commit('SET_ALL_PAPERS', data.results);
            return data;
        } catch (error) {
            console.error('Failed to fetch category papers:', error);
            throw error;
        }
    },

    async fetchCoursePapers({ commit }, { courseId, params = {} }) {
        try {
            const response = await api.get(`/exampapers/courses/course-papers/`, {
                params: { course: courseId, ...params },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch course papers:', error);
            throw error;
        }
    },

    async fetchUserUploadSchools({ commit }) {
        try {
            const response = await api.get('/exampapers/user-upload-schools/');
            const data = response.data;
            commit('SET_SCHOOLS', data.results || data);
            return data.results || data;
        } catch (error) {
            console.error('Error fetching schools:', error);
            return [];
        }
    },

    async fetchSchools({ commit }, params = {}) {
        try {
            const response = await api.get('/exampapers/schools/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching schools:', error);
            throw error;
        }
    },

    async fetchSchoolDetails({ commit }, schoolId) {
        try {
            commit('SET_LOADING', true);
            const response = await api.get(`/exampapers/schools/${schoolId}/`);
            commit('SET_SCHOOL_DETAILS', response.data);
            commit('SET_ERROR', null);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async fetchSchoolPapers({ commit }, { schoolId, params = {} }) {
        try {
            commit('SET_LOADING', true);
            const response = await api.get(`/exampapers/schools/${schoolId}/papers/`, {
                params: {
                    page: params.page || 1,
                    page_size: params.page_size || 12,
                    ordering: params.ordering || '-upload_date',
                    search: params.search || undefined,
                },
            });
            commit('SET_SCHOOL_PAPERS', response.data.results || []);
            commit('SET_ERROR', null);

            return {
                data: response.data.results || [],
                pagination: {
                    count: response.data.count || 0,
                    next: response.data.next,
                    previous: response.data.previous,
                    page_size: response.data.results?.length || 12,
                },
            };
        } catch (error) {
            commit('SET_ERROR', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async fetchSchoolCourses({ commit }, { schoolId, params = {} }) {
        try {
            commit('SET_LOADING', true);
            const response = await api.get(`/exampapers/schools/${schoolId}/courses/`, {
                params: {
                    page: params.page || 1,
                    page_size: params.page_size || 8,
                },
            });

            if (!response.data) {
                throw new Error('Empty response from server');
            }

            commit('SET_SCHOOL_COURSES', response.data.results || []);
            commit('SET_ERROR', null);

            return {
                data: response.data.results || [],
                pagination: {
                    count: response.data.count || 0,
                    next: response.data.next || null,
                    previous: response.data.previous || null,
                    page_size: response.data.results?.length || 8,
                },
            };
        } catch (error) {
            commit('SET_ERROR', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    clearSchoolState({ commit }) {
        commit('CLEAR_SCHOOL_STATE');
    },

    async fetchAllPapers({ commit }, { page = 1, search = '', ordering = '' } = {}) {
        try {
            const response = await api.get('/exampapers/papers/', {
                params: { page, search, ordering },
            });
            commit('SET_ALL_PAPERS', response.data.results);
            return {
                count: response.data.count,
                results: response.data.results,
            };
        } catch (error) {
            throw error;
        }
    },

    async fetchLatestPapers({ commit }) {
        try {
            const { data } = await api.get('/exampapers/papers/latest-papers/');
            const results = Array.isArray(data) ? data : [];
            commit('SET_ALL_PAPERS', { results, count: results.length });
            return results;
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

    async fetchPapersByAuthor(
        { commit },
        { authorId, page = 1, search = '', ordering = '', category = '' },
    ) {
        try {
            const params = { page };

            if (search) params.search = search;
            if (ordering) params.ordering = ordering;
            if (category) params['category__name'] = category; // ✅ FIX

            const response = await api.get(`/exampapers/papers/author/${authorId}/`, { params });

            return {
                papers: response.data.results,
                author_name: response.data.author_name,
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous,
            };
        } catch (error) {
            console.error('API Error:', error);
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

    async fetchDownloadedPapers({ commit }, { search = '', page } = {}) {
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

    async fetchMostViewedPapers(_, params = {}) {
        try {
            const response = await api.get('/exampapers/papers/most-viewed/', {
                params: {
                    page: params.page || 1,
                    search: params.search || '',
                    ordering:
                        params.sort === 'views'
                            ? '-views'
                            : params.sort === 'downloads'
                              ? '-download_count'
                              : '-upload_date',
                    price: params.price !== 'all' ? params.price : undefined,
                },
            });
            return response;
        } catch (error) {
            console.error('Failed to fetch most viewed papers:', error);
            throw error;
        }
    },

    async fetchLatestUserPapers(_, params = {}) {
        try {
            const response = await api.get('/exampapers/dashboard/latest-papers/', {
                params: {
                    page: params.page || 1,
                    search: params.search || '',
                    ordering:
                        params.sort === 'views'
                            ? '-views'
                            : params.sort === 'downloads'
                              ? '-download_count'
                              : '-upload_date',
                    status: params.status !== 'all' ? params.status : undefined,
                },
            });
            return response;
        } catch (error) {
            console.error('Failed to fetch latest user papers:', error);
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

    async submitPaperReview(_, { paper, reviewData }) {
        await api.post(`/exampapers/papers/${paper}/download/reviews/`, reviewData);
    },

    async fetchReviewsGiven({ commit }) {
        commit('SET_LOADING', true);
        try {
            const response = await api.get('/exampapers/reviews/given/');
            commit('SET_REVIEWS_GIVEN', response.data);
        } catch (error) {
            console.error('Error fetching given reviews:', error);
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async fetchReviewsReceived({ commit }) {
        commit('SET_LOADING', true);
        try {
            const response = await api.get('/exampapers/reviews/received/');
            commit('SET_REVIEWS_RECEIVED', response.data);
        } catch (error) {
            console.error('Error fetching received reviews:', error);
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async fetchEarnings({ commit }) {
        try {
            const { data } = await api.get('/payments/wallet/summary/');
            commit('SET_EARNINGS', data);
            return data;
        } catch (error) {
            console.error('Error fetching wallet summary:', error);
            throw error;
        }
    },

    async fetchWithdrawals({ commit }) {
        try {
            const { data } = await api.get('/payments/withdrawals/');
            commit('SET_WITHDRAWALS', data.results || []);
            return data;
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            throw error;
        }
    },

    // Submit a new withdrawal request
    async submitWithdrawal({ commit }, payload) {
        try {
            const { data } = await api.post('/payments/withdrawals/', payload);
            commit('ADD_WITHDRAWAL', data);
            return data;
        } catch (error) {
            console.error('Error submitting withdrawal:', error.response?.data || error);
            throw error;
        }
    },

    async fetchPaperForEdit({ commit }, paperId) {
        try {
            commit('SET_LOADING', true);
            const response = await api.get(`/exampapers/papers/${paperId}/`);
            commit('SET_CURRENT_EDITING_PAPER', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching paper for edit:', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async updatePaper({ commit }, { paperId, formData }) {
        try {
            commit('SET_LOADING', true);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await api.put(
                `/exampapers/papers/update/${paperId}/`,
                formData,
                config,
            );

            commit('UPDATE_PAPER_IN_STATE', response.data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                const errors = error.response.data;
                const formattedErrors = {};

                for (const [field, messages] of Object.entries(errors)) {
                    formattedErrors[field] = Array.isArray(messages)
                        ? messages.join(', ')
                        : messages;
                }
                throw { ...error, formattedErrors };
            }

            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async deletePaper({ commit }, paperId) {
        try {
            commit('SET_LOADING', true);
            await api.delete(`/exampapers/papers/${paperId}/delete/`);
            commit('REMOVE_PAPER_FROM_STATE', paperId);
            return true;
        } catch (error) {
            console.error('Error deleting paper:', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    clearEditingPaper({ commit }) {
        commit('SET_CURRENT_EDITING_PAPER', null);
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
    schoolDetails: (state) => state.schoolDetails,
    schoolPapers: (state) => state.schoolPapers,
    schoolCourses: (state) => state.schoolCourses,
    loading: (state) => state.loading,
    error: (state) => state.error,
    schoolPapersPagination: (state) => state.schoolPapersPagination,
    schoolCoursesPagination: (state) => state.schoolCoursesPagination,
    paperDetails: (state) => state.paperDetails,
    mostViewedPapers: (state) => state.mostViewedPapers,
    latestUserPapers: (state) => state.latestUserPapers,
    allOrders: (state) => state.orders,
    orderDetails: (state) => state.orderDetails,
    reviewsGiven: (state) => state.reviewsGiven.results || [],
    reviewsReceived: (state) => state.reviewsReceived.results || [],
    isLoading: (state) => state.isLoading,
    currentEditingPaper: (state) => state.currentEditingPaper,
    getPaperById: (state) => (id) => {
        return (
            state.allPapers.find((p) => p.id === id) ||
            (state.uploadedPapers.results || []).find((p) => p.id === id) ||
            (state.paperDetails?.id === id ? state.paperDetails : null) ||
            (state.currentEditingPaper?.id === id ? state.currentEditingPaper : null)
        );
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
