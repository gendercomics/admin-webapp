<template>
    <div>
        <Header/>

        <div>
            <b-jumbotron header-level="5">
                <template v-slot:header>GenderComics Admin</template>

                <template v-slot:lead>
                    Welcome. This is the starting place for editing content in the GenderComics database.
                </template>

                <hr class="my-4">

                <p>
                    There are currently {{ comicCount }} comics in the database.
                </p>

                <b-button variant="primary" to="comics">edit comics</b-button>
                <b-button variant="success" href="#">Do Something Else</b-button>
            </b-jumbotron>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    //import HelloWorld from "@/components/HelloWorld.vue";
    import Header from "@/components/Header";

    export default {
        name: "home",
        components: {
            Header
        },
        data() {
            return {
                comicCount: "?",
                loading: true,
                errored: false
            };
        },
        mounted() {
            this.$api
                .get("http://localhost:8001/comics/count")
                .then(response => (this.comicCount = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        }
    };
</script>
