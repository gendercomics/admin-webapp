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
                    <b-button to="comics/new" variant="outline-primary"
                        >new comic</b-button
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
                    :items="comics"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :filterIncludedFields="filterOn"
                    @filtered="onFiltered"
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

                    <template v-slot:cell(title)="row">
                        <span>{{ titleDisplayText(row.item) }}</span>
                    </template>

                    <template v-slot:cell(creators)="data">
                        <div
                            v-for="creator in data.item.creators"
                            v-bind:key="creator.id"
                        >
                            <span>{{ fullName(creator.name) }}</span>
                        </div>
                    </template>

                    <template v-slot:cell(partOf)="row">
                        <span>{{ parentDisplayText(row.item) }}</span>
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
                </b-table>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { httpClient } from '../services/httpclient';
export default {
    name: 'ComicList',

    data() {
        return {
            fields: [
                { key: 'actions', label: 'actions' },
                { key: 'metaData.status', label: 'status' },
                { key: 'title', label: 'title' },
                { key: 'creators', label: 'creator(s)' },
                { key: 'partOf', label: 'in' },
                { key: 'metaData.changedOn', label: 'created/modified' },
                { key: 'metaData.changedBy', label: 'by' },
            ],
            comics: null,
            loading: true,
            errored: false,
            filter: null,
            filterOn: ['title', 'creators', 'partOf'],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 20, 50],
        };
    },
    mounted() {
        httpClient
            .get('/comics')
            .then(
                response => (
                    (this.comics = response.data),
                    (this.totalRows = this.comics.length)
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
            this.$router.push('/comics/' + item.id);
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        fullName(creator) {
            if (creator.name != null) {
                return creator.name;
            }
            return creator.firstName + ' ' + creator.lastName;
        },
        titleDisplayText(item) {
            return item.issue !== null
                ? item.title + ', ' + item.issue
                : item.title;
        },
        parentDisplayText(item) {
            if (item.partOf !== null && item.partOf.comic.title !== null) {
                return item.partOf.comic.issue !== null
                    ? item.partOf.comic.title + ', ' + item.partOf.comic.issue
                    : item.partOf.comic.title;
            }
            return null;
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
