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
            <b-row>
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
                            <b-form-invalid-feedback
                                >Enter at least 4
                                characters</b-form-invalid-feedback
                            >
                        </b-input-group>

                        <!-- edition -->
                        <input-field
                            label="description"
                            v-model="keyword.description"
                            v-if="showDescription"
                            type="text"
                        />

                        <!-- status -->
                        <b-form-group>
                            <!-- action buttons -->
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
        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';

export default {
    name: 'KeywordForm',
    components: {
        SelectField,
        InputField,
        Header,
    },
    data() {
        return {
            keyword: {
                name: '',
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
        };
    },
    computed: {
        nameState() {
            return this.keyword.name.length >= 4;
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
                this.$api
                    .post('/keywords/', this.keyword)
                    .then(response => (this.comic = response.data))
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            } else {
                this.$api
                    .put('/keywords/' + this.keyword.id, this.keyword)
                    .then(response => (this.keyword = response.data))
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            }
            this.saveSuccessful = true;
        },
        addDescription() {
            this.keyword.description = '';
        },
    },
    mounted() {
        // get keyword record
        if (!this.$route.path.endsWith('new')) {
            this.$api
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
