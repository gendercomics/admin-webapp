<template>
    <div class="text-left">
        <Header />

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="success" dismissible v-model="saveSuccessful"
                >publisher saved!
            </b-alert>
        </div>

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="danger" dismissible v-model="errored"
                >error!
            </b-alert>
        </div>

        <b-form @submit="onSubmit" v-if="show">
            <b-container class="mt-2" fluid>
                <!-- publisher name as summary on top -->
                <div class="m-2">
                    <input-field
                        label="publisher"
                        :value="publisher.name"
                        size="lg"
                        disabled
                    />
                </div>

                <b-row class="ml-2">
                    <div id="button-col" class="mt-2 mb-2">
                        <b-button-group vertical>
                            <b-button disabled>publisher</b-button>
                            <b-button
                                :variant="locationBtnVariant"
                                @click="addLocation"
                                :disabled="this.showLocation"
                                >location</b-button
                            >
                            <b-button
                                :variant="urlBtnVariant"
                                @click="addUrl"
                                :disabled="this.showUrl"
                                >url</b-button
                            >
                        </b-button-group>
                    </div>

                    <b-col id="form-col" class="pl-0 mr-3">
                        <!-- name -->
                        <input-field
                            label="name"
                            v-model="publisher.name"
                            type="text"
                            class="m-2"
                        />

                        <!-- location -->
                        <input-field
                            label="location"
                            v-model="publisher.location"
                            class="m-2"
                            v-if="showLocation"
                            type="text"
                            removable
                        />

                        <!-- url -->
                        <input-field
                            label="url"
                            v-model="publisher.url"
                            class="m-2"
                            v-if="showUrl"
                            type="url"
                            :link="publisher.url"
                            removable
                        />

                        <!-- action buttons -->
                        <b-form-group>
                            <b-button-group class="mt-3 float-right">
                                <!-- editing status -->
                                <b-form-select
                                    :options="statusOptions"
                                    v-model="publisher.metaData.status"
                                />

                                <b-button type="submit" variant="primary"
                                    >save</b-button
                                >
                                <b-button
                                    to="/publishers"
                                    type="reset"
                                    variant="outline-danger"
                                    >back</b-button
                                >
                            </b-button-group>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
        </b-form>

        <!--
        <b-container fluid class="mt-4 ml-4 mr-4">
            <div v-if="showJson">
                <b-row class="mt-4 mr-4">
                    <b-col id="json-person">
                        <b-card header="person">
                            <pre class="mt-0">{{ $data.publisher }}</pre>
                        </b-card>
                    </b-col>
                </b-row>
            </div>
        </b-container>
        -->
    </div>
</template>

<script>
import Header from '@/components/Header';
import { httpClient } from '../services/httpclient';
import InputField from '../components/InputField';

export default {
    name: 'PublisherForm',
    components: {
        Header,
        InputField,
    },
    data() {
        return {
            publisher: {
                name: null,
                location: null,
                url: null,
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
            debug: false,
            saveSuccessful: false,
            statusOptions: ['DRAFT', 'REVIEW', 'FINAL'],
        };
    },
    mounted() {
        // get role
        if (!this.$route.path.endsWith('new')) {
            httpClient
                .get(this.$route.path)
                .then(response => {
                    this.publisher = response.data;
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                });
        }
    },
    computed: {
        urlBtnVariant() {
            if (!this.showUrl) return 'outline-dark';
            return 'dark';
        },
        showUrl() {
            return this.publisher.url != null;
        },
        locationBtnVariant() {
            if (!this.showLocation) return 'outline-dark';
            return 'dark';
        },
        showLocation() {
            return this.publisher.location != null;
        },
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            if (this.$route.path.endsWith('new')) {
                httpClient
                    .post('/publishers/', this.publisher)
                    .then(
                        response => (
                            (this.publisher = response.data),
                            this.$router.push('/publishers')
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    });
            } else {
                httpClient
                    .put('/publishers/' + this.publisher.id, this.publisher)
                    .then(
                        response => (
                            (this.publisher = response.data),
                            this.$router.push('/publishers')
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    });
            }
        },
        addLocation() {
            this.publisher.location = '';
        },
        addUrl() {
            this.publisher.url = '';
        },
    },
};
</script>
