<template>
    <div class="text-left">
        <Header />

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="success" dismissible v-model="saveSuccessful"
                >comic saved!
            </b-alert>
        </div>

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="danger" dismissible v-model="errored"
                >error!
            </b-alert>
        </div>

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="warning" dismissible v-model="duplicateTitle"
                ><font-awesome-icon icon="exclamation-triangle" /><span
                    class="ml-2"
                    >{{ comic.title }} already exists!</span
                >
            </b-alert>
        </div>

        <b-form @submit="onSubmit" v-if="show">
            <b-container class="mt-2" fluid>
                <b-row class="ml-0">
                    <div id="button-col" class="mt-2 mb-2">
                        <b-button-group vertical>
                            <!-- title -->
                            <b-button disabled>title</b-button>
                            <!-- subtitle -->
                            <b-button
                                :variant="subtitleBtnVariant"
                                @click="addSubtitle"
                                :disabled="this.showSubtitle"
                                >subtitle
                            </b-button>
                            <!-- issue button -->
                            <b-button
                                :variant="issueBtnVariant"
                                @click="addIssue"
                                :disabled="this.showIssue"
                                v-if="this.isNotSeries"
                                >issue
                            </b-button>

                            <!-- issue button -->
                            <b-button
                                :variant="issueTitleBtnVariant"
                                @click="addIssueTitle"
                                :disabled="this.showIssueTitle"
                                v-if="this.showIssue"
                                >issue title
                            </b-button>

                            <!-- creator button -->
                            <b-button-group>
                                <b-button disabled :variant="creatorBtnVariant"
                                    >creator
                                </b-button>
                                <b-button
                                    variant="outline-dark"
                                    @click="addCreator"
                                    >+
                                </b-button>
                            </b-button-group>
                            <!-- publisher button -->
                            <b-button
                                :variant="publisherBtnVariant"
                                @click="addPublisher"
                                :disabled="this.showPublisher"
                                >publisher
                            </b-button>
                            <!-- printer button -->
                            <b-button
                                :variant="printerBtnVariant"
                                @click="addPrinter"
                                :disabled="this.hasPrinter"
                                v-if="!this.showPublisher"
                                >printer
                            </b-button>
                            <!-- year button -->
                            <b-button
                                :variant="yearBtnVariant"
                                @click="addYear"
                                :disabled="this.showYear"
                                >year
                            </b-button>
                            <!-- edition button -->
                            <b-button
                                :variant="editionBtnVariant"
                                @click="addEdition"
                                :disabled="this.showEdition"
                                v-if="this.isComicType"
                                >edition
                            </b-button>
                            <!-- link button -->
                            <b-button
                                :variant="linkBtnVariant"
                                @click="addLink"
                                :disabled="this.showLink"
                                >link
                            </b-button>
                            <!-- isbn button -->
                            <b-button
                                :variant="isbnBtnVariant"
                                @click="addIsbn"
                                :disabled="this.showIsbn"
                                v-if="this.isComicType"
                                >isbn
                            </b-button>

                            <!-- series (part of publishing series) -->
                            <b-button
                                :variant="seriesBtnVariant"
                                @click="addSeries"
                                :disabled="this.hasSeries"
                                v-if="this.isNotSeries"
                                >series
                            </b-button>

                            <!-- series volume (part of publishing series) -->
                            <b-button
                                v-if="this.hasSeries"
                                @click="addSeriesVolume"
                                :variant="seriesVolumeBtnVariant"
                                :disabled="this.hasSeriesVolume"
                                >volume
                            </b-button>

                            <!-- in (part of publication) -->
                            <b-button
                                :variant="inBtnVariant"
                                @click="addIn"
                                :disabled="this.showIn"
                                v-if="this.isComicType"
                                >in
                            </b-button>

                            <!-- pages -->
                            <b-button
                                :variant="pagesBtnVariant"
                                @click="addPages"
                                :disabled="this.hasPages"
                                v-if="this.showIn"
                                >pages
                            </b-button>

                            <!-- genres -->
                            <b-button
                                :variant="genresBtnVariant"
                                @click="addGenres"
                                :disabled="this.showGenres"
                                >genres
                            </b-button>

                            <!-- keywords -->
                            <b-button
                                :variant="keywordsBtnVariant"
                                @click="addKeywords"
                                :disabled="this.showKeywords"
                                >keywords
                            </b-button>

                            <!-- comments -->
                            <b-button-group>
                                <b-button disabled :variant="commentBtnVariant"
                                    >comment
                                </b-button>
                                <b-button
                                    variant="outline-dark"
                                    @click="addComment"
                                    >+
                                </b-button>
                            </b-button-group>

                            <!-- toggle JSON view -->
                            <b-button
                                variant="outline-dark"
                                :pressed.sync="showJson"
                                >JSON
                            </b-button>
                        </b-button-group>
                    </div>

                    <b-col id="form-col" class="mt-2 mr-2">
                        <!-- title -->
                        <b-input-group
                            id="input-group-title"
                            label-for="input-title"
                            size="md"
                        >
                            <!-- type -->
                            <b-form-select
                                :options="this.types"
                                v-model="comic.type"
                                style="background-color: #E4E7EB; max-width: 15%"
                            >
                            </b-form-select>

                            <b-form-input
                                id="input-title"
                                v-model="comic.title"
                                required
                                placeholder="Enter title"
                                :state="titleState"
                                @input="verifyTitle"
                            />

                            <div class="ml-1 float-right">
                                <!-- status -->
                                <b-form-group class="m-0">
                                    <!-- action buttons -->
                                    <b-button-group>
                                        <!-- editing status -->
                                        <b-form-select
                                            :options="this.$statusOptions"
                                            v-model="comic.metaData.status"
                                        />

                                        <b-button
                                            type="submit"
                                            variant="primary"
                                            >save
                                        </b-button>
                                        <b-button
                                            to="/comics"
                                            type="reset"
                                            :variant="backBtnVariant"
                                            >back
                                        </b-button>
                                    </b-button-group>
                                </b-form-group>
                            </div>

                            <b-form-invalid-feedback
                                >Enter at least 1 character
                            </b-form-invalid-feedback>
                        </b-input-group>

                        <!-- subtitle -->
                        <input-field
                            label="subtitle"
                            v-model="comic.subTitle"
                            v-if="showSubtitle"
                            type="text"
                            removable
                            class="mt-2"
                        />

                        <!-- issue -->
                        <b-form-row>
                            <b-col cols="3">
                                <input-field
                                    label="issue"
                                    v-model="comic.issue"
                                    v-if="showIssue"
                                    type="text"
                                    removable
                                    class="mt-2"
                                />
                            </b-col>
                            <b-col>
                                <input-field
                                    label="issue title"
                                    v-model="comic.issueTitle"
                                    v-if="showIssueTitle"
                                    type="text"
                                    removable
                                    class="mt-2 float-left"
                                />
                            </b-col>
                        </b-form-row>

                        <!-- creators -->
                        <div
                            v-for="(creator, idx) in comic.creators"
                            v-bind:key="idx"
                        >
                            <comic-creator
                                v-model="comic.creators[idx]"
                                removable
                                @remove="removeCreator(idx)"
                            />
                        </div>

                        <!-- publisher -->
                        <b-input-group
                            id="input-group-publisher"
                            class="pt-2"
                            prepend="publisher"
                            v-if="showPublisher"
                        >
                            <searchable-dropdown
                                v-model="comic.publisher"
                                options-path="/publishers"
                            />

                            <template v-slot:append>
                                <b-button @click="removePublisher()">
                                    <font-awesome-icon icon="times-circle" />
                                </b-button>
                            </template>
                        </b-input-group>

                        <!-- printer -->
                        <input-field
                            label="printer"
                            v-model="comic.printer"
                            v-if="hasPrinter"
                            removable
                            class="mt-2 w-50"
                        />

                        <!-- year -->
                        <input-field
                            label="year"
                            v-model="comic.year"
                            v-if="showYear"
                            removable
                            class="mt-2 w-25"
                        />

                        <!-- edition -->
                        <input-field
                            label="edition"
                            v-model="comic.edition"
                            v-if="showEdition"
                            type="text"
                            removable
                            class="mt-2"
                        />

                        <!-- link -->
                        <input-field
                            label="link"
                            v-model="comic.link"
                            v-if="showLink"
                            type="url"
                            removable
                            class="mt-2"
                        />

                        <!-- link including last access date -->
                        <link-field
                            label="link"
                            v-model="comic.hyperLink"
                            v-if="showHyperLink"
                            removable
                            class="mt-2"
                        />

                        <!-- isbn -->
                        <input-field
                            label="isbn"
                            v-model="comic.isbn"
                            v-if="showIsbn"
                            type="text"
                            removable
                            class="mt-2"
                        />

                        <!-- series -->
                        <b-form-row>
                            <b-col>
                                <b-input-group
                                    id="input-group-series"
                                    class="pt-2"
                                    prepend="series"
                                    v-if="hasSeries"
                                >
                                    <searchable-dropdown
                                        v-model="comic.series.comic"
                                        options-path="/comics/type/series"
                                        class="flex-fill"
                                    />

                                    <template v-slot:append>
                                        <b-button @click="removeSeries()">
                                            <font-awesome-icon
                                                icon="times-circle"
                                            />
                                        </b-button>
                                    </template>
                                </b-input-group>
                            </b-col>
                            <b-col>
                                <input-field
                                    label="volume"
                                    v-model="comic.series.volume"
                                    v-if="hasSeriesVolume"
                                    type="text"
                                    class="mt-2"
                                    removable
                                />
                            </b-col>
                        </b-form-row>

                        <!-- in (part of publication) -->
                        <b-form-row>
                            <b-col>
                                <b-input-group
                                    id="input-group-in"
                                    class="pt-2"
                                    prepend="in"
                                    v-if="showIn"
                                >
                                    <searchable-dropdown
                                        v-model="comic.partOf.comic"
                                        options-path="/comics/parents"
                                        class="flex-fill"
                                    />

                                    <template v-slot:append>
                                        <b-button @click="removeIn()">
                                            <font-awesome-icon
                                                icon="times-circle"
                                            />
                                        </b-button>
                                    </template>
                                </b-input-group>
                            </b-col>
                            <!-- pages -->
                            <b-col>
                                <input-field
                                    label="pages"
                                    v-model="comic.partOf.pages"
                                    v-if="hasPages"
                                    type="text"
                                    removable
                                    class="mt-2"
                                />
                            </b-col>
                        </b-form-row>

                        <!-- keywords (genres) -->
                        <TagInput
                            label="genres"
                            v-model="comic.genres"
                            type="genre"
                            v-if="showGenres"
                        />

                        <!-- keywords (content) -->
                        <TagInput
                            label="keywords"
                            v-model="comic.keywords"
                            type="content"
                            v-if="showKeywords"
                        />

                        <!-- comments -->
                        <div
                            v-for="(comment, idx_comment) in comic.comments"
                            v-bind:key="'comment' + idx_comment"
                        >
                            <comment-field
                                v-model="comic.comments[idx_comment]"
                                removable
                                @remove="removeComment(idx_comment)"
                            />
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </b-form>

        <b-container fluid class="mt-4 ml-4 mr-4">
            <b-row class="mt-4 mr-4" v-if="showJson">
                <b-col id="json-comic">
                    <b-card header="comic">
                        <pre class="mt-0">{{ $data.comic }}</pre>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import { httpClient } from '@/services/httpclient';
import TagInput from '@/components/TagInput';
import ComicCreator from '@/components/ComicCreator';
import ComicService from '@/mixins/comicservice';
import RoleService from '@/mixins/roleservice';
import PersonService from '@/mixins/personservice';
import SearchableDropdown from '@/components/SearchableDropdown';
import CommentField from '@/components/CommentField';
import LinkField from '@/components/LinkField';
import _ from 'lodash';

export default {
    name: 'ComicForm',
    mixins: [ComicService, PersonService, RoleService],
    components: {
        CommentField,
        SearchableDropdown,
        ComicCreator,
        TagInput,
        InputField,
        Header,
        LinkField,
    },
    data() {
        return {
            comic: {
                title: '',
                subTitle: null,
                issue: null,
                issueTitle: null,
                creators: [],
                type: 'comic',
                publisher: null,
                printer: null,
                year: null,
                edition: null,
                link: null,
                hyperLink: {
                    url: null,
                    lastAccess: null,
                },
                isbn: null,
                series: null,
                partOf: null,
                genres: null,
                keywords: null,
                metaData: {
                    createdOn: null,
                    createdBy: null,
                    changedOn: null,
                    changedBy: null,
                    status: 'DRAFT',
                },
                comments: [],
            },
            names: [],
            roles: [],
            publishers: [],
            show: true,
            loading: true,
            errored: false,
            saveSuccessful: false,
            selectedPublisher: null,
            types: [
                'anthology',
                'comic',
                'magazine',
                'comic_series',
                'publishing_series',
                'webcomic',
            ],
            showJson: false,
            duplicateTitle: false,
        };
    },
    computed: {
        titleState() {
            if (this.comic.title.length < 1) {
                return false;
            }
            return null;
        },
        subtitleBtnVariant() {
            if (!this.showSubtitle) return 'outline-dark';
            return 'dark';
        },
        creatorsExist() {
            return (
                this.comic.creators != null && this.comic.creators.length > 0
            );
        },
        creatorBtnVariant() {
            return this.creatorsExist ? 'dark' : 'outline-dark';
        },
        issueBtnVariant() {
            if (!this.showIssue) return 'outline-dark';
            return 'dark';
        },
        issueTitleBtnVariant() {
            if (!this.showIssueTitle) return 'outline-dark';
            return 'dark';
        },
        publisherBtnVariant() {
            if (!this.showPublisher) return 'outline-dark';
            return 'dark';
        },
        yearBtnVariant() {
            if (!this.showYear) return 'outline-dark';
            return 'dark';
        },
        editionBtnVariant() {
            if (!this.showEdition) return 'outline-dark';
            return 'dark';
        },
        linkBtnVariant() {
            if (!this.showLink) return 'outline-dark';
            return 'dark';
        },
        isbnBtnVariant() {
            if (!this.showIsbn) return 'outline-dark';
            return 'dark';
        },
        inBtnVariant() {
            if (!this.showIn) return 'outline-dark';
            return 'dark';
        },
        pagesBtnVariant() {
            if (!this.hasPages) return 'outline-dark';
            return 'dark';
        },
        backBtnVariant() {
            return 'outline-danger';
        },
        keywordsBtnVariant() {
            if (!this.showKeywords) return 'outline-dark';
            return 'dark';
        },
        genresBtnVariant() {
            if (!this.showGenres) return 'outline-dark';
            return 'dark';
        },
        commentBtnVariant() {
            return this.commentsExist ? 'dark' : 'outline-dark';
        },
        seriesBtnVariant() {
            if (!this.hasSeries) return 'outline-dark';
            return 'dark';
        },
        seriesVolumeBtnVariant() {
            if (!this.hasSeriesVolume) return 'outline-dark';
            return 'dark';
        },
        printerBtnVariant() {
            if (!this.hasPrinter) return 'outline-dark';
            return 'dark';
        },
        showSubtitle() {
            return this.comic.subTitle != null;
        },
        showIssue() {
            return this.comic.issue != null;
        },
        showIssueTitle() {
            return this.comic.issueTitle != null;
        },
        showPublisher() {
            return this.comic.publisher != null;
        },
        showYear() {
            return this.comic.year != null;
        },
        showEdition() {
            return this.comic.edition != null;
        },
        showLink() {
            return this.comic.link != null;
        },
        showHyperLink() {
            if (this.comic.hyperLink == null) {
                return false;
            }
            return this.comic.hyperLink.url != null;
        },
        showIsbn() {
            return this.comic.isbn != null;
        },
        showIn() {
            return (
                this.comic.partOf !== null && this.comic.partOf.comic !== null
            );
        },
        hasPages() {
            return (
                this.comic.partOf !== null && this.comic.partOf.pages !== null
            );
        },
        isComicType() {
            return (
                this.comic.type === null ||
                this.comic.type === '' ||
                this.comic.type === 'comic'
            );
        },
        showKeywords() {
            return this.comic.keywords != null;
        },
        showGenres() {
            return this.comic.genres != null;
        },
        hasSeries() {
            return (
                this.comic.series !== null && this.comic.series.comic !== null
            );
        },
        hasSeriesVolume() {
            return (
                this.comic.series !== null && this.comic.series.volume !== null
            );
        },
        commentsExist() {
            return (
                this.comic.comments != null && this.comic.comments.length > 0
            );
        },
        isNotSeries() {
            return (
                this.comic.type !== 'comic_series' &&
                this.comic.type !== 'publishing_series'
            );
        },
        hasPrinter() {
            return this.comic.printer != null;
        },
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            //alert(JSON.stringify(this.comic));
            if (this.$route.path.endsWith('new')) {
                httpClient
                    .post('/comics/', this.comic)
                    .then(
                        response => (
                            (this.comic = response.data),
                            (this.saveSuccessful = true)
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            } else {
                httpClient
                    .put('/comics/' + this.comic.id, this.comic)
                    .then(
                        response => (
                            (this.comic = response.data),
                            (this.saveSuccessful = true)
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            }
        },
        addSubtitle() {
            this.comic.subTitle = '';
        },
        addIssue() {
            this.comic.issue = '';
            this.comic.issueTitle = '';
        },
        addIssueTitle() {
            this.comic.issueTitle = '';
        },
        addCreator() {
            if (this.comic.creators === null) {
                this.comic.creators = [];
            }
            this.comic.creators.push({ name: {}, role: {} });
        },
        removeCreator(idx) {
            this.$log.debug('idx=' + idx);
            this.comic.creators.splice(idx, 1);
        },
        removeComment(idx) {
            // TODO remove only owned comment?
            this.$log.debug('idx=' + idx);
            this.comic.comments.splice(idx, 1);
        },
        addPublisher() {
            this.comic.publisher = '';
        },
        addPrinter() {
            this.comic.printer = '';
        },
        addYear() {
            this.comic.year = '';
        },
        addEdition() {
            this.comic.edition = '';
        },
        addLink() {
            this.comic.hyperLink = { url: '', lastAccess: new Date() };
        },
        addIsbn() {
            this.comic.isbn = '';
        },
        addIn() {
            if (this.comic.partOf === null) {
                this.comic.partOf = { comic: null, pages: null };
            }
            this.comic.partOf.comic = '';
            this.comic.partOf.pages = '';
        },
        addPages() {
            if (this.comic.partOf === null) {
                this.comic.partOf = { comic: null, pages: null };
            }
            this.comic.partOf.pages = '';
        },
        addKeywords() {
            this.comic.keywords = [];
        },
        addGenres() {
            this.comic.genres = [];
        },
        removePublisher() {
            this.comic.publisher = null;
            this.selectedPublisher = null;
        },
        removeSeries() {
            this.comic.series = null;
        },
        removeIn() {
            this.comic.partOf = null;
        },
        addSeries() {
            if (this.comic.series === null) {
                this.comic.series = { comic: null, volume: null };
            }
            this.comic.series.comic = '';
            this.comic.series.volume = '';
        },
        addSeriesVolume() {
            this.comic.series.volume = '';
        },
        roleUpdated(idx) {
            console.log('roleUpdated=' + idx);
            this.roles.forEach(role => {
                if (this.comic.creators[idx].role.id === role.id) {
                    this.comic.creators[idx].role = role;
                }
            });
        },
        creatorName(name) {
            if (name.name !== null) {
                return name.name;
            }
            return name.firstName + ' ' + name.lastName;
        },
        addComment() {
            if (this.comic.comments === null) {
                this.comic.comments = [];
            }
            this.comic.comments.push({ value: null });
        },
        verifyTitle: _.debounce(function(val) {
            this.$log.debug('verifyTitle=' + val);
            let vm = this;
            this.titleExists(val).then(function(response) {
                vm.$log.debug('titleExits=' + response);
                vm.$data.duplicateTitle = response;
            });
        }, 1000),
    },
    mounted() {
        // load roles
        this.loadRoles();
        // load creators (creators = searchable persons)
        this.loadCreators();
        // get comic
        if (!this.$route.path.endsWith('new')) {
            httpClient
                .get(this.$route.path)
                .then(response => {
                    this.comic = response.data;
                    if (this.comic.publisher != null) {
                        this.selectedPublisher = this.comic.publisher.id;
                    }
                    if (
                        this.comic.partOf != null &&
                        this.comic.partOf.comic != null
                    ) {
                        this.selectedPublication = this.comic.partOf.comic.id;
                    }
                    if (this.comic.metaData.status === null) {
                        this.comic.metaData.status = 'DRAFT';
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        }
        // get publishers
        httpClient
            .get('/publishers')
            .then(response => (this.publishers = response.data))
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
    },
};
</script>
