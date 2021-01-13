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
                <!-- role name as summary on top -->
                <div class="m-2">
                    <input-field
                        label="role"
                        :value="role.name"
                        size="lg"
                        disabled
                    />
                </div>

                <b-row class="ml-2">
                    <div id="button-col" class="mt-2 mb-2">
                        <b-button-group vertical>
                            <b-button disabled>role</b-button>
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
                            label="role"
                            v-model="role.name"
                            type="text"
                            class="m-2"
                        />

                        <!-- description -->
                        <input-field
                            label="description"
                            v-model="role.description"
                            class="m-2"
                            v-if="showDescription"
                            type="text"
                            removable
                        />

                        <!-- action buttons -->
                        <b-form-group>
                            <b-button-group class="mt-3 float-right">
                                <!-- editing status -->
                                <b-form-select
                                    :options="statusOptions"
                                    v-model="role.metaData.status"
                                />

                                <b-button type="submit" variant="primary"
                                    >save</b-button
                                >
                                <b-button
                                    to="/roles"
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
    </div>
</template>

<script>
import Header from '@/components/Header';
import { httpClient } from '../services/httpclient';
import InputField from '@/components/InputField';

export default {
    name: 'RolesForm',
    components: {
        Header,
        InputField,
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
    },
};
</script>

<style scoped></style>
