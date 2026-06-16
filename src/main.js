import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createBootstrap } from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import App from './App.vue';
import router from './router';
import keycloak from './services/keycloak';
import logger from './services/logger';
import dayjs from 'dayjs';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faArrowRightFromBracket,
    faArrowRightToBracket,
    faBackspace,
    faBold,
    faCheckCircle,
    faCloudDownloadAlt,
    faDatabase,
    faEdit,
    faExclamationTriangle,
    faExternalLinkAlt,
    faFilter,
    faItalic,
    faListOl,
    faListUl,
    faParagraph,
    faPlus,
    faRedo,
    faSave,
    faSearch,
    faTags,
    faTimesCircle,
    faTrashAlt,
    faUnderline,
    faUndo,
    faUser,
    faUserCircle,
    faUserSecret,
} from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import './styles/styles.scss';
import AuthService from './services/authservice';

library.add(
    faArrowRightFromBracket,
    faArrowRightToBracket,
    faBackspace,
    faBold,
    faCheckCircle,
    faCloudDownloadAlt,
    faComment,
    faDatabase,
    faEdit,
    faExclamationTriangle,
    faExternalLinkAlt,
    faFilter,
    faItalic,
    faListOl,
    faListUl,
    faParagraph,
    faPlus,
    faRedo,
    faSave,
    faSearch,
    faTags,
    faTimesCircle,
    faTrashAlt,
    faUnderline,
    faUndo,
    faUser,
    faUserCircle,
    faUserSecret
);

const authService = new AuthService();

keycloak
    .init({ onLoad: 'login-required' })
    .then((auth) => {
        if (!auth) {
            window.location.reload();
            return;
        }
        logger.info('Authenticated');

        const app = createApp(App);
        app.use(createPinia());
        app.use(router);
        app.use(createBootstrap());
        app.component('font-awesome-icon', FontAwesomeIcon);
        app.config.globalProperties.keycloak = keycloak;
        app.config.globalProperties.moment = dayjs;
        app.config.globalProperties.$log = logger;
        app.config.globalProperties.$statusOptions = [
            'DRAFT',
            'CLARIFICATION',
            'REVIEW',
            'FINAL',
        ];
        app.config.globalProperties.$typeOptions = [
            { text: 'A', value: 'anthology' },
            { text: 'C', value: 'comic' },
            { text: 'S', value: 'comic_series' },
            { text: 'M', value: 'magazine' },
            { text: 'R', value: 'publishing_series' },
            { text: 'W', value: 'webcomic' },
        ];
        app.mount('#app');

        authService.storeTokens(keycloak.token, keycloak.refreshToken);
    })
    .catch(() => {
        logger.error('Authentication failed!');
    });
