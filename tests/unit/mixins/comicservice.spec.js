import { flushPromises } from '@vue/test-utils';
import ComicService from '@/mixins/comicservice';
import { mountMixin } from '../testUtils';

vi.mock('@/services/httpclient', () => ({
    httpClient: { get: vi.fn(), post: vi.fn() },
}));

import { httpClient } from '@/services/httpclient';

describe('comicservice mixin', () => {
    beforeEach(() => {
        httpClient.get.mockReset();
        httpClient.post.mockReset();
    });

    describe('isComicListEmpty', () => {
        it('is true only for an empty-string response', () => {
            expect(ComicService.methods.isComicListEmpty('')).toBe(true);
            expect(ComicService.methods.isComicListEmpty([])).toBe(false);
            expect(ComicService.methods.isComicListEmpty([{ id: 1 }])).toBe(
                false
            );
        });
    });

    describe('titleExists', () => {
        it('resolves with the response data on success', async () => {
            httpClient.get.mockResolvedValueOnce({ data: true });
            const wrapper = mountMixin(ComicService, { loading: true });

            const result = await wrapper.vm.titleExists('My Comic');

            expect(httpClient.get).toHaveBeenCalledWith(
                '/comics/title/exists/My Comic'
            );
            expect(result).toBe(true);
            expect(wrapper.vm.loading).toBe(false);
        });

        it('sets errored and returns undefined on failure', async () => {
            httpClient.get.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(ComicService, { loading: true });

            const result = await wrapper.vm.titleExists('My Comic');

            expect(result).toBeUndefined();
            expect(wrapper.vm.errored).toBe(true);
            expect(wrapper.vm.loading).toBe(false);
        });
    });

    describe('search', () => {
        it('posts the search term as form data and returns the results', async () => {
            httpClient.post.mockResolvedValueOnce({ data: [{ id: 1 }] });
            const wrapper = mountMixin(ComicService, { loading: true });

            const result = await wrapper.vm.search('batman');

            expect(httpClient.post).toHaveBeenCalledWith(
                '/search',
                expect.any(FormData)
            );
            const formData = httpClient.post.mock.calls[0][1];
            expect(formData.get('searchTerm')).toBe('batman');
            expect(result).toEqual([{ id: 1 }]);
            expect(wrapper.vm.loading).toBe(false);
        });

        it('returns an empty array when the API responds with an empty string', async () => {
            httpClient.post.mockResolvedValueOnce({ data: '' });
            const wrapper = mountMixin(ComicService);

            const result = await wrapper.vm.search('nothing');

            expect(result).toEqual([]);
        });

        it('sets errored on failure', async () => {
            httpClient.post.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(ComicService);

            await wrapper.vm.search('batman');
            await flushPromises();

            expect(wrapper.vm.errored).toBe(true);
        });
    });
});
