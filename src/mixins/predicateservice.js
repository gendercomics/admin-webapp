import { httpClient } from '@/services/httpclient';

export default {
    data: function() {
        return {
            errored: false,
            updatedPredicate: null,
        };
    },
    created: function() {},
    methods: {
        async loadPredicates() {
            this.loading = true;
            await httpClient
                .get('/predicates')
                .then(
                    response => (
                        (this.predicates = response.data),
                        (this.totalRows = this.predicates.length)
                    )
                )
                .catch(error => {
                    this.$log.error(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        async insertPredicate(de, en) {
            this.loading = true;
            const formData = new FormData();
            formData.append('de', de);
            formData.append('en', en);

            await httpClient
                .post('/predicates', formData)
                .then(response => (this.newPredicate = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        async deletePredicate(predicateId) {
            await httpClient
                .delete('/predicates/' + predicateId)
                .catch(error => {
                    this.$log.error(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        async savePredicate(id, de, en) {
            this.loading = true;
            this.$log.debug(
                'savePredicate: id= ' + id + ', de=' + de + ', en=' + en
            );

            const formData = new FormData();
            formData.append('de', de);
            formData.append('en', en);

            await httpClient
                .put('/predicates/' + id, formData)
                .then(response => (this.updatedPredicate = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
    },
};
