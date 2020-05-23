<template>
    <div>
        <Header />

        <div>
            <b-jumbotron header-level="5">
                <template v-slot:header>GenderComics Admin</template>

                <template v-slot:lead>
                    Welcome. This is the starting place for editing content in
                    the GenderComics database.
                </template>

                <hr class="my-4" />

                <p>
                    {{ count.comics }} comics, {{ count.persons }} persons,
                    {{ count.publishers }} publishers and
                    {{ count.roles }} roles are stored in the database.
                </p>

                <b-button-group>
                    <b-button variant="outline-primary" to="comics"
                        >edit comics</b-button
                    >
                    <b-button variant="outline-primary" to="persons"
                        >edit persons</b-button
                    >
                    <b-button variant="outline-primary" to="publishers"
                        >edit publishers</b-button
                    >
                    <b-button variant="outline-primary" to="roles"
                        >edit roles</b-button
                    >
                </b-button-group>
            </b-jumbotron>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";
import Header from '@/components/Header';

export default {
    name: 'home',
    components: {
        Header,
    },
    data() {
        return {
            count: {
                comics: 0,
                persons: 0,
                publishers: 0,
                roles: 0,
            },
            loading: true,
            errored: false,
        };
    },
    mounted() {
        this.$api
            .get('/count')
            .then(response => (this.count = response.data))
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
    },
};
</script>
