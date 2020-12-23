import { httpClient } from '@/services/httpclient';

export default {
    data: function() {
        return {
            names: [],
            loading: false,
        };
    },
    created: function() {},
    methods: {
        loadCreators() {
            this.loading = true;
            httpClient
                .get('/creators')
                .then(response => (this.names = response.data))
                .catch(error => {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
    },
};
