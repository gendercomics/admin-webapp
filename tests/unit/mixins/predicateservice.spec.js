import PredicateService from '@/mixins/predicateservice';
import { mountMixin } from '../testUtils';

vi.mock('@/services/httpclient', () => ({
    httpClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { httpClient } from '@/services/httpclient';

describe('predicateservice mixin', () => {
    beforeEach(() => {
        httpClient.get.mockReset();
        httpClient.post.mockReset();
        httpClient.put.mockReset();
        httpClient.delete.mockReset();
    });

    describe('loadPredicates', () => {
        it('stores predicates and derives totalRows on success', async () => {
            httpClient.get.mockResolvedValueOnce({
                data: [{ id: 1 }, { id: 2 }],
            });
            const wrapper = mountMixin(PredicateService);

            await wrapper.vm.loadPredicates();

            expect(httpClient.get).toHaveBeenCalledWith('/predicates');
            expect(wrapper.vm.predicates).toEqual([{ id: 1 }, { id: 2 }]);
            expect(wrapper.vm.totalRows).toBe(2);
            expect(wrapper.vm.loading).toBe(false);
        });

        it('sets errored on failure', async () => {
            httpClient.get.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(PredicateService);

            await wrapper.vm.loadPredicates();

            expect(wrapper.vm.errored).toBe(true);
            expect(wrapper.vm.loading).toBe(false);
        });
    });

    describe('insertPredicate', () => {
        it('posts de/en as form data and stores the new predicate', async () => {
            httpClient.post.mockResolvedValueOnce({ data: { id: 3 } });
            const wrapper = mountMixin(PredicateService);

            await wrapper.vm.insertPredicate('deutsch', 'english');

            expect(httpClient.post).toHaveBeenCalledWith(
                '/predicates',
                expect.any(FormData)
            );
            const formData = httpClient.post.mock.calls[0][1];
            expect(formData.get('de')).toBe('deutsch');
            expect(formData.get('en')).toBe('english');
            expect(wrapper.vm.newPredicate).toEqual({ id: 3 });
        });
    });

    describe('deletePredicate', () => {
        it('deletes by id', async () => {
            httpClient.delete.mockResolvedValueOnce({});
            const wrapper = mountMixin(PredicateService);

            await wrapper.vm.deletePredicate(7);

            expect(httpClient.delete).toHaveBeenCalledWith('/predicates/7');
            expect(wrapper.vm.errored).toBe(false);
        });

        it('sets errored on failure', async () => {
            httpClient.delete.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(PredicateService);

            await wrapper.vm.deletePredicate(7);

            expect(wrapper.vm.errored).toBe(true);
        });
    });

    describe('savePredicate', () => {
        it('puts de/en as form data and stores the updated predicate', async () => {
            httpClient.put.mockResolvedValueOnce({ data: { id: 3 } });
            const wrapper = mountMixin(PredicateService);

            await wrapper.vm.savePredicate(3, 'deutsch', 'english');

            expect(httpClient.put).toHaveBeenCalledWith(
                '/predicates/3',
                expect.any(FormData)
            );
            const formData = httpClient.put.mock.calls[0][1];
            expect(formData.get('de')).toBe('deutsch');
            expect(formData.get('en')).toBe('english');
            expect(wrapper.vm.updatedPredicate).toEqual({ id: 3 });
        });
    });
});
