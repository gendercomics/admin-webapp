<template>
    <div class="hello">
        <h1>comic list</h1>
        <div id="comic-list" v-for="comic in comics">
            <a v-bind:href="'/comic/'+ comic.id">{{comic.title}}</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ComicList",
        data() {
            return {
                comics: null,
                loading: true,
                errored: false
            }
        },
        mounted() {
            this.$api
                .get('http://localhost:8001/comics')
                .then(response => (this.comics = response.data))
                .catch(error => {
                    console.log(error)
                    this.errored = true;
                })
                .finally(() => (this.loading = false))
        }
    }
</script>

<style scoped>

</style>


