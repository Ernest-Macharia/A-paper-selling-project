import { createStore } from 'vuex';
import authenticationStore from '@/store/authentication';
import papersStore from '@/store/papers';
import paymentStore from '@/store/payment';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    modules: {
        authentication: authenticationStore,
        papers: papersStore,
        payment: paymentStore,
    },
    plugins: [
        createPersistedState({
            paths: ['authentication.token', 'authentication.user'], // persist these only
        }),
    ],
});

export default store;
