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
        },
        async search(searchTerm) {
            try {
                const formData = new FormData();
                formData.append('searchTerm', searchTerm);

                const { data: response } = await httpClient.post(
                    '/search/',
                    formData
                );
                return response;
            } catch (error) {
                this.$log.error(error);
                this.errored = true;
            } finally {
                this.loading = false;
            }
        },
    },
};
