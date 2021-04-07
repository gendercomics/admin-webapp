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
            this.saved = false;
            if (this.text.id === null) {
                httpClient
                    .post('/texts/', this.text)
                    .then(
                        response => (
                            (this.text = response.data), (this.saved = true)
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            } else {
                httpClient
                    .put('/texts/' + this.text.id, this.text)
                    .then(
                        response => (
                            (this.text = response.data), (this.saved = true)
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            }
        },
    },
};
