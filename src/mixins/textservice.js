import { httpClient } from '@/services/httpclient';

export default {
    data: function() {
        return {
            text: {
                id: null,
                value: null,
                metadata: null,
            },
            errored: false,
        };
    },
    created: function() {},
    methods: {
        saveText() {
            if (this.text.id === null) {
                httpClient
                    .post('/texts/', this.text)
                    .then(response => (this.text = response.data))
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            } else {
                httpClient
                    .put('/texts/' + this.text.id, this.text)
                    .then(response => (this.text = response.data))
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            }
        },
        deleteText(id) {
            this.$log.debug('delete text: id=' + id);
            httpClient.delete('/texts/' + id).catch(error => {
                console.log(error);
                this.errored = true;
            });
        },
    },
};
