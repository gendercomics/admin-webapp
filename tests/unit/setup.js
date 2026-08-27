// jsdom doesn't implement ResizeObserver. bootstrap-vue-next's dropdown
// positioning (via @floating-ui) uses it, so any component that renders a
// b-dropdown (e.g. TagInput.vue) needs this stub present in every test.
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};
