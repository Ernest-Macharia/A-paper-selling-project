import { createStore } from 'vuex';
import authenticationStore from '@/store/authentication';
import papersStore from '@/store/papers';

const store = createStore({
    modules: {
        authentication: authenticationStore,
        papers: papersStore,
    },
});

export default store;
