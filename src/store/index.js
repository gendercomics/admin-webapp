import Vue from 'vue';
import Vuex from 'vuex';
import rootModule from './modules/rootmodule';
import comiclist from './modules/comiclist';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        comicList: comiclist,
        root: rootModule,
    },
    strict: debug,
});
