import { mount } from '@vue/test-utils';
import InputField from '@/components/InputField.vue';
import { mountOptions } from '../testUtils';

describe('InputField.vue', () => {
    it('renders the label and modelValue', () => {
        const wrapper = mount(
            InputField,
            mountOptions({ props: { label: 'Title', modelValue: 'foo' } })
        );

        expect(wrapper.text()).toContain('Title');
        expect(wrapper.find('input').element.value).toBe('foo');
    });

    it('emits update:modelValue when the input changes', async () => {
        const wrapper = mount(
            InputField,
            mountOptions({ props: { label: 'Title', modelValue: 'foo' } })
        );

        await wrapper.find('input').setValue('bar');

        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['bar']);
    });

    it('shows the external-link button only when type is url', () => {
        const url = mount(
            InputField,
            mountOptions({
                props: { label: 'Link', modelValue: '', type: 'url' },
            })
        );
        const text = mount(
            InputField,
            mountOptions({ props: { label: 'Text', modelValue: '' } })
        );

        expect(url.findAll('button').length).toBe(1);
        expect(text.findAll('button').length).toBe(0);
    });

    it('shows the delete button only when removable', () => {
        const removable = mount(
            InputField,
            mountOptions({
                props: { label: 'Text', modelValue: '', removable: true },
            })
        );
        const notRemovable = mount(
            InputField,
            mountOptions({ props: { label: 'Text', modelValue: '' } })
        );

        expect(removable.findAll('button').length).toBe(1);
        expect(notRemovable.findAll('button').length).toBe(0);
    });

    it('deleteValue() emits update:modelValue with null', () => {
        const wrapper = mount(
            InputField,
            mountOptions({
                props: { label: 'Text', modelValue: 'foo', removable: true },
            })
        );

        wrapper.vm.deleteValue();

        expect(wrapper.emitted('update:modelValue')[0]).toEqual([null]);
    });

    it('openLink() opens the modelValue in a new tab', () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
        const wrapper = mount(
            InputField,
            mountOptions({
                props: {
                    label: 'Link',
                    modelValue: 'https://example.com',
                    type: 'url',
                },
            })
        );

        wrapper.vm.openLink();

        expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
        openSpy.mockRestore();
    });
});
