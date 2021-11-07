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
                <b-row class="ml-0">
                    <div id="button-col" class="mt-2 mb-2">
                        <b-button-group vertical>
                            <b-button disabled>role</b-button>
                            <b-button
                                :variant="descriptionBtnVariant"
                                @click="addDescription"
                                :disabled="this.showDescription"
                                >description</b-button
                            >
                            <!-- toggle JSON view -->
                            <b-button
                                variant="outline-dark"
                                :pressed.sync="showJson"
                                >JSON
                            </b-button>
                        </b-button-group>
                    </div>

                    <b-col id="form-col" class="mt-2">
                        <b-input-group>
                            <!-- name -->
                            <input-field
                                label="role"
                                v-model="role.name"
                                type="text"
                                style="max-width: 70%"
                            />

                            <div class="ml-2 float-right">
                                <!-- status -->
                                <b-form-group class="m-0">
                                    <!-- action buttons -->
                                    <b-button-group>
                                        <!-- editing status -->
                                        <b-form-select
                                            :options="this.$statusOptions"
                                            v-model="role.metaData.status"
                                        />

                                        <b-button
                                            type="submit"
                                            variant="primary"
                                            >save
                                        </b-button>
                                        <b-button
                                            to="/roles"
                                            type="reset"
                                            variant="outline-danger"
                                            >back
                                        </b-button>
                                    </b-button-group>
                                </b-form-group>
                            </div>
                        </b-input-group>

                        <!-- description -->
                        <div class="mt-2">
                            <text-editor-field
                                v-if="showDescription"
                                v-model="role.description"
                                header-text="description"
                                removable
                            />
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </b-form>

        <b-container fluid class="mt-4 ml-4 mr-4">
            <b-row class="mt-4 mr-4" v-if="showJson">
                <b-col id="json-role">
                    <b-card header="role">
                        <pre class="mt-0">{{ $data.role }}</pre>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';
import { httpClient } from '../services/httpclient';
import InputField from '@/components/InputField';
import TextEditorField from '@/components/TextEditorField';

export default {
    name: 'RolesForm',
    components: {
        Header,
        InputField,
        TextEditorField,
    },
    data() {
        return {
            role: {
                name: null,
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
            errored: false,
            debug: false,
            saveSuccessful: false,
            statusOptions: ['DRAFT', 'REVIEW', 'FINAL'],
            showJson: false,
        };
    },
    mounted() {
        // get role
        if (!this.$route.path.endsWith('new')) {
            httpClient
                .get(this.$route.path)
                .then(response => {
                    this.role = response.data;
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                });
        }
    },
    computed: {
        descriptionBtnVariant() {
            if (!this.showDescription) return 'outline-dark';
            return 'dark';
        },
        showDescription() {
            return this.role.description != null;
        },
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            if (this.$route.path.endsWith('new')) {
                httpClient
                    .post('/roles/', this.role)
                    .then(
                        response => (
                            (this.role = response.data),
                            this.$router.push('/roles')
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    });
            } else {
                httpClient
                    .put('/roles/' + this.role.id, this.role)
                    .then(
                        response => (
                            (this.role = response.data),
                            this.$router.push('/roles')
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    });
            }
        },
        addDescription() {
            this.role.description = '';
        },
        removeDescription() {
            this.$log.debug('removeDescription');
            this.role.description = null;
        },
    },
};
</script>

<style scoped></style>
