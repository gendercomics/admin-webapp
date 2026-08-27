import { mount } from '@vue/test-utils';
import logger from '@/services/logger';

export function mountOptions(overrides = {}) {
    return {
        global: {
            mocks: { $log: logger },
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
