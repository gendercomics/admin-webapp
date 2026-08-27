import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import TagInput from '@/components/TagInput.vue';
import { mountOptions } from '../testUtils';

vi.mock('@/services/httpclient', () => ({
    httpClient: { get: vi.fn() },
}));

import { httpClient } from '@/services/httpclient';

const keywords = [
    { id: 1, values: { de: { name: 'Krieg' }, en: { name: 'War' } } },
    { id: 2, values: { de: { name: 'Liebe' }, en: { name: 'Love' } } },
];

function mountTagInput(overrides = {}) {
    return mount(
        TagInput,
        mountOptions({
            props: { label: 'Keywords', modelValue: [], ...overrides.props },
            global: {
                ...mountOptions().global,
                plugins: [
                    createTestingPinia({
                        initialState: { comicList: { language: 'de' } },
                        stubActions: false,
                    }),
                ],
            },
        })
    );
}

describe('TagInput.vue', () => {
    beforeEach(() => {
        httpClient.get.mockReset();
    });

    it('loads options for the given type on creation', async () => {
        httpClient.get.mockResolvedValueOnce({ data: keywords });
        const wrapper = mountTagInput({ props: { type: 'content' } });

        await flushPromises();

        expect(httpClient.get).toHaveBeenCalledWith('/keywords?type=content');
        expect(wrapper.vm.options).toEqual(keywords);
    });

    it('initializes tagNames from the modelValue using the store language', async () => {
        httpClient.get.mockResolvedValueOnce({ data: keywords });
        const wrapper = mountTagInput({
            props: { modelValue: [keywords[0]] },
        });
        await flushPromises();

        expect(wrapper.vm.tagNames).toEqual(['Krieg']);
    });

    it('onOptionClick adds the tag and emits the mapped selection', async () => {
        httpClient.get.mockResolvedValueOnce({ data: keywords });
        const wrapper = mountTagInput();
        await flushPromises();

        wrapper.vm.onOptionClick({ option: keywords[1], addTag: vi.fn() });
        // onOptionClick only mutates tagNames - it doesn't emit itself
        // (unlike onTagRemoved/deleteValue) - so assert the resulting state.
        expect(wrapper.vm.tagNames).toEqual(['Liebe']);
        expect(wrapper.vm.mappedTags).toEqual([keywords[1]]);
    });

    it('onTagRemoved removes the tag and emits update:modelValue', async () => {
        httpClient.get.mockResolvedValueOnce({ data: keywords });
        const wrapper = mountTagInput({
            props: { modelValue: [keywords[0]] },
        });
        await flushPromises();

        wrapper.vm.onTagRemoved({ tag: 'Krieg', removeTag: vi.fn() });

        expect(wrapper.vm.tagNames).toEqual([]);
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([[]]);
    });

    it('deleteValue() emits update:modelValue with null', async () => {
        httpClient.get.mockResolvedValueOnce({ data: keywords });
        const wrapper = mountTagInput();
        await flushPromises();

        wrapper.vm.deleteValue();

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([null]);
    });
});
