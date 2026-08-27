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
