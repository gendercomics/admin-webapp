<template>
    <div>
        <Header />

        <div>
            <div class="p-5 mb-4 bg-light rounded-3">
                <h1 class="display-5">GenderComics Admin</h1>
                <p class="lead">
                    Welcome. This is the starting place for editing content in
                    the GenderComics database.
                </p>

                <hr class="my-4" />

                <p>
                    {{ count.comics }} comics, {{ count.persons }} persons,
                    {{ count.publishers }} publishers, {{ count.roles }} roles
                    and {{ count.keywords }} keywords are stored in the
                    database.
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
                    <b-button variant="outline-primary" to="keywords"
                        >edit keywords</b-button
                    >
                </b-button-group>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";
import Header from '@/components/Header';
import { httpClient } from '../services/httpclient';

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
                keywords: 0,
            },
            loading: true,
            errored: false,
        };
    },
    mounted() {
        httpClient
            .get('/count')
            .then((response) => (this.count = response.data))
            .catch((error) => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
    },
};
</script>
