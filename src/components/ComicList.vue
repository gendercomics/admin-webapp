<template>
    <div>
        <b-container fluid class="mt-4">
            <b-row>
                <b-col lg="5" class="my-1">
                    <b-form-group label-for="filterInput">
                        <b-input-group size="sm">
                            <b-button
                                size="sm"
                                @click="browseMode = !browseMode"
                                ><font-awesome-icon
                                    v-if="browseMode"
                                    icon="database"
                                /><font-awesome-icon
                                    v-if="!browseMode"
                                    icon="search"
                                />
                            </b-button>

                            <b-form-input
                                v-if="browseMode"
                                v-model="textFilter"
                                type="search"
                                id="filterInput"
                                placeholder="type to filter"
                            />
                            <b-form-input
                                v-if="!browseMode"
                                v-model="searchTerm"
                                type="search"
                                id="searchInput"
                                placeholder="type to search"
                                @input="searchComics"
                            />

                            <b-input-group-append>
                                <b-button @click="clearSearchTermAndFilter"
                                    >Clear
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>

                <b-col>
                    <b-button
                        sm="1"
                        size="sm"
                        v-b-toggle.filter-collapse
                        class="m-1"
                        :variant="filterBtnVariant"
                        ><font-awesome-icon icon="filter" />
                    </b-button>
                </b-col>

                <b-col sm="1" md="1" class="my-1">
                    <!-- pagination size -->
                    <b-form-select
                        v-model="perPage"
                        id="perPageSelect"
                        size="sm"
                        v-b-tooltip.hover
                        title="records per page"
                        :options="pageOptions"
                    ></b-form-select>
                </b-col>

                <b-col sm="5" md="5" class="my-1">
                    <!-- pagination buttons -->
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

            <b-collapse id="filter-collapse">
                <b-row>
                    <b-col lg="5" class="my-1">
                        <!-- status filter -->
                        <b-form-group>
                            <b-badge>status</b-badge>
                            <b-form-checkbox-group
                                :options="this.$statusOptions"
                                v-model="statusFilter"
                                switches
                                size="sm"
                            />
                        </b-form-group>
                    </b-col>
                    <b-col lg="6" class="my-1">
                        <!-- type filter -->
                        <b-form-group>
                            <b-badge>type</b-badge>
                            <b-form-checkbox-group
                                :options="this.$typeOptions"
                                v-model="typeFilter"
                                switches
                                size="sm"
                            />
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-collapse>
        </b-container>

        <b-container fluid class="mt-1 pl-4 pr-4">
            <b-row>
                <b-table
                    id="comic-list-table"
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
                    :filter-function="customFilter"
                    @filtered="onFiltered"
                    :busy="this.loading"
                >
                    <!-- status -->
                    <template v-slot:cell(metaData.status)="row">
                        <span v-if="row.item.metaData.status === 'DRAFT'"
                            ><b-badge variant="secondary">draft</b-badge></span
                        >
                        <span
                            v-if="row.item.metaData.status === 'CLARIFICATION'"
                            ><b-badge variant="info"
                                >clarification</b-badge
                            ></span
                        >
                        <span v-if="row.item.metaData.status === 'REVIEW'"
                            ><b-badge variant="warning">review</b-badge></span
                        >
                        <span v-if="row.item.metaData.status === 'FINAL'"
                            ><b-badge variant="success">final</b-badge></span
                        >
                    </template>

                    <!-- type -->
                    <template v-slot:cell(type)="row">
                        <span v-if="row.item.type != null">
                            <b-badge pill variant="secondary">{{
                                typeAbbreviation(row.item.type)
                            }}</b-badge>
                        </span>
                    </template>

                    <!-- title (+ subtitle) -->
                    <template v-slot:cell(title)="row">
                        <span
                            v-if="
                                seriesTitleAndSubtitle(row.item, 'comic_series')
                            "
                        >
                            <b-link
                                :to="
                                    '/comics/' +
                                        seriesComicId(row.item, 'comic_series')
                                "
                            >
                                {{
                                    seriesTitleAndSubtitle(
                                        row.item,
                                        'comic_series'
                                    )
                                }}
                            </b-link>

                            <span>
                                {{ seriesVolume(row.item, 'comic_series') }}
                            </span>
                            <span>: </span>
                        </span>

                        <b-link :to="'/comics/' + row.item.id">{{
                            row.item.nameForWebAppList
                        }}</b-link>
                        <div v-if="row.item.subTitle !== null">
                            <span class="small">{{ row.item.subTitle }}</span>
                        </div>
                        <div v-if="row.item.partOf !== null">
                            <span class="small"
                                >in:
                                <b-link
                                    :to="'/comics/' + row.item.partOf.comic.id"
                                >
                                    {{ parentDisplayText(row.item) }}
                                </b-link>
                            </span>
                        </div>

                        <div
                            v-if="
                                seriesComicId(row.item, 'publishing_series')
                                    .length > 0
                            "
                        >
                            <span class="small"
                                >series:
                                <b-link
                                    :to="
                                        '/comics/' +
                                            seriesComicId(
                                                row.item,
                                                'publishing_series'
                                            )
                                    "
                                >
                                    {{
                                        seriesTitleAndSubtitle(
                                            row.item,
                                            'publishing_series'
                                        )
                                    }}
                                </b-link>
                                <span
                                    v-if="
                                        seriesVolume(
                                            row.item,
                                            'publishing_series'
                                        ).length > 0
                                    "
                                    >:</span
                                >
                                <span>{{
                                    seriesVolume(row.item, 'publishing_series')
                                }}</span>
                            </span>
                        </div>
                    </template>

                    <!-- creators -->
                    <template v-slot:cell(creators)="data">
                        <div
                            v-for="creator in data.item.creators"
                            v-bind:key="creator.id"
                        >
                            <span>{{ fullName(creator.name) }}</span>
                        </div>
                    </template>

                    <!-- publishers -->
                    <template v-slot:cell(publishers)="data">
                        <div
                            v-for="publisher in data.item.publishers"
                            v-bind:key="publisher.id"
                        >
                            <span>{{ publisher.nameForWebAppList }}</span>
                        </div>
                    </template>

                    <!-- creation/change date -->
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

                    <!-- creation/change user -->
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
import { httpClient } from '@/services/httpclient';
import _ from 'lodash';
import ComicService from '@/mixins/comicservice';
import { getters, mutations } from '@/services/store';
export default {
    name: 'ComicList',
    mixins: [ComicService],

    data() {
        return {
            fields: [
                { key: 'metaData.status', label: 'status' },
                { key: 'type', label: 'type' },
                { key: 'title', label: 'title' },
                { key: 'creators', label: 'creator(s)' },
                /* { key: 'partOf', label: 'in' },*/
                { key: 'publishers', label: 'publisher(s)' },
                { key: 'metaData.changedOn', label: 'created/modified' },
                { key: 'metaData.changedBy', label: 'by' },
                { key: 'actions', label: '' },
            ],
            comics: null,
            loading: true,
            errored: false,
            filterOn: [],
            totalRows: 1,
            pageOptions: [10, 20, 50, 100],
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$log.debug('store.browseMode=' + this.browseMode);
            this.$log.debug('store.filter.statusFilter=' + this.statusFilter);
            this.$log.debug('store.filter.typeFilter=' + this.typeFilter);
            this.$log.debug('store.page=' + this.currentPage);
            this.$log.debug('store.perPage=' + this.perPage);
            this.$log.debug('store.searchTerm=' + this.searchTerm);
            this.$log.debug('store.textFilter=' + this.textFilter);

            if (this.browseMode) {
                this.loadComicList();
            } else {
                if (this.searchTerm != null && this.searchTerm.length > 0) {
                    this.searchComics(this.searchTerm);
                }
            }
        });

        this.loading = false;
    },
    watch: {
        browseMode(newVal) {
            this.$log.debug('browseMode(' + newVal + ')');
            if (newVal) {
                this.loadComicList();
            }
        },
        currentPage(newVal) {
            this.$log.debug('watch: currentPage(' + newVal + ')');
        },
    },
    methods: {
        edit(item) {
            this.$router.push('/comics/' + item.id);
        },
        loadComicList() {
            this.loading = true;
            httpClient
                .get('/comicsList')
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
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            // TODO set currentPage from localStorage or set to 1 if filter has changed
            this.currentPage = 1;
        },
        customFilter(row, filter) {
            return (
                this.filterStatus(row) &&
                this.filterType(row) &&
                (this.filterTitle(row, filter) ||
                    this.filterSubTitle(row, filter) ||
                    this.filterCreators(row, filter) ||
                    this.filterParent(row, filter) ||
                    this.filterPublisher(row, filter) ||
                    this.filterSeries(row, filter))
            );
        },
        filterTitle(row, filter) {
            return row.nameForWebAppList
                .toLowerCase()
                .includes(filter[0].toLowerCase());
        },
        filterSubTitle(row, filter) {
            let subTitleForFilter = '';
            if (row.subTitle != null) {
                subTitleForFilter = row.subTitle;
            }
            let filterSubTitle = subTitleForFilter
                .toLowerCase()
                .includes(filter[0].toLowerCase());
            return filterSubTitle;
        },
        filterCreators(row, filter) {
            let filterCreator = false;
            if (row.creators !== null) {
                row.creators.forEach(function(creator) {
                    let filterName = '';
                    if (creator.name != null) {
                        if (creator.name.name !== null) {
                            filterName = creator.name.name;
                        } else {
                            filterName =
                                creator.name.firstName +
                                ' ' +
                                creator.name.lastName;
                        }
                    }
                    filterCreator =
                        filterCreator ||
                        filterName
                            .trim()
                            .toLowerCase()
                            .includes(filter[0].toLowerCase());
                });
            }
            return filterCreator;
        },
        filterParent(row, filter) {
            let filterParent = false;
            let parentString = this.parentDisplayText(row);
            if (parentString != null) {
                filterParent = parentString
                    .toLowerCase()
                    .includes(filter[0].toLowerCase());
            }
            return filterParent;
        },
        filterStatus(row) {
            return this.statusFilter.indexOf(row.metaData.status) !== -1;
        },
        filterType(row) {
            return this.typeFilter.indexOf(row.type) !== -1;
        },
        filterPublisher(row, filter) {
            let filterPublisher = false;
            if (row.publisher != null) {
                filterPublisher = row.publisher.name
                    .toLowerCase()
                    .includes(filter[0].toLowerCase());
            }
            return filterPublisher;
        },
        filterSeries(row, filter) {
            let filterSeries = false;
            if (row.series != null && row.series.comic != null) {
                filterSeries = row.series.comic.title
                    .toLowerCase()
                    .includes(filter[0].toLowerCase());
            }
            return filterSeries;
        },
        fullName(creator) {
            if (creator != null) {
                if (creator.name != null) {
                    return creator.name;
                }
                return creator.firstName + ' ' + creator.lastName;
            }
            return '';
        },
        parentDisplayText(item) {
            if (
                item.partOf !== null &&
                item.partOf.comic !== null &&
                item.partOf.comic.title !== null
            ) {
                return item.partOf.comic.issue !== null
                    ? item.partOf.comic.title + ', ' + item.partOf.comic.issue
                    : item.partOf.comic.title;
            }
            return null;
        },
        filterOnParentTitleAndIssue(item) {
            let filterString = item.partOf.comic.title;
            if (item.partOf.comic.issue != null) {
                filterString += ', ' + item.partOf.comic.issue;
            }
            this.textFilter = filterString;
        },
        deleteComic(item) {
            console.log('delete comic: ' + item.title);
            httpClient
                .delete('/comics/' + item.id, item)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
            this.comics.splice(this.comics.indexOf(item), 1);
        },
        typeAbbreviation(type) {
            switch (type) {
                case 'comic':
                    return 'C';
                case 'anthology':
                    return 'A';
                case 'magazine':
                    return 'M';
                case 'webcomic':
                    return 'W';
                case 'comic_series':
                    return 'S';
                case 'publishing_series':
                    return 'R';
                default:
                    return '';
            }
        },
        showDeleteModal(item) {
            this.$bvModal.msgBoxConfirm('sure???').then(confirmed => {
                this.$log.debug('delete id:' + item.id + ': ' + confirmed);
                if (confirmed) {
                    this.deleteComic(item);
                }
            });
        },
        seriesComicId(item, seriesType) {
            let id = '';
            if (item.seriesList != null) {
                item.seriesList.forEach(series => {
                    if (series.comic.type === seriesType) {
                        id = series.comic.id;
                    }
                });
            }
            return id;
        },
        seriesTitleAndSubtitle(item, seriesType) {
            if (item.seriesList != null) {
                let text = '';
                item.seriesList.forEach(series => {
                    if (series.comic.type === seriesType) {
                        text += series.comic.title;
                        if (series.comic.subTitle != null) {
                            text += '. ' + series.comic.subTitle;
                        }
                    }
                });
                return text;
            }
            return '';
        },
        seriesVolume(item, seriesType) {
            if (item.seriesList != null) {
                let text = '';
                item.seriesList.forEach(series => {
                    if (series.comic.type === seriesType) {
                        if (series.volume != null) {
                            text += ' ' + series.volume;
                        }
                    }
                });
                return text;
            }
            return '';
        },
        searchComics: _.debounce(function(val) {
            if (val.length > 0) {
                this.loading = true;
                this.$log.debug('search=' + val);
                let vm = this;
                this.search(val).then(function(response) {
                    vm.$data.comics = response;
                });
            }
        }, 500),
        clearSearchTermAndFilter() {
            this.textFilter = '';
            this.searchTerm = '';
        },
    },
    computed: {
        filter: function() {
            if (this.textFilter === null && this.statusFilter === null) {
                return null;
            }
            return [this.textFilter, this.statusFilter];
        },
        isFilter() {
            return this.statusFilter.length < 4 || this.typeFilter.length < 6;
        },
        filterBtnVariant() {
            if (this.isFilter) return 'warning';
            return 'secondary';
        },
        searchTerm: {
            get() {
                return getters.searchTerm();
            },
            set(val) {
                mutations.setSearchTerm(val);
            },
        },
        textFilter: {
            get() {
                return getters.textFilter();
            },
            set(val) {
                mutations.setTextFilter(val);
            },
        },
        browseMode: {
            get() {
                return getters.browseMode();
            },
            set(val) {
                mutations.setBrowseMode(val);
            },
        },
        currentPage: {
            get() {
                return getters.page();
            },
            set(val) {
                mutations.setPage(val);
            },
        },
        perPage: {
            get() {
                return getters.perPage();
            },
            set(val) {
                mutations.setPerPage(val);
            },
        },
        typeFilter: {
            get() {
                return getters.filter().typeFilter;
            },
            set(val) {
                mutations.setTypeFilter(val);
            },
        },
        statusFilter: {
            get() {
                return getters.filter().statusFilter;
            },
            set(val) {
                mutations.setStatusFilter(val);
            },
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
