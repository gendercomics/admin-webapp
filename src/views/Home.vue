<template>
    <Header/>
</template>

<script>
    // @ is an alias to /src
    //import HelloWorld from "@/components/HelloWorld.vue";
    import Header from "@/components/Header";
    import ComicList from "@/components/ComicList";

    export default {
        name: "home",
        components: {
            Header,
            ComicList
        }
    };
</script>
