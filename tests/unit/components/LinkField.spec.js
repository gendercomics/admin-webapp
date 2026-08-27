import { mount } from '@vue/test-utils';
import LinkField from '@/components/LinkField.vue';
import { mountOptions } from '../testUtils';

describe('LinkField.vue', () => {
    it('renders the label and url', () => {
        const wrapper = mount(
            LinkField,
            mountOptions({
                props: {
                    label: 'Source',
                    modelValue: {
                        url: 'https://example.com',
                        lastAccess: null,
                    },
                },
            })
        );

        expect(wrapper.text()).toContain('Source');
        expect(wrapper.find('input[type="url"]').element.value).toBe(
            'https://example.com'
        );
    });

    it('always shows the open-link button, and the delete button only when removable', () => {
        const notRemovable = mount(
            LinkField,
            mountOptions({
                props: {
                    label: 'Source',
                    modelValue: { url: '', lastAccess: null },
                },
            })
        );
        const removable = mount(
            LinkField,
            mountOptions({
                props: {
                    label: 'Source',
                    modelValue: { url: '', lastAccess: null },
                    removable: true,
                },
            })
        );

        expect(notRemovable.findAll('button').length).toBe(1);
        expect(removable.findAll('button').length).toBe(2);
    });

    it('deleteValue() emits "remove" with the current value, not update:modelValue', () => {
        const modelValue = { url: 'https://example.com', lastAccess: null };
        const wrapper = mount(
            LinkField,
            mountOptions({
                props: { label: 'Source', modelValue, removable: true },
            })
        );

        wrapper.vm.deleteValue();

        expect(wrapper.emitted('remove')[0]).toEqual([modelValue]);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('openLink() opens the url in a new tab', () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
        const wrapper = mount(
            LinkField,
            mountOptions({
                props: {
                    label: 'Source',
                    modelValue: {
                        url: 'https://example.com',
                        lastAccess: null,
                    },
                },
            })
        );

        wrapper.vm.openLink();

        expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
        openSpy.mockRestore();
    });
});
