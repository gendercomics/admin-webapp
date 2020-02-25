<template>
    <div class="text-left">
        <Header />
        <ComicList />
    </div>
</template>

<script>
import Header from '@/components/Header';
import ComicList from '@/components/ComicList';

export default {
    name: 'comics',
    components: {
        Header,
        ComicList,
    },
    data() {
        return {
            comicCount: '?',
            loading: true,
            errored: false,
        };
    },
    mounted() {
        this.$api
            .get('/comics/count')
            .then(response => (this.comicCount = response.data))
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
    },
};
</script>
