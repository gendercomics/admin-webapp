import { shallowMount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ComicList from '@/components/ComicList.vue';
import { mountOptions } from '../testUtils';

vi.mock('@/services/httpclient', () => ({
    httpClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}));

import { httpClient } from '@/services/httpclient';

function baseComic(overrides = {}) {
    return {
        id: 1,
        nameForWebAppList: 'Batman',
        subTitle: null,
        partOf: null,
        creators: [],
        publishers: [],
        type: 'comic',
        metaData: { status: 'DRAFT' },
        ...overrides,
    };
}

function mountComicList({ initialState = {}, data = {} } = {}) {
    const push = vi.fn();
    const options = mountOptions({
        data: () => data,
        global: {
            ...mountOptions().global,
            mocks: { ...mountOptions().global.mocks, $router: { push } },
            plugins: [
                createTestingPinia({
                    initialState: { comicList: initialState },
                    stubActions: false,
                }),
            ],
        },
    });
    const wrapper = shallowMount(ComicList, options);
    return { wrapper, push };
}

describe('ComicList.vue', () => {
    beforeEach(() => {
        httpClient.get.mockReset();
        httpClient.post.mockReset();
        httpClient.delete.mockReset();
    });

    describe('loadComicList', () => {
        it('populates comics and totalRows on success', async () => {
            httpClient.get.mockResolvedValueOnce({
                data: [baseComic({ id: 1 }), baseComic({ id: 2 })],
            });
            const { wrapper } = mountComicList();

            wrapper.vm.loadComicList();
            await flushPromises();

            expect(httpClient.get).toHaveBeenCalledWith('/comicsList');
            expect(wrapper.vm.comics).toHaveLength(2);
            expect(wrapper.vm.totalRows).toBe(2);
            expect(wrapper.vm.loading).toBe(false);
        });

        it('sets errored on failure', async () => {
            httpClient.get.mockRejectedValueOnce(new Error('boom'));
            const { wrapper } = mountComicList();

            wrapper.vm.loadComicList();
            await flushPromises();

            expect(wrapper.vm.errored).toBe(true);
            expect(wrapper.vm.loading).toBe(false);
        });
    });

    describe('mounted()', () => {
        it('loads the full list when browseMode is on', async () => {
            httpClient.get.mockResolvedValueOnce({ data: [] });
            mountComicList({ initialState: { browseMode: true } });

            await flushPromises();

            expect(httpClient.get).toHaveBeenCalledWith('/comicsList');
        });

        it('searches instead when browseMode is off and a searchTerm is set', async () => {
            httpClient.post.mockResolvedValueOnce({ data: [] });
            mountComicList({
                initialState: { browseMode: false, searchTerm: 'batman' },
            });

            vi.useFakeTimers();
            await flushPromises();
            vi.advanceTimersByTime(500);
            await flushPromises();
            vi.useRealTimers();

            expect(httpClient.post).toHaveBeenCalledWith(
                '/search',
                expect.any(FormData)
            );
        });
    });

    describe('filteredComics', () => {
        it('returns all comics when filters are unrestricted and textFilter is empty', () => {
            const { wrapper } = mountComicList({
                data: {
                    comics: [
                        baseComic({ id: 1 }),
                        baseComic({ id: 2, nameForWebAppList: 'Superman' }),
                    ],
                },
            });

            expect(wrapper.vm.filteredComics).toHaveLength(2);
        });

        it('excludes comics whose status is not in the store statusFilter', () => {
            const { wrapper } = mountComicList({
                initialState: { filter: { statusFilter: ['FINAL'] } },
                data: {
                    comics: [
                        baseComic({ id: 1, metaData: { status: 'DRAFT' } }),
                        baseComic({ id: 2, metaData: { status: 'FINAL' } }),
                    ],
                },
            });

            expect(wrapper.vm.filteredComics.map((c) => c.id)).toEqual([2]);
        });

        it('excludes comics whose title does not match textFilter', () => {
            const { wrapper } = mountComicList({
                initialState: { textFilter: 'super' },
                data: {
                    comics: [
                        baseComic({ id: 1, nameForWebAppList: 'Batman' }),
                        baseComic({ id: 2, nameForWebAppList: 'Superman' }),
                    ],
                },
            });

            expect(wrapper.vm.filteredComics.map((c) => c.id)).toEqual([2]);
        });
    });

    describe('typeAbbreviation', () => {
        it.each([
            ['comic', 'C'],
            ['anthology', 'A'],
            ['magazine', 'M'],
            ['webcomic', 'W'],
            ['comic_series', 'S'],
            ['publishing_series', 'R'],
            ['something_unknown', ''],
        ])('maps %s to %s', (type, expected) => {
            const { wrapper } = mountComicList();
            expect(wrapper.vm.typeAbbreviation(type)).toBe(expected);
        });
    });

    describe('fullName', () => {
        it('prefers a single `name` field when present', () => {
            const { wrapper } = mountComicList();
            expect(
                wrapper.vm.fullName({ name: 'Jane Doe', firstName: 'Jane' })
            ).toBe('Jane Doe');
        });

        it('falls back to firstName + lastName', () => {
            const { wrapper } = mountComicList();
            expect(
                wrapper.vm.fullName({ firstName: 'Jane', lastName: 'Doe' })
            ).toBe('Jane Doe');
        });

        it('returns an empty string for null', () => {
            const { wrapper } = mountComicList();
            expect(wrapper.vm.fullName(null)).toBe('');
        });
    });

    describe('edit', () => {
        it('navigates to the comic detail route', () => {
            const { wrapper, push } = mountComicList();

            wrapper.vm.edit({ id: 42 });

            expect(push).toHaveBeenCalledWith('/comics/42');
        });
    });

    describe('deleteComic', () => {
        it('deletes via httpClient and removes the item from comics', async () => {
            httpClient.delete.mockResolvedValueOnce({});
            const comic = baseComic({ id: 7 });
            const { wrapper } = mountComicList({
                data: { comics: [comic, baseComic({ id: 8 })] },
            });

            wrapper.vm.deleteComic(comic);
            await flushPromises();

            expect(httpClient.delete).toHaveBeenCalledWith('/comics/7', comic);
            expect(wrapper.vm.comics.map((c) => c.id)).toEqual([8]);
        });
    });

    describe('promptDelete / confirmDelete', () => {
        it('opens the confirmation modal, then deletes on confirm', async () => {
            httpClient.delete.mockResolvedValueOnce({});
            const comic = baseComic({ id: 3 });
            const { wrapper } = mountComicList({ data: { comics: [comic] } });

            wrapper.vm.promptDelete(comic);
            expect(wrapper.vm.showDeleteModal).toBe(true);
            expect(wrapper.vm.itemToDelete).toBe(comic);

            wrapper.vm.confirmDelete();
            await flushPromises();

            expect(httpClient.delete).toHaveBeenCalledWith('/comics/3', comic);
        });
    });

    describe('clearSearchTermAndFilter', () => {
        it('resets both the store search term and text filter', () => {
            const { wrapper } = mountComicList({
                initialState: { searchTerm: 'batman', textFilter: 'bat' },
            });

            wrapper.vm.clearSearchTermAndFilter();

            expect(wrapper.vm.searchTerm).toBe('');
            expect(wrapper.vm.textFilter).toBe('');
        });
    });
});
