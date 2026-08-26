import { defineStore } from 'pinia';

export const useComicListStore = defineStore('comicList', {
    state: () => ({
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
    }),
});
