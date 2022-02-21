const state = () => ({
    searchTerm: '',
});

const getters = {
    searchTerm: () => {
        return state.searchTerm;
    },
};

const actions = {};

const mutations = {
    searchTerm: val => {
        state.searchTerm = val;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
