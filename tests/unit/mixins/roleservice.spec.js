import { flushPromises } from '@vue/test-utils';
import RoleService from '@/mixins/roleservice';
import { mountMixin } from '../testUtils';

vi.mock('@/services/httpclient', () => ({
    httpClient: { get: vi.fn() },
}));

import { httpClient } from '@/services/httpclient';

describe('roleservice mixin', () => {
    beforeEach(() => {
        httpClient.get.mockReset();
    });

    describe('addRoleOption', () => {
        it('sets value to the role and text to the role name', () => {
            const wrapper = mountMixin(RoleService);
            const role = { id: 1, name: 'Writer' };

            wrapper.vm.addRoleOption(role);

            expect(wrapper.vm.roleOptions).toEqual([
                { value: role, text: 'Writer' },
            ]);
        });
    });

    describe('loadRoles', () => {
        it('adds one option per role returned by the API', async () => {
            httpClient.get.mockResolvedValueOnce({
                data: [
                    { id: 1, name: 'Writer' },
                    { id: 2, name: 'Artist' },
                ],
            });
            const wrapper = mountMixin(RoleService);

            wrapper.vm.loadRoles();
            expect(wrapper.vm.loading).toBe(true);

            await flushPromises();

            expect(httpClient.get).toHaveBeenCalledWith('/roles');
            expect(wrapper.vm.roleOptions).toHaveLength(2);
            expect(wrapper.vm.loading).toBe(false);
        });

        it('stops loading on failure without adding options', async () => {
            httpClient.get.mockRejectedValueOnce(new Error('boom'));
            const wrapper = mountMixin(RoleService);

            wrapper.vm.loadRoles();
            await flushPromises();

            expect(wrapper.vm.roleOptions).toEqual([]);
            expect(wrapper.vm.loading).toBe(false);
        });
    });
});
