<template>
    <div class="text-left">
        <Header />

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="success" dismissible v-model="saveSuccessful"
                >keyword saved!</b-alert
            >
        </div>

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="danger" dismissible v-model="errored"
                >error!</b-alert
            >
        </div>

        <b-container class="mt-2" fluid>

            <div class="m-2">
                <input-field label="keyword"
                             v-model="keyword.name"
                             size="lg"
                             disabled
                            />
            </div>

            <b-form @submit="onSubmit" v-if="show">
                <b-row class="m-2">
                    <!-- type -->
                    <select-field label="type" :options="typeOptions" />
                </b-row>

                <b-row class="m-2">

                    <b-card no-body class="mt-2" style="width: 100%">
                        <b-tabs>
                            <b-tab title="de">


                                <keyword-form-details v-model="keyword.values.de" />


                                <b-row class="ml-2">
                                    <div id="button-col" class="mt-2 mb-2">
                                        <b-button-group vertical>
                                            <b-button disabled>keyword</b-button>
                                            <b-button
                                                    :variant="descriptionBtnVariant"
                                                    @click="addDescription"
                                                    :disabled="this.showDescription"
                                            >description</b-button
                                            >
                                        </b-button-group>
                                    </div>

                                    <b-col id="form-col" class="pl-0 mr-3">

                                        <!-- name -->
                                        <input-field
                                                label="name"
                                                v-model="keyword.name"
                                                class="m-2"
                                        />

                                        <!-- description -->
                                        <input-text-area
                                                class="m-2"
                                                label="description"
                                                v-model="keyword.description"
                                                v-if="showDescription"
                                                removable
                                        />

                                    </b-col>

                                </b-row>

                            </b-tab>
                            <b-tab title="en" />
                        </b-tabs>
                    </b-card>

                </b-row>

                <b-row class="ml-2">

                <!-- action buttons -->
                <b-form-group>
                    <b-button-group class="mt-3 float-right">
                        <!-- editing status -->
                        <b-form-select
                                :options="statusOptions"
                                v-model="keyword.metaData.status"
                        />

                        <b-button type="submit" variant="primary"
                        >save</b-button
                        >
                        <b-button
                                to="/keywords"
                                type="reset"
                                :variant="backBtnVariant"
                        >back</b-button
                        >
                    </b-button-group>
                </b-form-group>
                </b-row>

            </b-form>
        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import InputTextArea from "../components/InputTextArea";
import { httpClient } from '../services/httpclient';
import KeywordFormDetails from "../components/KeywordFormDetails";

export default {
    name: 'KeywordForm',
    components: {
        KeywordFormDetails,
        InputField,
        SelectField,
        InputTextArea,
        Header,
    },
    data() {
        return {
            keyword: {
                name: '',
                type: 'content',
                description: null,
                metaData: {
                    createdOn: null,
                    createdBy: null,
                    changedOn: null,
                    changedBy: null,
                    status: 'DRAFT',
                },
                values: [
                    {
                    de: {
                        name: null,
                        description: null,
                    }
                }],
            },
            show: true,
            loading: true,
            errored: false,
            saveSuccessful: false,
            statusOptions: ['DRAFT', 'REVIEW', 'FINAL'],
            typeOptions: ['content', 'genre'],
        };
    },
    computed: {
        nameState() {
            if (this.keyword.name.length < 1) {
                return false;
            }
            return null;
        },
        descriptionBtnVariant() {
            if (!this.showDescription) return 'outline-dark';
            return 'dark';
        },
        backBtnVariant() {
            return 'outline-danger';
        },
        showDescription() {
            return this.keyword.description != null;
        },
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            //alert(JSON.stringify(this.comic));
            if (this.$route.path.endsWith('new')) {
                httpClient
                    .post('/keywords/', this.keyword)
                    .then(
                        response => (
                            (this.comic = response.data),
                            (this.saveSuccessful = true)
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            } else {
                httpClient
                    .put('/keywords/' + this.keyword.id, this.keyword)
                    .then(
                        response => (this.keyword = response.data),
                        (this.saveSuccessful = true)
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            }
        },
        addDescription() {
            this.keyword.description = '';
        },
    },
    mounted() {
        // get keyword record
        if (!this.$route.path.endsWith('new')) {
            httpClient
                .get(this.$route.path)
                .then(response => {
                    this.keyword = response.data;
                    if (this.keyword.metaData.status === null) {
                        this.keyword.metaData.status = 'DRAFT';
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        }
    },
};
</script>
