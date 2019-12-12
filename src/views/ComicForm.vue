<template>
    <div class="text-left">
        <Header/>

        <b-container class="mt-3" fluid>
            <b-row>
                <b-col id="button-col" cols="1">
                    <b-button-group vertical>
                        <b-button disabled>title</b-button>
                        <b-button :variant="subtitleBtnVariant" @click="addSubtitle" :disabled="showSubtitle">subtitle</b-button>
                        <b-button variant="outline-dark" @click="addCreator">creator+</b-button>
                        <b-button :variant="publisherBtnVariant" @click="addPublisher" :disabled="showPublisher">publisher</b-button>
                        <b-button :variant="locationBtnVariant" @click="addLocation" :disabled="showLocation">location</b-button>
                        <b-button :variant="yearBtnVariant" @click="addYear" :disabled="showYear">year</b-button>
                        <b-button :variant="editionBtnVariant" @click="addEdition" :disabled="showYear">edition</b-button>
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
                            ></b-form-input>
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
                            ></b-form-input>
                        </b-input-group>

                        <!-- creators -->
                        <ComicCreator v-bind:persons="persons"/>
                        <ComicCreator v-bind:persons="persons"/>

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

                            ></b-form-input>
                            <datalist id="list-input-publishers">
                                <option v-for="publisher in publishers" v-bind:key="publisher.id">{{ publisher.name }}</option>
                            </datalist>
                        </b-input-group>

                <!-- location -->
                <b-form-group
                        id="input-group-5"
                        label="location:"
                        label-for="input-5"
                >
                    <b-form-input
                            id="input-5"
                            v-model="comic.location"
                            placeholder="Enter location"
                    ></b-form-input>
                </b-form-group>

                <!-- year -->
                <b-form-group
                        id="input-group-6"
                        label="year:"
                        label-for="input-6"
                >
                    <b-form-input
                            id="input-6"
                            type="number"
                            v-model="comic.year"
                            :state="yearState"
                            placeholder="Enter year"
                    ></b-form-input>
                    <b-form-invalid-feedback>Are you sure about the year?</b-form-invalid-feedback>
                </b-form-group>

                <!-- edition -->
                <b-form-group
                        id="input-group-7"
                        label="edition:"
                        label-for="input-7"
                >
                    <b-form-input
                            id="input-7"
                            v-model="comic.edition"
                            placeholder="Enter edition"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        id="input-group-99"
                        label="status:"
                >
                    <b-form-radio-group v-model="comic.status" id="radiobuttons-99">
                        <b-form-radio value="draft">draft</b-form-radio>
                        <b-form-radio value="review">review</b-form-radio>
                        <b-form-radio value="final">final</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>

                <b-button class="m-1" type="submit" variant="primary">save</b-button>
                <b-button to="/comics" class="m-1" type="reset" variant="outline-danger">cancel</b-button>

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
                return this.comic.title.length >= 4 ? true : false
            },
            headerText() {
                if (this.comic.id != 'new') {
                    return 'edit comic: ';
                }
                return 'new comic ...';
            },
            yearState() {
                return (this.comic.year == null || this.comic.year == '') ||(this.comic.year > 1950 && this.comic.year < 2099)
            }
        },
        data() {
            return {
                comic: {
                    title: '',
                    subTitle: '',
                    creator: '',
                    publisher: null,
                    location: '',
                    year: null,
                    edition: '',
                    metadata: {
                        createdOn: null,
                        createdBy: null,
                        changedOn: null,
                        changedBy: null
                    },
                },
                publishers: [{text: 'Select One', value: null}, 'avant-Verlag', 'Carlsen', 'Reprodukt'],
                status: 'draft',
                show: true,
                loading: true,
                errored: false,
                showSubtitle: false,
                showPublisher: false,
                showLocation: false,
                showYear: false,
                showEdition: false
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
                this.showSubtitle = true;
            },
            addCreator() {
                console.log("TODO: add creator");
            },
            addPublisher() {
                this.showPublisher = true;
            },
            addLocation() {
                this.showLocation = true;
            },
            addYear() {
                this.showYear = true;
            },
            addEdition() {
                this.showEdition = true;
            }
        },
        mounted() {
            console.log("route: " + this.$route.path);
            this.$api
                .get("http://localhost:8001" + this.$route.path)
                .then(response => (this.comic = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        }
    };
</script>
