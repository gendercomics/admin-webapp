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
                                placeholder="Type to Filter"
                            ></b-form-input>
                            <template #append>
                                <b-button
                                    :disabled="!filter"
                                    @click="filter = ''"
                                    >Clear
                                </b-button>
                            </template>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-input-group size="sm" prepend="new:" class="my-1">
                        <b-input
                            placeholder="de"
                            v-model="newPredicate.de"
                        ></b-input>
                        <b-input
                            placeholder="en"
                            v-model="newPredicate.en"
                        ></b-input>
                        <b-button
                            variant="primary"
                            size="sm"
                            :disabled="addBtnDisabled"
                            @click="addPredicate"
                            >add</b-button
                        >
                    </b-input-group>
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

        <b-container fluid class="mt-4 ps-4 pe-4">
            <b-row>
                <b-table
                    class="mt-4"
                    show-empty
                    small
                    striped
                    hover
                    head-variant="dark"
                    bordered
                    :items="filteredPredicates"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :busy="loading"
                >
                    <template v-slot:cell(metaData.status)="data">
                        <b-form-select
                            v-model="data.item.metaData.status"
                            :options="$statusOptions"
                            size="sm"
                            @input="inputHandler(data.index, data.item.id)"
                        />
                    </template>

                    <template v-slot:cell(values.de)="data">
                        <b-form-input
                            v-model="data.item.values.de"
                            :disabled="data.item.metaData.status === 'FINAL'"
                            size="sm"
                            @input="
                                inputHandlerDebounce(data.index, data.item.id)
                            "
                        />
                    </template>

                    <template v-slot:cell(values.en)="data">
                        <b-form-input
                            v-model="data.item.values.en"
                            :disabled="data.item.metaData.status === 'FINAL'"
                            size="sm"
                            @input="
                                inputHandlerDebounce(data.index, data.item.id)
                            "
                        />
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

                    <!-- action buttons -->
                    <template v-slot:cell(actions)="row">
                        <!-- delete button -->
                        <b-button
                            v-show="row.item.metaData.status === 'DRAFT'"
                            variant="light"
                            size="sm"
                            class="me-1"
                            @click="promptDelete(row.item)"
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

        <!--
        <b-container fluid class="mt-4 ms-4 me-4">
            <b-row class="mt-4 me-4" v-if="true">
                <b-col id="json-predicates">
                    <b-card header="predicates">
                        <pre class="mt-0">{{ $data.predicates }}</pre>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
        -->

        <b-modal v-model="showDeleteModal" title="Confirm" @ok="confirmDelete">
            Are you sure you want to delete this item?
        </b-modal>
    </div>
</template>

<script>
import PredicateService from '@/mixins/predicateservice';
import _ from 'lodash';

export default {
    name: 'PredicateList',
    mixins: [PredicateService],
    data() {
        return {
            fields: [
                { key: 'metaData.status', label: 'status' },
                { key: 'values.de', label: 'predicate [de]' },
                { key: 'values.en', label: 'predicate [en]' },
                { key: 'metaData.changedOn', label: 'created/modified' },
                { key: 'metaData.changedBy', label: 'by' },
                { key: 'actions', label: 'actions' },
            ],
            predicates: [],
            loading: true,
            errored: false,
            showDeleteModal: false,
            itemToDelete: null,
            filter: null,
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 20, 50],
            newPredicate: {
                de: null,
                en: null,
            },
        };
    },
    mounted() {
        this.loadPredicates();
    },
    computed: {
        filteredPredicates() {
            if (!this.filter) return this.predicates;
            const f = this.filter.toLowerCase();
            return this.predicates.filter(p =>
                (p.values?.de || '').toLowerCase().includes(f) ||
                (p.values?.en || '').toLowerCase().includes(f)
            );
        },
        totalRows() {
            return this.filteredPredicates.length;
        },
        addBtnDisabled: function () {
            return (
                this.newPredicate.de === null ||
                this.newPredicate.en === null ||
                this.newPredicate.de === '' ||
                this.newPredicate.en === ''
            );
        },
    },
    watch: {
        filter() {
            this.currentPage = 1;
        },
    },
    methods: {
        addPredicate() {
            this.$log.debug(
                'add predicate: [de]=' +
                    this.newPredicate.de +
                    ' [en]=' +
                    this.newPredicate.en
            );
            this.insertPredicate(this.newPredicate.de, this.newPredicate.en);
            this.resetNewPredicate();
            this.$nextTick(() => {
                this.loadPredicates();
            });
        },
        resetNewPredicate() {
            this.newPredicate.de = null;
            this.newPredicate.en = null;
        },
        removePredicate(item) {
            this.$log.debug('remove item: ' + item.id);
            this.deletePredicate(item.id);
            this.predicates.splice(this.predicates.indexOf(item), 1);
        },
        promptDelete(item) {
            this.itemToDelete = item;
            this.showDeleteModal = true;
        },
        confirmDelete() {
            this.removePredicate(this.itemToDelete);
        },
        inputHandler(index, id) {
            let changed = this.predicates.filter((predicate) => {
                return predicate.id === id;
            });
            this.updatedPredicate = changed[0];
            this.$log.debug(
                'inputHandler(' + JSON.stringify(this.updatedPredicate) + ')'
            );

            this.savePredicate(
                this.updatedPredicate.id,
                this.updatedPredicate.values.de,
                this.updatedPredicate.values.en
            );
            this.predicates[index] = this.updatedPredicate;
            this.$emit('update', this.predicates);
        },
        inputHandlerDebounce: _.debounce(function (index, id) {
            this.inputHandler(index, id);
        }, 500),
    },
};
</script>
