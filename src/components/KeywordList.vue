<template>
    <div>
        <b-container fluid class="mt-4">
            <b-row>
                <b-col lg="6" class="my-1">
                    <b-form-group
                        label="Filter"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="filterInput"
                        class="mb-0"
                    >
                        <b-input-group size="sm">
                            <b-form-input
                                v-model="filter"
                                type="search"
                                id="filterInput"
                                placeholder="Type to Search"
                            ></b-form-input>
                            <b-input-group-append>
                                <b-button
                                    :disabled="!filter"
                                    @click="filter = ''"
                                    >Clear
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <b-col lg="6" class="my-1">
                    <b-button to="keywords/new" variant="outline-primary"
                        >new keyword</b-button
                    >
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="5" md="6" class="my-1">
                    <b-form-group
                        label="Per page"
                        label-cols-sm="6"
                        label-cols-md="4"
                        label-cols-lg="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="perPageSelect"
                        class="mb-0"
                    >
                        <b-form-select
                            v-model="perPage"
                            id="perPageSelect"
                            size="sm"
                            :options="pageOptions"
                        ></b-form-select>
                    </b-form-group>
                </b-col>

                <b-col sm="7" md="6" class="my-1">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"
                    ></b-pagination>
                </b-col>
            </b-row>
        </b-container>

        <b-container fluid class="mt-4 pl-4 pr-4">
            <b-row>
                <b-table
                    class="mt-4"
                    show-empty
                    small
                    striped
                    hover
                    head-variant="dark"
                    bordered
                    :fields="fields"
                    :items="keywords"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :filterIncludedFields="filterOn"
                    @filtered="onFiltered"
                    :busy="loading"
                >
                    <template v-slot:cell(actions)="row">
                        <b-button
                            variant="light"
                            size="sm"
                            @click="edit(row.item)"
                            class="mr-1"
                        >
                            <font-awesome-icon
                                icon="edit"
                                v-b-tooltip
                                title="edit"
                            />
                        </b-button>

                        <!-- delete button -->
                        <b-button
                            v-show="row.item.metaData.status === 'DRAFT'"
                            variant="light"
                            size="sm"
                            class="mr-1"
                            @click="deleteKeyword(row.item)"
                        >
                            <font-awesome-icon
                                icon="trash-alt"
                                v-b-tooltip
                                title="delete"
                            />
                        </b-button>
                    </template>

                    <template v-slot:cell(metaData.status)="row">
                        <span v-if="row.item.metaData.status === 'DRAFT'"
                            ><b-badge variant="secondary">draft</b-badge></span
                        >
                        <span v-if="row.item.metaData.status === 'REVIEW'"
                            ><b-badge variant="warning">review</b-badge></span
                        >
                        <span v-if="row.item.metaData.status === 'FINAL'"
                            ><b-badge variant="success">final</b-badge></span
                        >
                    </template>

                    <template v-slot:cell(metaData.changedOn)="data">
                        <span
                            v-if="
                                moment(data.item.metaData.changedOn).isValid()
                            "
                            >{{
                                moment(data.item.metaData.changedOn).format(
                                    'DD.MM.YYYY HH:mm'
                                )
                            }}</span
                        >
                        <span v-else>{{
                            moment(data.item.metaData.createdOn).format(
                                'DD.MM.YYYY HH:mm'
                            )
                        }}</span>
                    </template>

                    <template v-slot:cell(metaData.changedBy)="data">
                        <span v-if="data.item.metaData.changedBy == null">{{
                            data.item.metaData.createdBy
                        }}</span>
                        <span v-else>{{ data.item.metaData.changedBy }}</span>
                    </template>

                    <!-- busy spinner -->
                    <template #table-busy>
                        <div class="text-center text-black-50 my-2">
                            <b-spinner class="align-middle" />
                            <strong>loading...</strong>
                        </div>
                    </template>
                </b-table>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { httpClient } from '../services/httpclient';

export default {
    name: 'KeywordList',

    data() {
        return {
            fields: [
                { key: 'actions', label: 'actions' },
                { key: 'metaData.status', label: 'status' },
                { key: 'values.de.name', label: 'keyword [de]' },
                { key: 'values.en.name', label: 'keyword [en]' },
                { key: 'type', label: 'type' },
                { key: 'metaData.changedOn', label: 'created/modified' },
                { key: 'metaData.changedBy', label: 'by' },
            ],
            keywords: null,
            loading: true,
            errored: false,
            filter: null,
            filterOn: ['values'],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 20, 50],
        };
    },
    mounted() {
        httpClient
            .get('/keywords')
            .then(
                response => (
                    (this.keywords = response.data),
                    (this.totalRows = this.keywords.length)
                )
            )
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
    },
    methods: {
        edit(item) {
            this.$router.push('/keywords/' + item.id);
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        deleteKeyword(item) {
            console.log('delete item: ' + item.id);
            // TODO display warning modal?
            httpClient
                .delete('/keywords/' + item.id, item)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
            this.keywords.splice(this.keywords.indexOf(item), 1);
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
