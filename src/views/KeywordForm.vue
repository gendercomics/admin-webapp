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

        <b-form @submit="onSubmit">
            <b-container class="mt-2" fluid>
                <b-row class="ml-0">
                    <div id="button-col" class="mt-2 mb-2">
                        <b-button-group vertical>
                            <!-- keyword -->
                            <b-button disabled>keyword</b-button>
                            <!-- keyword -->
                            <b-button disabled>type</b-button>
                            <!-- description -->
                            <b-button
                                :variant="descriptionBtnVariant"
                                @click="addDescription"
                                :disabled="this.showDescription"
                                >description</b-button
                            >
                            <b-button-group>
                                <b-button disabled :variant="relationBtnVariant"
                                    >relations
                                </b-button>
                                <b-button
                                    variant="outline-dark"
                                    @click="addRelation"
                                    >+
                                </b-button>
                            </b-button-group>

                            <!-- toggle JSON view -->
                            <b-button
                                variant="outline-dark"
                                :pressed.sync="showJson"
                                >JSON
                            </b-button>
                        </b-button-group>
                    </div>
                    <b-col id="form-col" class="mt-2 mr-2">
                        <div>
                            <b-input-group>
                                <input-field
                                    label="keyword"
                                    :value="displayNames"
                                    size="md"
                                    style="max-width: 71%"
                                    disabled
                                />
                                <!-- action buttons -->
                                <div class="ml-1 float-right">
                                    <!-- status -->
                                    <b-form-group class="m-0">
                                        <!-- action buttons -->
                                        <b-button-group>
                                            <!-- editing status -->
                                            <b-form-select
                                                :options="this.$statusOptions"
                                                v-model="
                                                    keyword.metaData.status
                                                "
                                            />
                                            <b-button
                                                type="submit"
                                                variant="primary"
                                                >save
                                            </b-button>
                                            <b-button
                                                to="/comics"
                                                type="reset"
                                                variant="outline-danger"
                                                >back
                                            </b-button>
                                        </b-button-group>
                                    </b-form-group>
                                </div>
                            </b-input-group>
                        </div>

                        <!-- keyword name -->
                        <b-row class="mt-2">
                            <b-col>
                                <!-- keyword [de] -->
                                <b-input-group
                                    prepend="keyword [de]"
                                    id="input-group-title"
                                    label-for="keyword-name-de"
                                    size="md"
                                >
                                    <b-form-input
                                        id="keyword-name-de"
                                        v-model="keyword.values.de.name"
                                        required
                                    />
                                    <b-form-invalid-feedback
                                        >Enter at least 1 character
                                    </b-form-invalid-feedback>
                                </b-input-group>
                            </b-col>

                            <b-col>
                                <!-- keyword [en] -->
                                <b-input-group
                                    prepend="keyword [en]"
                                    id="input-group-title"
                                    label-for="keyword-name-en"
                                    size="md"
                                >
                                    <b-form-input
                                        id="keyword-name-en"
                                        v-model="keyword.values.en.name"
                                        required
                                    />
                                    <b-form-invalid-feedback
                                        >Enter at least 1 character
                                    </b-form-invalid-feedback>
                                </b-input-group>
                            </b-col>
                        </b-row>

                        <!-- type -->
                        <div class="mt-2">
                            <select-field
                                label="type"
                                :options="typeOptions"
                                :selected="keyword.type"
                                v-model="keyword.type"
                            />
                        </div>

                        <!-- keyword description -->
                        <div v-show="this.showDescription">
                            <b-card no-body class="mt-2" style="width: 100%">
                                <b-tabs>
                                    <!-- german description -->
                                    <b-tab title="description [de]">
                                        <editor
                                            v-model="
                                                keyword.values.de.description
                                            "
                                        />
                                    </b-tab>
                                    <!-- english description -->
                                    <b-tab title="description [en]">
                                        <editor
                                            v-model="
                                                keyword.values.en.description
                                            "
                                        />
                                    </b-tab>
                                </b-tabs>
                            </b-card>
                        </div>

                        <div
                            v-for="(relation, idx) in keyword.relations"
                            v-bind:key="'relation-' + idx"
                        >
                            <relation
                                :label="labelForRelation"
                                v-model="keyword.relations[idx]"
                                removable
                                @remove="removeRelation(idx)"
                            />
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </b-form>

        <b-container fluid class="mt-4 ml-4 mr-4">
            <div v-if="showJson">
                <b-row class="mt-4 mr-4">
                    <b-col id="json-editor">
                        <b-card header="keyword">
                            <pre class="mt-0">{{ this.keyword }}</pre>
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
import SelectField from '../components/SelectField';
import { httpClient } from '../services/httpclient';
import Editor from '@/components/Editor';
import Relation from '@/components/Relation';
import { getters, mutations } from '@/services/store';

export default {
    name: 'KeywordForm',
    components: {
        Relation,
        Editor,
        InputField,
        SelectField,
        Header,
    },
    data() {
        return {
            keyword: {
                type: 'content',
                metaData: {
                    createdOn: null,
                    createdBy: null,
                    changedOn: null,
                    changedBy: null,
                    status: 'DRAFT',
                },
                values: {
                    de: {
                        name: '',
                        description: null,
                        language: 'de',
                    },
                    en: {
                        name: '',
                        description: null,
                        language: 'en',
                    },
                },
                relations: [],
            },
            show: true,
            loading: true,
            errored: false,
            saveSuccessful: false,
            statusOptions: ['DRAFT', 'REVIEW', 'FINAL'],
            typeOptions: ['content', 'genre'],
            showJson: false,
        };
    },
    computed: {
        descriptionBtnVariant() {
            if (!this.showDescription) return 'outline-dark';
            return 'dark';
        },
        showDescription() {
            return (
                this.keyword.values.de.description != null ||
                this.keyword.values.en.description != null
            );
        },
        backBtnVariant() {
            return 'outline-danger';
        },
        displayNames() {
            let names = '';
            if (this.keyword.values.de.name.length > 0) {
                names += this.keyword.values.de.name;
            }
            if (names.length > 0 && this.keyword.values.en.name.length > 0) {
                names += ' :: ';
            }
            if (this.keyword.values.en.name.length > 0) {
                names += this.keyword.values.en.name;
            }
            return names;
        },
        relationBtnVariant() {
            return this.relationsExist ? 'dark' : 'outline-dark';
        },
        relationsExist() {
            return (
                this.keyword.relations != null &&
                this.keyword.relations.length > 0
            );
        },
        language: {
            get() {
                return getters.language();
            },
            set(val) {
                mutations.setLanguage(val);
            },
        },
        labelForRelation() {
            return this.keyword.values[this.language].name;
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
            this.keyword.values.de.description = '';
            this.keyword.values.en.description = '';
        },
        addRelation() {
            this.$log.debug('add relation');
            if (this.keyword.relations === null) {
                this.keyword.relations = [];
            }
            this.keyword.relations.push({ predicate: null, keyword: null });
        },
        removeRelation(idx) {
            this.$log.debug('removeRelation(idx)=' + idx);
            this.keyword.relations.splice(idx, 1);
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
