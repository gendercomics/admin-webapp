import Vue from 'vue';

const state = Vue.observable({
    language: 'de',
});

export const getters = {
    language: () => state.language,
};

export const mutations = {
    setLanguage: val => (state.language = val),
};
