import { httpClient } from '@/services/httpclient';

export default {
    data: function() {
        return {
            errored: false,
        };
    },
    created: function() {},
    methods: {
        async checkDnbCover() {
            this.$log.debug('checking DNB cover ...');
            if (this.hasIsbn13) {
                await httpClient
                    .get('/files/dnb/cover/available/' + this.comic.isbn)
                    .then(
                        response => (
                            (this.dnbHasCover = response.data),
                            (this.dnbCheckFinished = true)
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            }
            this.$log.debug('checkDnbCover=' + this.dnbHasCover);
        },
        async downLoadDnbCover() {
            this.coverLoading = true;
            const formData = new FormData();
            formData.append('comicId', this.comic.id);
            formData.append('isbn', this.comic.isbn);

            await httpClient
                .post('/files/dnb/cover/download', formData)
                .then(response => {
                    this.comic.cover = response.data;
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.coverLoading = false));
        },
    },
};
