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

        <b-form @submit="onSubmit" v-if="show">
            <b-container class="mt-2" fluid>
                <!-- comic summary on top TODO: improve summary -->
                <div class="m-2">
                    <input-field
                        label="comic"
                        :value="comic.title"
                        size="lg"
                        disabled
                    />
                </div>

                <b-row class="ml-2">
                    <div id="button-col" class="mt-2 mb-2">
                        <b-button-group vertical>
                            <b-button disabled>title</b-button>
                            <b-button
                                :variant="subtitleBtnVariant"
                                @click="addSubtitle"
                                :disabled="this.showSubtitle"
                                >subtitle
                            </b-button>
                            <b-button
                                :variant="issueBtnVariant"
                                @click="addIssue"
                                :disabled="this.showIssue"
                                >issue
                            </b-button>
                            <b-button variant="outline-dark" @click="addCreator"
                                >creator+
                            </b-button>
                            <b-button
                                :variant="typeBtnVariant"
                                @click="addType"
                                :disabled="this.showType"
                                >type
                            </b-button>
                            <b-button
                                :variant="publisherBtnVariant"
                                @click="addPublisher"
                                :disabled="this.showPublisher"
                                >publisher
                            </b-button>
                            <b-button
                                :variant="yearBtnVariant"
                                @click="addYear"
                                :disabled="this.showYear"
                                >year
                            </b-button>
                            <b-button
                                :variant="editionBtnVariant"
                                @click="addEdition"
                                :disabled="this.showEdition"
                                >edition
                            </b-button>
                            <b-button
                                :variant="linkBtnVariant"
                                @click="addLink"
                                :disabled="this.showLink"
                                >link
                            </b-button>
                            <b-button
                                :variant="isbnBtnVariant"
                                @click="addIsbn"
                                :disabled="this.showIsbn"
                                >isbn
                            </b-button>

                            <!-- in (part of publication) -->
                            <b-button
                                :variant="inBtnVariant"
                                @click="addIn"
                                :disabled="this.showIn"
                                v-if="this.showInButtons"
                                >in
                            </b-button>
                            <b-button
                                :variant="pagesBtnVariant"
                                @click="addPages"
                                :disabled="this.showPages"
                                v-if="this.showInButtons"
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
                            <!-- toggle JSON view -->
                            <b-button
                                variant="outline-dark"
                                :pressed.sync="showJson"
                                >JSON</b-button
                            >
                        </b-button-group>
                    </div>

                    <b-col id="form-col" class="mt-2 mr-2">
                        <!-- title -->
                        <b-input-group
                            prepend="title"
                            id="input-group-title"
                            label-for="input-title"
                            size="md"
                        >
                            <b-form-input
                                id="input-title"
                                v-model="comic.title"
                                required
                                placeholder="Enter title"
                                :state="titleState"
                            />
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
                        <input-field
                            label="issue"
                            v-model="comic.issue"
                            v-if="showIssue"
                            type="text"
                            removable
                            class="mt-2"
                        />

                        <!-- creators -->
                        <div
                            v-for="(creator, idx) in comic.creators"
                            v-bind:key="idx"
                        >
                            <!-- creator -->
                            <b-form-row class="pl-1 pr-1">
                                <b-input-group class="pt-2" prepend="creator">
                                    <div class="w-50">
                                        <b-form-select
                                            v-model="
                                                comic.creators[idx].name.id
                                            "
                                            @change="nameUpdated(idx)"
                                        >
                                            <option
                                                v-for="name in names"
                                                v-bind:key="name.id"
                                                :value="name.id"
                                                >{{ creatorName(name) }}
                                            </option>
                                        </b-form-select>
                                    </div>

                                    <b-form-select
                                        :options="roles"
                                        value-field="id"
                                        text-field="name"
                                        v-model="comic.creators[idx].role.id"
                                        @change="roleUpdated(idx)"
                                    >
                                        <!--<option value="" disabled>-- Please select a role --</option>-->
                                    </b-form-select>

                                    <template v-slot:append>
                                        <b-button @click="removeCreator(idx)">
                                            <font-awesome-icon
                                                icon="times-circle"
                                            />
                                        </b-button>
                                    </template>
                                </b-input-group>
                            </b-form-row>
                        </div>

                        <!-- creators v2 -->
                        <!--
                        <div
                            v-for="(creator, idx) in comic.creators"
                            v-bind:key="idx"
                        >
                            <comic-creator
                                v-model="comic.creators[idx]"
                                removable
                            />
                        </div>
                        -->

                        <!-- type -->
                        <select-field
                            label="type"
                            :options="this.types"
                            v-if="showType"
                            v-model="comic.type"
                            :selected="comic.type"
                            removable
                            class="mt-2"
                        />

                        <!-- publisher -->
                        <b-input-group
                            id="input-group-publisher"
                            class="pt-2"
                            prepend="publisher"
                            v-if="showPublisher"
                        >
                            <b-form-select
                                id="input-publisher"
                                :options="publishers"
                                value-field="id"
                                text-field="name"
                                v-model="selectedPublisher"
                                @change="changePublisher()"
                            />
                            <template v-slot:append>
                                <b-button @click="removePublisher()">
                                    <font-awesome-icon icon="times-circle" />
                                </b-button>
                            </template>
                        </b-input-group>

                        <!-- year -->
                        <input-field
                            label="year"
                            v-model="comic.year"
                            v-if="showYear"
                            type="number"
                            removable
                            class="mt-2"
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

                        <!-- isbn -->
                        <input-field
                            label="isbn"
                            v-model="comic.isbn"
                            v-if="showIsbn"
                            type="text"
                            removable
                            class="mt-2"
                        />

                        <!-- in (part of publication) -->
                        <b-input-group
                            id="input-group-in"
                            class="pt-2"
                            prepend="in"
                            v-if="showIn"
                        >
                            <b-form-select
                                id="input-publication"
                                v-model="selectedPublication"
                                @change="changePublication()"
                            >
                                <option
                                    v-for="parent in this.parents"
                                    v-bind:key="parent.id"
                                    :value="parent.id"
                                    >{{ parentOptionText(parent) }}
                                </option>
                            </b-form-select>
                            <template v-slot:append>
                                <b-button @click="removeIn()">
                                    <font-awesome-icon icon="times-circle" />
                                </b-button>
                            </template>
                        </b-input-group>

                        <!-- pages -->
                        <input-field
                            label="pages"
                            v-model="comic.partOf.pages"
                            v-if="showPages"
                            type="text"
                            removable
                            class="mt-2"
                        />

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

                        <!-- status -->
                        <b-form-group>
                            <!-- action buttons -->
                            <b-button-group class="mt-3 float-right">
                                <!-- editing status -->
                                <b-form-select
                                    :options="statusOptions"
                                    v-model="comic.metaData.status"
                                />

                                <b-button type="submit" variant="primary"
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

            <b-row class="mt-4" v-if="showJson">
                <b-col id="json-names">
                    <b-card header="names">
                        <pre class="mt-0">{{ $data.names }}</pre>
                    </b-card>
                </b-col>
            </b-row>

            <b-row class="mt-4" v-if="showJson">
                <b-col id="json-roles">
                    <b-card header="roles">
                        <pre class="mt-0">{{ $data.roles }}</pre>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';
import InputField from '../components/InputField';
import { httpClient } from '../services/httpclient';
import TagInput from '../components/TagInput';
import SelectField from '../components/SelectField';
//import ComicCreator from '@/components/ComicCreator';
import RoleService from '../mixins/roleservice';
import PersonService from '../mixins/personservice';

export default {
    name: 'ComicForm',
    mixins: [PersonService, RoleService],
    components: {
        // ComicCreator,
        TagInput,
        InputField,
        SelectField,
        Header,
    },
    data() {
        return {
            comic: {
                title: '',
                subTitle: null,
                issue: null,
                creators: [],
                type: null,
                publisher: null,
                year: null,
                edition: null,
                link: null,
                isbn: null,
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
            },
            names: [],
            roles: [],
            publishers: [],
            show: true,
            loading: true,
            errored: false,
            saveSuccessful: false,
            selectedPublisher: null,
            selectedPublication: null,
            types: ['anthology', 'comic', 'magazine', 'webcomic'],
            statusOptions: ['DRAFT', 'REVIEW', 'FINAL'],
            parents: null,
            showJson: false,
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
        issueBtnVariant() {
            if (!this.showIssue) return 'outline-dark';
            return 'dark';
        },
        typeBtnVariant() {
            if (!this.showType) return 'outline-dark';
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
            if (!this.showPages) return 'outline-dark';
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
        showSubtitle() {
            return this.comic.subTitle != null;
        },
        showIssue() {
            return this.comic.issue != null;
        },
        showType() {
            return this.comic.type != null;
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
        showIsbn() {
            return this.comic.isbn != null;
        },
        showIn() {
            return (
                this.comic.partOf !== null && this.comic.partOf.comic !== null
            );
        },
        showPages() {
            return (
                this.comic.partOf !== null && this.comic.partOf.pages !== null
            );
        },
        showInButtons() {
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
        },
        addCreator() {
            console.log('add creator');
            if (this.comic.creators === null) {
                this.comic.creators = [];
            }
            this.comic.creators.push({ name: {}, role: {} });
        },
        removeCreator(idx) {
            this.comic.creators.splice(idx, 1);
        },
        addType() {
            this.comic.type = '';
        },
        addPublisher() {
            this.comic.publisher = '';
        },
        addYear() {
            this.comic.year = '';
        },
        addEdition() {
            this.comic.edition = '';
        },
        addLink() {
            this.comic.link = '';
        },
        addIsbn() {
            this.comic.isbn = '';
        },
        addIn() {
            if (this.comic.partOf === null) {
                this.comic.partOf = { comic: null, pages: null };
            }
            this.comic.partOf.comic = '';
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
        changePublisher() {
            console.log(this.selectedPublisher);
            this.publishers.forEach(publisher => {
                if (this.selectedPublisher === publisher.id) {
                    this.comic.publisher = publisher;
                }
            });
        },
        removePublisher() {
            this.comic.publisher = null;
            this.selectedPublisher = null;
        },
        removeIn() {
            this.comic.partOf = null;
        },
        nameUpdated(idx) {
            console.log('nameUpdated=' + idx);
            this.names.forEach(name => {
                if (this.comic.creators[idx].name.id === name.id) {
                    this.comic.creators[idx].name = name;
                }
            });
        },
        roleUpdated(idx) {
            console.log('roleUpdated=' + idx);
            this.roles.forEach(role => {
                if (this.comic.creators[idx].role.id === role.id) {
                    this.comic.creators[idx].role = role;
                }
            });
        },
        changePublication() {
            console.log(this.selectedPublication);
            this.parents.forEach(parent => {
                if (this.selectedPublication === parent.id) {
                    this.comic.partOf.comic = parent;
                }
            });
        },
        loadParents() {
            httpClient
                .get('/comics/parents')
                .then(response => {
                    this.parents = response.data;
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                });
        },
        parentOptionText(parent) {
            let optionText = parent.title;

            /*
  parent.subtitle !== null
      ? (optionText += '. ' + parent.subTitle)
      : optionText;
  */
            parent.publisher != null
                ? (optionText += '. ' + parent.publisher.name)
                : optionText;
            parent.year != null
                ? (optionText += '. ' + parent.year)
                : optionText;
            return optionText;
        },
        creatorName(name) {
            if (name.name !== null) {
                return name.name;
            }
            return name.firstName + ' ' + name.lastName;
        },
    },
    mounted() {
        // load parents (anthologies, magazines)
        this.loadParents();
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
