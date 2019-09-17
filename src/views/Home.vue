<template>
    <div class="home">
        <!--img alt="Vue logo" src="../assets/logo.png"/-->
        <!--HelloWorld msg="Welcome to Your Vue.js App"/-->
        <comic-list/>
    </div>
</template>

<script>
    // @ is an alias to /src
    //import HelloWorld from "@/components/HelloWorld.vue";

    import ComicList from "@/components/ComicList";

    export default {
        name: "home",
        components: {
            //HelloWorld
            ComicList
        }
    };
</script>
