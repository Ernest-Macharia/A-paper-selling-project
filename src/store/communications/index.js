import api from '@/api';

const actions = {
    async sendContactMessage(_, payload) {
        return await api.post('/communications/contact/', payload);
    },
    async subscribeToNewsletter(_, payload) {
        return await api.post('/communications/subscribe/', payload);
    },
};

export default {
    namespaced: true,
    actions,
};
