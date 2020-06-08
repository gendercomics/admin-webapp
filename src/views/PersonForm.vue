<template>
    <div class="text-left">
        <Header />
        <b-container fluid class="mt-4 ml-4 mr-4">
            <b-row>
                <b-form
                    id="publisher-form"
                    v-if="show"
                    v-on:submit.prevent="onSubmit"
                >
                    <div>
                        <b-card
                            bg-variant="light"
                            header="add a new person"
                            style="min-width: 50rem"
                        >
                            <b-card-body>
                                <b-row>
                                    <b-col>
                                        <b-form-group
                                            label-cols-sm="2"
                                            label="firstname:"
                                            label-align-sm="right"
                                            label-for="firstname"
                                        >
                                            <b-form-input
                                                id="firstname"
                                                v-model="person.firstName"
                                                placeholder="enter firstname"
                                                trim
                                                style="max-width: 25rem"
                                            ></b-form-input>
                                        </b-form-group>

                                        <b-form-group
                                            label-cols-sm="2"
                                            label="lastname:"
                                            label-align-sm="right"
                                            label-for="lastname"
                                        >
                                            <b-form-input
                                                id="lastname"
                                                v-model="person.lastName"
                                                placeholder="enter lastname"
                                                trim
                                                style="max-width: 25rem"
                                            ></b-form-input>
                                        </b-form-group>

                                        <b-form-group
                                            label-cols-sm="2"
                                            label="pseudonym:"
                                            label-align-sm="right"
                                            label-for="pseudonym"
                                        >
                                            <b-form-input
                                                id="pseudonym"
                                                v-model="person.pseudonym"
                                                placeholder="enter pseudonym"
                                                trim
                                                style="max-width: 25rem"
                                            ></b-form-input>
                                        </b-form-group>

                                        <b-form-group
                                            label-cols-sm="2"
                                            label="wikidata-id:"
                                            label-align-sm="right"
                                            label-for="wikidata"
                                        >
                                            <b-form-input
                                                id="wikidata"
                                                type="text"
                                                v-model="person.wikiData"
                                                placeholder="enter wikidata id"
                                                trim
                                                style="max-width: 25rem"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                                <b-row class="mt-2">
                                    <b-col>
                                        <b-button-group class="float-right">
                                            <b-button
                                                type="submit"
                                                variant="primary"
                                                >save</b-button
                                            >
                                            <b-button
                                                to="/persons"
                                                type="reset"
                                                variant="outline-danger"
                                                >cancel</b-button
                                            >
                                        </b-button-group>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                    </div>
                </b-form>
            </b-row>

            <div v-if="debug">
                <b-row class="mt-4 mr-4">
                    <b-col id="json-person">
                        <b-card header="person">
                            <pre class="mt-0">{{ $data.person }}</pre>
                        </b-card>
                    </b-col>
                </b-row>
            </div>
        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';
import { httpClient } from '../services/httpclient';

export default {
    name: 'PersonForm',
    components: {
        Header,
    },
    data() {
        return {
            person: {
                firstName: null,
                lastName: null,
                pseudonym: null,
                wikiData: null,
            },
            show: true,
            errored: false,
            debug: false,
        };
    },
    mounted() {
        // get role
        if (!this.$route.path.endsWith('new')) {
            httpClient
                .get(this.$route.path)
                .then(response => {
                    this.person = response.data;
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                });
        }
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            if (this.$route.path.endsWith('new')) {
                httpClient
                    .post('/persons/', this.person)
                    .then(
                        response => (
                            (this.person = response.data),
                            this.$router.push('/persons')
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    });
            } else {
                httpClient
                    .put('/persons/' + this.person.id, this.person)
                    .then(
                        response => (
                            (this.person = response.data),
                            this.$router.push('/persons')
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    });
            }
        },
    },
};
</script>
