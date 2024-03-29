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
                    <b-button to="roles/new" variant="outline-primary"
                        >new role</b-button
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

        <b-container fluid class="pl-4 pr-4">
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
                    :items="roles"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :filterIncludedFields="filterOn"
                    @filtered="onFiltered"
                    :busy="loading"
                >
                    <!-- state -->
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

                    <!-- name -->
                    <template v-slot:cell(name)="row">
                        <b-link :to="'/roles/' + row.item.id">{{
                            row.item.name
                        }}</b-link>
                    </template>

                    <!-- description -->
                    <template v-slot:cell(description)="row">
                        <span v-html="row.item.description" />
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

                    <template v-slot:cell(actions)="row">
                        <!-- delete button -->
                        <b-button
                            v-show="row.item.metaData.status === 'DRAFT'"
                            variant="light"
                            size="sm"
                            class="mr-1"
                            @click="showDeleteModal(row.item)"
                        >
                            <font-awesome-icon
                                icon="trash-alt"
                                v-b-tooltip
                                title="delete"
                            />
                        </b-button>
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
    name: 'RolesList',
    data() {
        return {
            fields: [
                { key: 'metaData.status', label: 'status' },
                { key: 'name', label: 'name' },
                //  { key: 'description', label: 'description' },
                { key: 'metaData.changedOn', label: 'created/modified' },
                { key: 'metaData.changedBy', label: 'by' },
                { key: 'actions', label: 'actions' },
            ],
            roles: null,
            loading: true,
            errored: false,
            filter: null,
            filterOn: [],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 20, 50],
        };
    },
    mounted() {
        httpClient
            .get('/roles')
            .then(response => (this.roles = response.data))
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
    },
    methods: {
        edit(item) {
            console.log('edit item: ' + item.id);
            this.$router.push('/roles/' + item.id);
        },
        deleteRole(item) {
            console.log('delete role: ' + item.name);
            httpClient
                .delete('/roles/' + item.id, item)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
            this.roles.splice(this.roles.indexOf(item), 1);
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        showDeleteModal(item) {
            this.$bvModal.msgBoxConfirm('sure???').then(confirmed => {
                this.$log.debug('delete id:' + item.id + ': ' + confirmed);
                if (confirmed) {
                    this.deleteRole(item);
                }
            });
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
