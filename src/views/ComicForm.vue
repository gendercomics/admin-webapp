<template>
    <div class="text-left">
        <Header/>

        <div class="ml-1 p-2 text-primary">
            <h2>{{ headerText }}</h2>
        </div>

        <b-container fluid>
            <b-form @submit="onSubmit" v-if="show">
                <b-form-group
                        id="input-group-1"
                        label="title:"
                        label-for="input-1"
                >
                    <b-form-input
                            id="input-1"
                            v-model="comic.title"
                            required
                            placeholder="Enter title"
                            :state="titleState"
                    ></b-form-input>
                    <b-form-invalid-feedback>Enter at least 4 characters</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group
                        id="input-group-2"
                        label="subtitle:"
                        label-for="input-2"
                >
                    <b-form-input
                            id="input-2"
                            v-model="comic.subTitle"
                            placeholder="Enter subtitle"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        id="input-group-3"
                        label="creator(s):"
                        label-for="input-3">
                    <b-form-input
                            id="input-3"
                            v-model="comic.creator"
                            placeholder="Enter creator name"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-4" label="publisher:" label-for="input-4">
                    <b-form-select
                            id="input-4"
                            v-model="comic.publisher"
                            :options="publishers"
                    ></b-form-select>
                </b-form-group>

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

            <b-card class="mt-3" header="Form Data Result">
                <pre class="m-0">{{ comic }}</pre>
            </b-card>

        </b-container>
    </div>

</template>

<script>
    import Header from "@/components/Header";

    export default {
        name: "ComicForm",
        components: {
            Header
        },
        computed: {
            titleState() {
                return this.comic.title.length >= 4 ? true : false
            },
            headerText() {
                if (this.comic.id != 'new') {
                    return 'edit comic ...';
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
                errored: false
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                //alert(JSON.stringify(this.comic));
                this.$api
                    .patch("/comics/" + this.comic.id, this.comic)
                    .then(response => (this.comic = response.data))
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
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
