<template>
    <div id="app">
        <main id="main" class="main-wrapper main-wrapper--full">
            <router-view />
        </main>
    </div>
</template>

<script>
export default {
    watch: {
        $route(to) {
            document.title = to.meta.title || 'gendercomics.net';
        },
        immediate: true,
    },
};
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
