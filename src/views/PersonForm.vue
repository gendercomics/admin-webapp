<template>
    <div class="text-left">
        <Header />

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="success" dismissible v-model="saveSuccessful"
                >keyword saved!
            </b-alert>
        </div>

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="danger" dismissible v-model="errored"
                >error!
            </b-alert>
        </div>

        <b-form @submit="onSubmit" v-if="show">
            <b-container class="mt-2" fluid>
                <!-- person name as summary on top -->
                <div class="m-2">
                    <input-field
                        label="person"
                        :value="personNames"
                        size="lg"
                        disabled
                    />
                </div>

                <b-row class="ml-2">
                    <div id="button-col" class="mt-2 mb-2">
                        <b-button-group vertical>
                            <b-button variant="outline-dark" @click="addName"
                                >name+</b-button
                            >
                            <b-button
                                :variant="wikiDataBtnVariant"
                                @click="addWikiData"
                                :disabled="this.showWikiData"
                                >wikidata-id</b-button
                            >
                        </b-button-group>
                    </div>

                    <b-col id="form-col" class="pl-0 mr-3">
                        <!-- names -->
                        <div
                            v-for="(name, idx) in person.names"
                            v-bind:key="idx"
                        >
                            <name-field
                                class="m-2"
                                removable
                                v-model="person.names[idx]"
                                @delete="removeName(idx)"
                            />
                        </div>

                        <!-- wikidata-id -->
                        <input-field
                            label="wikidata-id"
                            v-model="person.wikiData"
                            class="m-2"
                            v-if="showWikiData"
                            :link="wikiDataLink"
                            removable
                        />
                    </b-col>
                </b-row>

                <b-row class="ml-2">
                    <!-- action buttons -->
                    <b-form-group>
                        <b-button-group class="mt-3 float-right">
                            <!-- editing status -->
                            <b-form-select
                                :options="statusOptions"
                                v-model="person.metaData.status"
                            />

                            <b-button type="submit" variant="primary"
                                >save</b-button
                            >
                            <b-button
                                to="/persons"
                                type="reset"
                                variant="outline-danger"
                                >back</b-button
                            >
                        </b-button-group>
                    </b-form-group>
                </b-row>
            </b-container>
        </b-form>

        <b-container fluid class="mt-4 ml-4 mr-4">
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
import InputField from '../components/InputField';
import { httpClient } from '../services/httpclient';
import NameField from '../components/NameField';

export default {
    name: 'PersonForm',
    components: {
        Header,
        InputField,
        NameField,
    },
    data() {
        return {
            person: {
                names: null,
                firstName: null,
                lastName: null,
                pseudonym: null,
                wikiData: null,
                metaData: {
                    createdOn: null,
                    createdBy: null,
                    changedOn: null,
                    changedBy: null,
                    status: 'DRAFT',
                },
            },
            show: true,
            errored: false,
            saveSuccessful: false,
            debug: true,
            statusOptions: ['DRAFT', 'REVIEW', 'FINAL'],
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
    computed: {
        personNames() {
            let personName = '';
            if (this.person.names !== null) {
                this.person.names.forEach(function(item) {
                    personName.length > 0
                        ? (personName += ', ')
                        : (personName += '');
                    item.name !== null
                        ? (personName += item.name)
                        : (personName += '');
                    item.firstName !== null
                        ? (personName += item.firstName)
                        : (personName += '');
                    personName.length > 0
                        ? (personName += ' ')
                        : (personName += '');
                    item.lastName !== null
                        ? (personName += item.lastName)
                        : (personName += '');
                });
            }
            return personName;
        },
        wikiDataBtnVariant() {
            if (!this.showWikiData) return 'outline-dark';
            return 'dark';
        },
        showWikiData() {
            return this.person.wikiData != null;
        },
        wikiDataLink() {
            return 'https://wikidata.org/wiki/' + this.person.wikiData;
        },
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
        addName() {
            console.log('add name');
            if (this.person.names === null) {
                this.person.names = [];
            }
            this.person.names.push({
                name: null,
                firstName: null,
                lastName: null,
                pseudonym: false,
                searchable: true,
            });
        },
        addWikiData() {
            this.person.wikiData = '';
        },
        removeName(idx) {
            this.person.names.splice(idx, 1);
        },
    },
};
</script>
