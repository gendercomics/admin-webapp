const isDev = import.meta.env.DEV;

export default {
    debug: (...args) => isDev && console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
};
