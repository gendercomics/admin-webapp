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
                    <b-button to="persons/new" variant="outline-primary"
                        >new person</b-button
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
                    :items="persons"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :filterIncludedFields="filterOn"
                    @filtered="onFiltered"
                >
                    <template v-slot:cell(actions)="row">
                        <b-button
                            size="sm"
                            @click="edit(row.item)"
                            class="mr-1"
                        >
                            edit
                        </b-button>
                    </template>

                    <template v-slot:cell(name)="data">
                        <span>{{ fullName(data.item) }}</span>
                    </template>

                    <template v-slot:cell(wikiData)="data">
                        <b-link
                            target="_blank"
                            v-bind:href="wikiDataLink(data.item.wikiData)"
                        >
                            <span>{{ data.item.wikiData }}</span>
                        </b-link>
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
export default {
    name: 'PersonList',

    data() {
        return {
            fields: [
                { key: 'actions', label: 'actions' },
                { key: 'name', label: 'name/pseudonym' },
                { key: 'wikiData', label: 'wikidata' },
                { key: 'metaData.changedOn', label: 'created/modified' },
                { key: 'metaData.changedBy', label: 'by' },
            ],
            persons: null,
            loading: true,
            errored: false,
            filter: null,
            filterOn: ['firstName', 'lastName', 'pseudonym'],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 20, 50],
        };
    },
    mounted() {
        this.$api
            .get('/persons')
            .then(
                response => (
                    (this.persons = response.data),
                    (this.totalRows = this.persons.length)
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
            console.log('edit item: ' + item.id);
            this.$router.push('/persons/' + item.id);
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        fullName(person) {
            if (person.pseudonym !== null && person.pseudonym.length !== 0)
                return person.pseudonym;
            return person.firstName + ' ' + person.lastName;
        },
        wikiDataLink(wikidata) {
            return 'https://www.wikidata.org/wiki/' + wikidata;
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
