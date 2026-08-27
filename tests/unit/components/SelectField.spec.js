import { mount } from '@vue/test-utils';
import SelectField from '@/components/SelectField.vue';
import { mountOptions } from '../testUtils';

const options = [
    { id: 1, name: 'One' },
    { id: 2, name: 'Two' },
];

// `selected` is passed explicitly as null in most cases below to avoid the
// created() quirk covered by its own test further down.

describe('SelectField.vue', () => {
    it('renders the label and options', () => {
        const wrapper = mount(
            SelectField,
            mountOptions({
                props: {
                    label: 'Pick one',
                    modelValue: null,
                    options,
                    selected: null,
                },
            })
        );

        expect(wrapper.text()).toContain('Pick one');
        expect(wrapper.findAll('option').length).toBe(options.length);
    });

    it('emits update:modelValue when the selection changes', async () => {
        const wrapper = mount(
            SelectField,
            mountOptions({
                props: {
                    label: 'Pick one',
                    modelValue: null,
                    options,
                    selected: null,
                },
            })
        );

        await wrapper.find('select').setValue(2);

        expect(wrapper.emitted('update:modelValue')[0]).toEqual([2]);
    });

    it('emits update:modelValue with the selected prop on creation', () => {
        const wrapper = mount(
            SelectField,
            mountOptions({
                props: {
                    label: 'Pick one',
                    modelValue: null,
                    options,
                    selected: 1,
                },
            })
        );

        expect(wrapper.emitted('update:modelValue')[0]).toEqual([1]);
    });

    it('emits update:modelValue with undefined on creation when selected is omitted entirely', () => {
        // Real quirk: the `selected` prop has no default, so an omitted
        // `selected` resolves to `undefined`, and created()'s
        // `this.selected !== null` check is then always true - firing an
        // unconditional emit on every mount that doesn't explicitly pass
        // `selected: null`. Locking this in so a future fix is a deliberate
        // change, not a silent regression.
        const wrapper = mount(
            SelectField,
            mountOptions({
                props: { label: 'Pick one', modelValue: null, options },
            })
        );

        expect(wrapper.emitted('update:modelValue')[0]).toEqual([undefined]);
    });

    it('shows the delete button only when removable', () => {
        const removable = mount(
            SelectField,
            mountOptions({
                props: {
                    label: 'Pick one',
                    modelValue: null,
                    options,
                    selected: null,
                    removable: true,
                },
            })
        );
        const notRemovable = mount(
            SelectField,
            mountOptions({
                props: {
                    label: 'Pick one',
                    modelValue: null,
                    options,
                    selected: null,
                },
            })
        );

        expect(removable.findAll('button').length).toBe(1);
        expect(notRemovable.findAll('button').length).toBe(0);
    });

    it('deleteValue() emits update:modelValue with null', () => {
        const wrapper = mount(
            SelectField,
            mountOptions({
                props: {
                    label: 'Pick one',
                    modelValue: 1,
                    options,
                    selected: null,
                    removable: true,
                },
            })
        );

        wrapper.vm.deleteValue();

        expect(wrapper.emitted('update:modelValue')[0]).toEqual([null]);
    });
});
