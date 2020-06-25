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
                <input-field
                    label="keyword"
                    v-model="keyword.name"
                    size="lg"
                    disabled
                />
            </div>

            <b-form @submit="onSubmit" v-if="show">
                <b-row class="m-2">
                    <!-- type -->
                    <select-field
                        label="type"
                        :options="typeOptions"
                        :selected="keyword.type"
                    />
                </b-row>

                <b-row class="m-2">
                    <b-card no-body class="mt-2" style="width: 100%">
                        <b-tabs>
                            <!-- german name and description -->
                            <b-tab title="de">
                                <keyword-form-details
                                    v-model="keyword.values.de"
                                />
                            </b-tab>
                            <!-- english name and description -->
                            <b-tab title="en">
                                <keyword-form-details
                                    v-model="keyword.values.en"
                                />
                            </b-tab>
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
import { httpClient } from '../services/httpclient';
import KeywordFormDetails from '../components/KeywordFormDetails';

export default {
    name: 'KeywordForm',
    components: {
        KeywordFormDetails,
        InputField,
        SelectField,
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
                values: {
                    de: {
                        name: null,
                        description: null,
                    },
                    en: {
                        name: null,
                        description: null,
                    },
                },
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
        backBtnVariant() {
            return 'outline-danger';
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
