<template>
    <div class="text-left">
        <Header />

        <div class="mt-3 ml-3 mr-3">
            <b-alert variant="success" dismissible v-model="saveSuccessful"
                >comic saved!</b-alert
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
                        <b-button disabled>title</b-button>
                        <b-button
                            :variant="subtitleBtnVariant"
                            @click="addSubtitle"
                            :disabled="this.showSubtitle"
                            >subtitle</b-button
                        >
                        <b-button variant="outline-dark" @click="addCreator"
                            >creator+</b-button
                        >
                        <b-button
                            :variant="publisherBtnVariant"
                            @click="addPublisher"
                            :disabled="this.showPublisher"
                            >publisher</b-button
                        >
                        <b-button
                            :variant="locationBtnVariant"
                            @click="addLocation"
                            :disabled="this.showLocation"
                            >location</b-button
                        >
                        <b-button
                            :variant="yearBtnVariant"
                            @click="addYear"
                            :disabled="this.showYear"
                            >year</b-button
                        >
                        <b-button
                            :variant="editionBtnVariant"
                            @click="addEdition"
                            :disabled="this.showEdition"
                            >edition</b-button
                        >
                        <b-button
                            :variant="linkBtnVariant"
                            @click="addLink"
                            :disabled="this.showLink"
                            >link</b-button
                        >
                        <b-button
                            :variant="isbnBtnVariant"
                            @click="addIsbn"
                            :disabled="this.showIsbn"
                            >isbn</b-button
                        >
                    </b-button-group>

                    <b-button-group vertical class="mt-2">
                        <b-button variant="outline-dark">...</b-button>
                    </b-button-group>
                </b-col>

                <b-col id="form-col">
                    <b-form @submit="onSubmit" v-if="show">
                        <!-- title -->
                        <b-input-group
                            prepend="title"
                            id="input-group-title"
                            label-for="input-title"
                            size="lg"
                        >
                            <b-form-input
                                id="input-title"
                                v-model="comic.title"
                                required
                                placeholder="Enter title"
                                :state="titleState"
                            />
                            <b-form-invalid-feedback
                                >Enter at least 4
                                characters</b-form-invalid-feedback
                            >
                        </b-input-group>

                        <!-- subtitle -->
                        <input-field
                            label="subtitle"
                            v-model="comic.subTitle"
                            v-if="showSubtitle"
                            type="text"
                        />

                        <!-- creators -->
                        <div
                            v-for="(creator, idx) in comic.creators"
                            v-bind:key="idx"
                        >
                            <b-form-row class="pl-1 pr-1">
                                <b-input-group
                                    class="pt-2"
                                    prepend="creator"
                                    @change="setClickedIndex(idx)"
                                >
                                    <div class="w-75">
                                        <b-form-select
                                            v-model="selectedCreatorPerson[idx]"
                                            @change="personUpdated"
                                        >
                                            <option
                                                v-for="person in persons"
                                                v-bind:key="person.id"
                                                :value="person.id"
                                                >{{
                                                    person.firstName +
                                                        ' ' +
                                                        person.lastName
                                                }}</option
                                            >
                                        </b-form-select>
                                    </div>

                                    <b-form-select
                                        :options="roles"
                                        value-field="id"
                                        text-field="name"
                                        v-model="selectedCreatorRole[idx]"
                                        @change="roleUpdated"
                                    >
                                        <!--<option value="" disabled>-- Please select a role --</option>-->
                                    </b-form-select>

                                    <template v-slot:append>
                                        <b-button @click="removeCreator(idx)"
                                            ><font-awesome-icon
                                                icon="times-circle"
                                        /></b-button>
                                    </template>
                                </b-input-group>
                            </b-form-row>
                        </div>

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
                                <b-button @click="removePublisher()"
                                    ><font-awesome-icon icon="times-circle"
                                /></b-button>
                            </template>
                        </b-input-group>

                        <!-- location -->
                        <input-field
                            label="location"
                            v-model="comic.location"
                            v-if="showLocation"
                            type="text"
                        />

                        <!-- year -->
                        <input-field
                            label="year"
                            v-model="comic.year"
                            v-if="showYear"
                            type="number"
                        />

                        <!-- edition -->
                        <input-field
                            label="edition"
                            v-model="comic.edition"
                            v-if="showEdition"
                            type="text"
                        />

                        <!-- link -->
                        <input-field
                            label="link"
                            v-model="comic.link"
                            v-if="showLink"
                            type="url"
                        />

                        <!-- isbn -->
                        <input-field
                            label="isbn"
                            v-model="comic.isbn"
                            v-if="showIsbn"
                            type="text"
                        />

                        <!-- action buttons -->
                        <b-button-group class="mt-3 float-right">
                            <b-button type="submit" variant="primary"
                                >save</b-button
                            >
                            <b-button
                                to="/comics"
                                type="reset"
                                :variant="backBtnVariant"
                                >back</b-button
                            >
                        </b-button-group>
                    </b-form>
                </b-col>
            </b-row>

            <b-row class="mt-4">
                <b-col id="json-comic">
                    <b-card header="comic">
                        <pre class="mt-0">{{ $data.comic }}</pre>
                    </b-card>
                </b-col>
            </b-row>

            <!--           
            
            <b-row class="mt-4">
                <b-col id="json-some-values">
                    <b-card header="some data">
                        <pre class="mt-0">
                            <div>selectedPublisher: {{ $data.selectedPublisher }}</div>
                            <div>selectedCreatorPerson: {{ $data.selectedCreatorPerson }}</div>
                            <div>selectedCreatorRole: {{ $data.selectedCreatorRole }}</div>
                            <div>saveSuccessful: {{ $data.saveSuccessful }}</div>
                        </pre>
                    </b-card>
                </b-col>
            </b-row>

            
            <b-row class="mt-4">
                <b-col id="json-persons">
                    <b-card header="persons">
                        <pre class="mt-0">{{ $data.persons }}</pre>
                    </b-card>
                </b-col>
            </b-row>

            <b-row class="mt-4">
                <b-col id="json-publishers">
                    <b-card header="publishers">
                        <pre class="mt-0">{{ $data.publishers }}</pre>
                    </b-card>
                </b-col>
            </b-row>
            
            -->
        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';
import InputField from '../components/InputField';

export default {
    name: 'ComicForm',
    components: {
        InputField,
        Header,
    },
    data() {
        return {
            comic: {
                title: '',
                subTitle: '',
                creators: [],
                publisher: null,
                location: null,
                year: null,
                edition: null,
                link: null,
                isbn: null,
                metadata: {
                    createdOn: null,
                    createdBy: null,
                    changedOn: null,
                    changedBy: null,
                },
            },
            persons: null,
            roles: null,
            publishers: null,
            show: true,
            loading: true,
            errored: false,
            saveSuccessful: false,
            selectedPublisher: null,
            selectedCreatorPerson: [],
            selectedCreatorRole: [],
            clickedIndex: null,
        };
    },
    computed: {
        titleState() {
            return this.comic.title.length >= 4;
        },
        subtitleBtnVariant() {
            if (!this.showSubtitle) return 'outline-dark';
            return 'dark';
        },
        publisherBtnVariant() {
            if (!this.showPublisher) return 'outline-dark';
            return 'dark';
        },
        locationBtnVariant() {
            if (!this.showLocation) return 'outline-dark';
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
        backBtnVariant() {
            return 'outline-danger';
        },
        showSubtitle() {
            return this.comic.subTitle != null;
        },
        showPublisher() {
            return this.comic.publisher != null;
        },
        showLocation() {
            return this.comic.location != null;
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
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            //alert(JSON.stringify(this.comic));
            if (this.$route.path.endsWith('new')) {
                this.$api
                    .post('/comics/', this.comic)
                    .then(response => (this.comic = response.data))
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            } else {
                this.$api
                    .put('/comics/' + this.comic.id, this.comic)
                    .then(response => (this.comic = response.data))
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            }
            this.saveSuccessful = true;
        },
        addSubtitle() {
            this.comic.subTitle = '';
        },
        addCreator(person, role) {
            console.log('add creator: ' + person.id, role);
            console.log('creators=' + this.comic.creators);
            if (this.comic.creators === null) {
                this.comic.creators = [];
            }
            this.comic.creators.push({});
        },
        removeCreator(idx) {
            this.comic.creators.splice(idx, 1);
            this.selectedCreatorPerson.splice(idx, 1);
            this.selectedCreatorRole.splice(idx, 1);
        },
        addPublisher() {
            this.comic.publisher = '';
        },
        addLocation() {
            this.comic.location = '';
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
        setClickedIndex(idx) {
            console.log('setClickedIndex=' + idx);
            this.clickedIndex = idx;
        },
        personUpdated(personId) {
            console.log('personUpdated=' + personId);
            let creator = this.comic.creators[this.clickedIndex];
            if (creator == null) {
                creator = {};
            }
            if (creator.person == null) {
                creator.person = {};
            }
            this.persons.forEach(person => {
                if (personId === person.id) {
                    creator.person = person;
                    this.comic.creators[this.clickedIndex] = creator;
                    this.comic.creators.push();
                }
            });
        },
        roleUpdated(roleId) {
            console.log('roleUpdated=' + roleId);
            let creator = this.comic.creators[this.clickedIndex];
            if (creator == null) {
                creator = {};
            }
            if (creator.role == null) {
                creator.role = {};
            }
            this.roles.forEach(role => {
                if (roleId === role.id) {
                    creator.role = role;
                    this.comic.creators[this.clickedIndex] = creator;
                    this.comic.creators.push();
                }
            });
        },
    },
    mounted() {
        // get comic
        if (!this.$route.path.endsWith('new')) {
            this.$api
                .get(this.$route.path)
                .then(response => {
                    this.comic = response.data;
                    if (this.comic.publisher != null) {
                        this.selectedPublisher = this.comic.publisher.id;
                    }
                    for (let idx in this.comic.creators) {
                        this.selectedCreatorPerson[idx] = this.comic.creators[
                            idx
                        ].person.id;
                        this.selectedCreatorRole[idx] = this.comic.creators[
                            idx
                        ].role.id;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        }
        // get persons
        this.$api
            .get('/persons')
            .then(response => (this.persons = response.data))
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
        // get publishers
        this.$api
            .get('/publishers')
            .then(response => (this.publishers = response.data))
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
        this.$api
            .get('/roles')
            .then(response => (this.roles = response.data))
            .catch(error => {
                console.log(error);
            })
            .finally(() => (this.loading = false));
    },
};
</script>
