const state = () => ({
    language: 'de',
});

const getters = {
    language: () => {
        return state.language;
    },
};

const actions = {};

const mutations = {
    language: val => {
        state.language = val;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
