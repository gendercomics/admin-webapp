import { httpClient } from '@/services/httpclient';

export default {
    data: function() {
        return {
            errored: false,
        };
    },
    created: function() {},
    methods: {
        async titleExists(title) {
            try {
                const { data: response } = await httpClient.get(
                    '/comics/title/exists/' + title
                );
                return response;
            } catch (error) {
                this.$log.error(error);
                this.errored = true;
            } finally {
                this.loading = false;
            }

            /*
            return httpClient
                .get('/comics/title/exists/' + title)
                .then(response => response.data)
                .catch(error => {
                    this.$log.error(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
            */
        },
    },
};
