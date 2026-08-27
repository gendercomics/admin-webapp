import { flushPromises } from '@vue/test-utils';
import PersonService from '@/mixins/personservice';
import { mountMixin } from '../testUtils';

vi.mock('@/services/httpclient', () => ({
    httpClient: { get: vi.fn() },
}));

import { httpClient } from '@/services/httpclient';

describe('personservice mixin', () => {
    beforeEach(() => {
        httpClient.get.mockReset();
    });

    describe('loadCreators', () => {
        it('sets loading synchronously, then names/loading once resolved', async () => {
            httpClient.get.mockResolvedValueOnce({
                data: [{ id: 1, name: 'Jane' }],
            });
            const wrapper = mountMixin(PersonService);

            wrapper.vm.loadCreators();
            expect(wrapper.vm.loading).toBe(true);

            await flushPromises();

            expect(httpClient.get).toHaveBeenCalledWith('/creators');
            expect(wrapper.vm.names).toEqual([{ id: 1, name: 'Jane' }]);
            expect(wrapper.vm.loading).toBe(false);
        });

        it('leaves names empty and stops loading on failure', async () => {
            httpClient.get.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(PersonService);

            wrapper.vm.loadCreators();
            await flushPromises();

            expect(wrapper.vm.names).toEqual([]);
            expect(wrapper.vm.loading).toBe(false);
        });
    });
});
