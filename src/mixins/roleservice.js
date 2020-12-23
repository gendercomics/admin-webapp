import { httpClient } from '@/services/httpclient';

export default {
    data: function() {
        return {
            roles: [],
            loading: false,
        };
    },
    created: function() {},
    methods: {
        loadRoles() {
            this.loading = true;
            httpClient
                .get('/roles')
                .then(response => (this.roles = response.data))
                .catch(error => {
                    this.$log.error(error);
                })
                .finally(() => (this.loading = false));
        },
    },
};
