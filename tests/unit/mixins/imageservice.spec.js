import { flushPromises } from '@vue/test-utils';
import ImageService from '@/mixins/imageservice';
import { mountMixin } from '../testUtils';

vi.mock('@/services/httpclient', () => ({
    httpClient: { get: vi.fn(), post: vi.fn() },
}));

import { httpClient } from '@/services/httpclient';

describe('imageservice mixin', () => {
    beforeEach(() => {
        httpClient.get.mockReset();
        httpClient.post.mockReset();
    });

    describe('checkDnbCover', () => {
        it('does nothing for an isbn shorter than 13 characters', () => {
            const wrapper = mountMixin(ImageService);

            wrapper.vm.checkDnbCover('123');

            expect(httpClient.get).not.toHaveBeenCalled();
        });

        it('does nothing for a null isbn', () => {
            const wrapper = mountMixin(ImageService);

            wrapper.vm.checkDnbCover(null);

            expect(httpClient.get).not.toHaveBeenCalled();
        });

        it('sets dnbHasCover/dnbCheckFinished on success', async () => {
            httpClient.get.mockResolvedValueOnce({ data: true });
            const wrapper = mountMixin(ImageService, { loading: true });

            wrapper.vm.checkDnbCover('9781234567890');
            await flushPromises();

            expect(httpClient.get).toHaveBeenCalledWith(
                '/files/dnb/cover/available/9781234567890'
            );
            expect(wrapper.vm.dnbHasCover).toBe(true);
            expect(wrapper.vm.dnbCheckFinished).toBe(true);
            expect(wrapper.vm.loading).toBe(false);
        });

        it('sets errored on failure', async () => {
            httpClient.get.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(ImageService);

            wrapper.vm.checkDnbCover('9781234567890');
            await flushPromises();

            expect(wrapper.vm.errored).toBe(true);
        });
    });

    describe('downLoadDnbCover', () => {
        it('posts comicId/isbn and stores the returned cover', async () => {
            httpClient.post.mockResolvedValueOnce({ data: 'cover.png' });
            const wrapper = mountMixin(ImageService, {
                comic: { id: 42, isbn: '9781234567890' },
            });

            await wrapper.vm.downLoadDnbCover();

            expect(httpClient.post).toHaveBeenCalledWith(
                '/files/dnb/cover/download',
                expect.any(FormData)
            );
            const formData = httpClient.post.mock.calls[0][1];
            expect(formData.get('comicId')).toBe('42');
            expect(formData.get('isbn')).toBe('9781234567890');
            expect(wrapper.vm.comic.cover).toBe('cover.png');
            expect(wrapper.vm.coverLoading).toBe(false);
        });

        it('sets errored on failure', async () => {
            httpClient.post.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(ImageService, {
                comic: { id: 42, isbn: '9781234567890' },
            });

            await wrapper.vm.downLoadDnbCover();

            expect(wrapper.vm.errored).toBe(true);
            expect(wrapper.vm.coverLoading).toBe(false);
        });
    });
});
