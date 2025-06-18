import { createStore } from 'vuex';
import authenticationStore from '@/store/authentication';
import papersStore from '@/store/papers';
import paymentStore from '@/store/payment';

const store = createStore({
    modules: {
        authentication: authenticationStore,
        papers: papersStore,
        payment: paymentStore,
    },
});

export default store;
