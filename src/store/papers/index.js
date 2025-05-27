import api from '@/api';

const state = {
  categories: [],
  courses: [],
  popularCourses: [],
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
  SET_SCHOOLS (state, schools) {
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
  async fetchCategories({ commit, rootState }) {
    try {
      const response = await api.get('/exampapers/categories/',);
      commit('SET_CATEGORIES', response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized - Please log in again.');
      } else {
        console.error('Error fetching categories:', error);
      }
    }
  },

  async fetchCourses({ commit, rootState }) {
    try {
      const response = await api.get('/exampapers/courses/');
      commit('SET_COURSES', response.data);
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
    } catch (error) {
      console.error('Error fetching popular courses:', error);
    }
  },

  async fetchSchools({ commit, rootState }) {
    try {
      const response = await api.get('/exampapers/schools/');
      commit('SET_SCHOOLS', response.data);
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

  async fetchUploadedPapers({ commit }) {
    try {
      const response = await api.get('/exampapers/my-uploads/');
      commit('SET_UPLOADED_PAPERS', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async fetchDownloadedPapers({ commit }) {
    try {
      const response = await api.get('/exampapers/my-downloads/');
      commit('SET_DOWNLOADED_PAPERS', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async uploadPaper({ rootState }, formData) {
    try {
      const response = await api.post('/exampapers/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async initiateMpesaPayment({ rootState }, { phoneNumber, amount }) {
    // you might pull the JWT token automatically via your api instance
    const payload = {
      phone_number: phoneNumber,
      amount:       amount,
    };
    const response = await api.post('/mpesa_api/lipa-online/', payload);
    return response.data;
  },

  async createPaypalOrder({ rootState }, { amount }) {
    try {
      const response = await api.post('/paypal_api/create/', { amount });
      return response.data;  // { orderID: '...' }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  },

  async capturePaypalOrder({ rootState }, { orderID, payerID }) {
    try {
      const response = await api.post('/paypal_api/capture/', { orderID, payerID });
      return response.data;  // { status: 'COMPLETED', ... }
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw error;
    }
  },

  async createStripeSession({ rootState }, { amount, title }) {
    try {
      const { data } = await api.post('/stripe_api/create/', { amount, title });
      return data.id; // sessionId
    } catch (err) {
      console.error('Stripe session creation failed:', err);
      throw err;
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
