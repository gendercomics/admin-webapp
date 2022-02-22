import Vue from 'vue';

const state = Vue.observable({
    filter: {
        statusFilter: ['DRAFT', 'CLARIFICATION', 'REVIEW', 'FINAL'],
        typeFilter: [
            'anthology',
            'comic',
            'comic_series',
            'magazine',
            'publishing_series',
            'webcomic',
        ],
    },
    language: 'de',
    searchTerm: '',
    textFilter: '',
    page: 1,
    perPage: 20,
    browseMode: false,
});

export const getters = {
    language: () => state.language,
    searchTerm: () => state.searchTerm,
    textFilter: () => state.textFilter,
    filter: () => state.filter,
    page: () => state.page,
    perPage: () => state.perPage,
    browseMode: () => state.browseMode,
};

export const mutations = {
    setFilter: val => (state.filter = val),
    setStatusFilter: val => (state.filter.statusFilter = val),
    setTextFilter: val => (state.textFilter = val),
    setTypeFilter: val => (state.filter.typeFilter = val),
    setLanguage: val => (state.language = val),
    setSearchTerm: val => (state.searchTerm = val),
    setPage: val => (state.page = val),
    setPerPage: val => (state.perPage = val),
    setBrowseMode: val => (state.browseMode = val),
};
