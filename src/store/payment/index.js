import api from '@/api';

const state = {
    items: [],
    showPaymentModal: false,
};

const mutations = {
    ADD_TO_CART(state, paper) {
        const exists = state.items.find((item) => item.id === paper.id);
        if (!exists) {
            state.items.push(paper);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        }
    },
    REMOVE_FROM_CART(state, paperId) {
        state.items = state.items.filter((item) => item.id !== paperId);
        localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    CLEAR_CART(state) {
        state.items = [];
        localStorage.removeItem('cartItems');
    },

    SET_SHOW_PAYMENT_MODAL(state, value) {
        state.showPaymentModal = value;
    },
};

const actions = {
    async initiateMpesaPayment(_, { phoneNumber, amount }) {
        const payload = {
            phone_number: phoneNumber,
            amount: amount,
        };
        const response = await api.post('/mpesa_api/lipa-online/', payload);
        return response.data;
    },

    async createStripeSession(_, { paperIds }) {
        const response = await api.post('/payments/checkout/initiate/', {
            paper_ids: paperIds,
            payment_method: 'stripe',
        });
        return response.data.checkout_info.checkout_url;
    },

    async createPaypalSession(_, { paperIds }) {
        const response = await api.post('/payments/checkout/initiate/', {
            paper_ids: paperIds,
            payment_method: 'paypal',
        });
        return response.data.checkout_info.checkout_url;
    },

    async verifyPayment(_, { sessionId, orderId }) {
        const response = await api.get('/payments/verify/', {
            params: {
                session_id: sessionId,
                order_id: orderId,
            },
        });
        return response.data;
    },

    async requestWithdrawal(_, { amount, method }) {
        const payload = {
            amount,
            method,
        };
        const response = await api.post('/payments/withdrawals/', payload);
        return response.data;
    },

    async fetchWalletSummary() {
        const response = await api.get('/payments/wallet/summary/');
        return response.data;
    },

    async fetchWithdrawalRequests() {
        const response = await api.get('/payments/withdrawals/');
        return response.data;
    },
};

const getters = {
    cartItems: (state) => state.items,
    cartCount: (state) => state.items.length,
    totalAmount: (state) => state.items.reduce((sum, paper) => sum + parseFloat(paper.price), 0),
    paperIds: (state) => state.items.map((item) => item.id),
    showPaymentModal: (state) => state.showPaymentModal,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
