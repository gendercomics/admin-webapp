import { createPinia, setActivePinia } from 'pinia';
import { useComicListStore } from '@/stores/comicListStore';

describe('comicListStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('has the expected default state', () => {
        const store = useComicListStore();

        expect(store.filter).toEqual({
            statusFilter: ['DRAFT', 'CLARIFICATION', 'REVIEW', 'FINAL'],
            typeFilter: [
                'anthology',
                'comic',
                'comic_series',
                'magazine',
                'publishing_series',
                'webcomic',
            ],
        });
        expect(store.language).toBe('de');
        expect(store.searchTerm).toBe('');
        expect(store.textFilter).toBe('');
        expect(store.page).toBe(1);
        expect(store.perPage).toBe(20);
        expect(store.browseMode).toBe(false);
    });

    it('is reactive to top-level state changes', () => {
        const store = useComicListStore();

        store.language = 'en';
        store.page = 3;

        expect(store.language).toBe('en');
        expect(store.page).toBe(3);
    });

    it('is reactive to nested filter state changes', () => {
        const store = useComicListStore();

        store.filter.statusFilter = ['DRAFT'];

        expect(store.filter.statusFilter).toEqual(['DRAFT']);
        // typeFilter is a sibling of statusFilter on the same nested object -
        // reassigning one shouldn't disturb the other.
        expect(store.filter.typeFilter).toEqual([
            'anthology',
            'comic',
            'comic_series',
            'magazine',
            'publishing_series',
            'webcomic',
        ]);
    });

    it('gives each store instance independent state', () => {
        const store = useComicListStore();
        store.searchTerm = 'batman';

        setActivePinia(createPinia());
        const freshStore = useComicListStore();

        expect(freshStore.searchTerm).toBe('');
    });
});
