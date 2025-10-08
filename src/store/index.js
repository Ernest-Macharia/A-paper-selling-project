import { createStore } from 'vuex';
import authenticationStore from '@/store/authentication';
import papersStore from '@/store/papers';
import paymentStore from '@/store/payment';
import communicationStore from '@/store/communications';
import blogStore from '@/store/blog';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    modules: {
        authentication: authenticationStore,
        papers: papersStore,
        payment: paymentStore,
        communications: communicationStore,
        blog: blogStore,
    },
    plugins: [createPersistedState()],
});

export default store;
