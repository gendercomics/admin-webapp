import Vue from 'vue';

const state = Vue.observable({
    filter: {
        statusFilter: null,
        typeFilter: null,
    },
    language: 'de',
    searchTerm: null,
    page: 1,
});

export const getters = {
    language: () => state.language,
    searchTerm: () => state.searchTerm,
    filter: () => state.filter,
    page: () => state.page,
};

export const mutations = {
    setFilter: val => (state.filter = val),
    setStatusFilter: val => (state.filter.statusFilter = val),
    setTypeFilter: val => (state.filter.typeFilter = val),
    setLanguage: val => (state.language = val),
    setSearchTerm: val => (state.searchTerm = val),
    setPage: val => (state.page = val),
};
