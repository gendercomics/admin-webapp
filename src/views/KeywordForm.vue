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

        <b-container class="mt-3" fluid>

            <b-tabs>
                <b-tab title="en">
                    <b-row class="mt-2">
                        <b-col id="button-col" cols="1">
                            <b-button-group vertical>
                                <b-button disabled>keyword</b-button>

                                <b-button
                                        :variant="descriptionBtnVariant"
                                        @click="addDescription"
                                        :disabled="this.showDescription"
                                >description</b-button
                                >
                            </b-button-group>
                        </b-col>

                        <b-col id="form-col">
                            <b-form @submit="onSubmit" v-if="show">
                                <!-- name -->
                                <b-input-group
                                        prepend="name"
                                        id="input-group-name"
                                        label-for="input-name"
                                        size="lg"
                                >
                                    <b-form-input
                                            id="input-name"
                                            v-model="keyword.name"
                                            required
                                            placeholder="Enter keyword"
                                            :state="nameState"
                                    />

                                    <b-input-group-append>
                                        <b-form-select
                                                :options="typeOptions"
                                                size="lg"
                                                v-model="keyword.type"
                                        ></b-form-select>
                                    </b-input-group-append>

                                    <b-form-invalid-feedback
                                    >Enter at least 1
                                        characters</b-form-invalid-feedback
                                    >
                                </b-input-group>

                                <!-- description -->
                                <input-field
                                        label="description"
                                        v-model="keyword.description"
                                        v-if="showDescription"
                                        type="text"
                                />

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
                            </b-form>
                        </b-col>
                    </b-row>


                </b-tab>
                <b-tab title="de">deutscher tab</b-tab>
            </b-tabs>




        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';
import InputField from '../components/InputField';
import { httpClient } from '../services/httpclient';

export default {
    name: 'KeywordForm',
    components: {
        InputField,
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
