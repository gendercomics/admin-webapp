<template>
    <div class="text-left">
        <Header/>

        <b-container class="mt-3" fluid>
            <b-row>
                <b-col id="button-col" cols="1">
                    <b-button-group vertical>
                        <b-button disabled>title</b-button>
                        <b-button :variant="subtitleBtnVariant" @click="addSubtitle" :disabled="this.showSubtitle">subtitle</b-button>
                        <b-button variant="outline-dark" @click="addCreator">creator+</b-button>
                        <b-button :variant="publisherBtnVariant" @click="addPublisher" :disabled="this.showPublisher">publisher</b-button>
                        <b-button :variant="locationBtnVariant" @click="addLocation" :disabled="this.showLocation">location</b-button>
                        <b-button :variant="yearBtnVariant" @click="addYear" :disabled="this.showYear">year</b-button>
                        <b-button :variant="editionBtnVariant" @click="addEdition" :disabled="this.showEdition">edition</b-button>
                    </b-button-group>
                </b-col>

                <b-col id="form-col">

                    <b-form @submit="onSubmit" v-if="show">
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
                            <b-form-invalid-feedback>Enter at least 4 characters</b-form-invalid-feedback>
                        </b-input-group>

                        <b-input-group
                                id="input-group-subtitle"
                                class="pt-2"
                                prepend="subtitle"
                                label-for="input-subtitle"
                                v-if="showSubtitle"
                        >
                            <b-form-input
                                    id="input-subtitle"
                                    v-model="comic.subTitle"
                                    placeholder="Enter subtitle"
                            />
                        </b-input-group>

                        <!-- creators -->
                        <div v-for="creator in comic.creators">
                            <ComicCreator v-bind:persons="persons"/>
                        </div>

                        <!-- publisher -->
                        <b-input-group
                                id="input-group-4"
                                class="pt-2"
                                prepend="publisher"
                                v-if="showPublisher"
                        >

                            <b-form-input
                                    list="list-input-publishers"
                                    id="input-4"
                                    v-model="comic.publisher"
                                    placeholder="Enter publisher name"

                            />
                            <datalist id="list-input-publishers">
                                <option v-for="publisher in publishers" v-bind:key="publisher.id">{{ publisher.name }}</option>
                            </datalist>
                        </b-input-group>

                        <!-- location -->
                        <b-input-group
                                id="input-group-5"
                                class="pt-2"
                                prepend="location"
                                v-if="this.showLocation"
                        >
                            <b-form-input
                                    id="input-5"
                                    v-model="comic.location"
                                    placeholder="Enter location"
                            />
                        </b-input-group>

                        <!-- year -->
                        <b-input-group
                                id="input-group-6"
                                class="pt-2"
                                prepend="year"
                                v-if="showYear"
                        >
                            <b-form-input
                                    id="input-6"
                                    type="number"
                                    v-model="comic.year"
                                    :state="yearState"
                                    placeholder="Enter year"
                            />
                            <b-form-invalid-feedback>Are you sure about the year?</b-form-invalid-feedback>
                        </b-input-group>

                        <!-- edition -->
                        <b-input-group
                                id="input-group-7"
                                class="pt-2"
                                prepend="edition"
                                v-if="showEdition"
                        >
                            <b-form-input
                                    id="input-7"
                                    v-model="comic.edition"
                                    placeholder="Enter edition"
                            />
                        </b-input-group>

                        <b-button-group class="mt-3 float-right">
                            <b-button type="submit" variant="primary">save</b-button>
                            <b-button to="/comics" type="reset" variant="outline-danger">cancel</b-button>
                        </b-button-group>

                    </b-form>

                </b-col>

                <b-col id="json-col">
                    <b-card header="comic.json">
                        <pre class="m-0">{{ $data }}</pre>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>

</template>

<script>
    import Header from "@/components/Header";
    import ComicCreator from "@/components/ComicCreator";

    export default {
        name: "ComicForm",
        components: {
            Header,
            ComicCreator
        },
        computed: {
            titleState() {
                return this.comic.title.length >= 4
            },
            headerText() {
                if (this.comic.id !== 'new') {
                    return 'edit comic: ';
                }
                return 'new comic ...';
            },
            yearState() {
                return (this.comic.year == null || this.comic.year === '') || (this.comic.year > 1950 && this.comic.year < 2099)
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
            }

        },
        data() {
            return {
                comic: {
                    title: '',
                    subTitle: null,
                    creators: [],
                    publisher: null,
                    location: null,
                    year: null,
                    edition: null,
                    metadata: {
                        createdOn: null,
                        createdBy: null,
                        changedOn: null,
                        changedBy: null
                    },
                },
                persons: null,
                publishers: null,
                show: true,
                loading: true,
                errored: false
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                //alert(JSON.stringify(this.comic));
                this.$api
                    .put("/comics/" + this.comic.id, this.comic)
                    .then(response => (this.comic = response.data))
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            },
            addSubtitle() {
                this.comic.subTitle = '';
            },
            addCreator() {
                console.log("TODO: add creator");
            },
            addPublisher() {
                this.comic.publisher = '';
            },
            addLocation() {
                this.comic.location = ''
            },
            addYear() {
                this.comic.year = '';
            },
            addEdition() {
                this.comic.edition = '';
            }
        },
        mounted() {
            // get comic
            this.$api
                .get(this.$route.path)
                .then(response => (this.comic = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
            // get persons
            this.$api
                .get("/persons")
                .then(response => (this.persons = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
            this.$api
                .get("/publishers")
                .then(response => (this.publishers = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        }
    };
</script>
