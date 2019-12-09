<template>
    <div>
        <b-container fluid>
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
                                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <b-col lg="6" class="my-1">
                    <b-button to="comic/new" variant="outline-primary">new comic</b-button>
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


        <b-table
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
                <b-button size="sm" @click="edit(row.item, $event.target)" class="mr-1">
                    edit
                </b-button>
            </template>

        </b-table>
    </div>
</template>

<script>
    export default {
        name: "ComicList",
        data() {
            return {
                fields: [
                    {key: 'actions', label: 'Actions'},
                    {key: 'title'}
                ],
                comics: null,
                loading: true,
                errored: false,
                filter: null,
                filterOn: ['title'],
                totalRows: 1,
                currentPage: 1,
                perPage: 10,
                pageOptions: [10, 20, 50]
            };
        },
        mounted() {
            this.$api
                .get("/comics")
                .then(response => (this.comics = response.data, this.totalRows = this.comics.length))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        methods: {
            edit(item, button) {
                console.log('edit item: ' + item.id);
                this.$router.push("/comics/" + item.id);
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            }
        }
    };
</script>

<style lang="scss">
    @import "../styles/styles.scss";
</style>
