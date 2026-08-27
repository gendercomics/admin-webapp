import { mount } from '@vue/test-utils';
import dayjs from 'dayjs';
import logger from '@/services/logger';

// Mirrors the globalProperties registered in main.js (outside of what a
// component's own imports/props already cover), so components that read
// `this.$statusOptions`/`this.$typeOptions`/`moment` don't need one-off
// mocks wired up per test.
const STATUS_OPTIONS = ['DRAFT', 'CLARIFICATION', 'REVIEW', 'FINAL'];
const TYPE_OPTIONS = [
    { text: 'A', value: 'anthology' },
    { text: 'C', value: 'comic' },
    { text: 'S', value: 'comic_series' },
    { text: 'M', value: 'magazine' },
    { text: 'R', value: 'publishing_series' },
    { text: 'W', value: 'webcomic' },
];

export function mountOptions(overrides = {}) {
    return {
        global: {
            mocks: {
                $log: logger,
                $statusOptions: STATUS_OPTIONS,
                $typeOptions: TYPE_OPTIONS,
                moment: dayjs,
                $router: { push: vi.fn() },
            },
            stubs: { FontAwesomeIcon: true, BFormDatepicker: true },
        },
        ...overrides,
    };
}

// Mounts a throwaway host component with the given Options-API mixin
// applied, so the mixin's own methods can be exercised through a real Vue
// instance (this.$log, reactivity, etc.) without pulling in the real
// component that normally hosts it.
export function mountMixin(mixin, data = {}) {
    return mount(
        { mixins: [mixin], data: () => data, template: '<div></div>' },
        mountOptions()
    );
}
