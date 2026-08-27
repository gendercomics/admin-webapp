import { flushPromises } from '@vue/test-utils';
import TextService from '@/mixins/textservice';
import { mountMixin } from '../testUtils';

vi.mock('@/services/httpclient', () => ({
    httpClient: { post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { httpClient } from '@/services/httpclient';

describe('textservice mixin', () => {
    beforeEach(() => {
        httpClient.post.mockReset();
        httpClient.put.mockReset();
        httpClient.delete.mockReset();
    });

    describe('saveText', () => {
        it('POSTs to /texts/ when text.id is null', async () => {
            httpClient.post.mockResolvedValueOnce({
                data: { id: 5, value: 'hi' },
            });
            const wrapper = mountMixin(TextService, {
                text: { id: null, value: 'hi', metadata: null },
            });

            wrapper.vm.saveText();
            await flushPromises();

            expect(httpClient.post).toHaveBeenCalledWith('/texts/', {
                id: null,
                value: 'hi',
                metadata: null,
            });
            expect(httpClient.put).not.toHaveBeenCalled();
            expect(wrapper.vm.text).toEqual({ id: 5, value: 'hi' });
        });

        it('PUTs to /texts/:id when text.id is already set', async () => {
            httpClient.put.mockResolvedValueOnce({
                data: { id: 5, value: 'updated' },
            });
            const wrapper = mountMixin(TextService, {
                text: { id: 5, value: 'hi', metadata: null },
            });

            wrapper.vm.saveText();
            await flushPromises();

            expect(httpClient.put).toHaveBeenCalledWith(
                '/texts/5',
                expect.objectContaining({ id: 5 })
            );
            expect(httpClient.post).not.toHaveBeenCalled();
            expect(wrapper.vm.text).toEqual({ id: 5, value: 'updated' });
        });

        it('sets errored on failure', async () => {
            httpClient.post.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(TextService, {
                text: { id: null, value: 'hi', metadata: null },
            });

            wrapper.vm.saveText();
            await flushPromises();

            expect(wrapper.vm.errored).toBe(true);
        });
    });

    describe('deleteText', () => {
        it('deletes by id', async () => {
            httpClient.delete.mockResolvedValueOnce({});
            const wrapper = mountMixin(TextService);

            wrapper.vm.deleteText(9);
            await flushPromises();

            expect(httpClient.delete).toHaveBeenCalledWith('/texts/9');
            expect(wrapper.vm.errored).toBe(false);
        });

        it('sets errored on failure', async () => {
            httpClient.delete.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(TextService);

            wrapper.vm.deleteText(9);
            await flushPromises();

            expect(wrapper.vm.errored).toBe(true);
        });
    });
});
