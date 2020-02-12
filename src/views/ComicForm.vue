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
                        <b-button :variant="publisherBtnVariant" @click="addPublisher" :disabled="this.showPublisher">publisher</b-button>
                        <b-button :variant="locationBtnVariant" @click="addLocation" :disabled="this.showLocation">location</b-button>
                        <b-button :variant="yearBtnVariant" @click="addYear" :disabled="this.showYear">year</b-button>
                        <b-button :variant="editionBtnVariant" @click="addEdition" :disabled="this.showEdition">edition</b-button>
                        <b-button :variant="linkBtnVariant" @click="addLink" :disabled="this.showLink">link</b-button>
                        <b-button :variant="isbnBtnVariant" @click="addIsbn" :disabled="this.showIsbn">isbn</b-button>
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
                            <b-form-invalid-feedback>Enter at least 4 characters</b-form-invalid-feedback>
                        </b-input-group>

                        <!-- subtitle -->
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
                            <ComicCreator v-bind:key="creator.id" v-bind:persons="persons" v-on:input="updateValue($event.target.value)"/>
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

                        <!-- isbn -->
                        <b-input-group
                                id="input-group-link"
                                class="pt-2"
                                prepend="link"
                                label-for="input-link"
                                v-if="showLink"
                        >
                            <b-form-input
                                    id="input-link"
                                    v-model="comic.link"
                                    placeholder="Enter link"
                            />
                        </b-input-group>

                        <!-- isbn -->
                        <b-input-group
                                id="input-group-isbn"
                                class="pt-2"
                                prepend="isbn"
                                label-for="input-isbn"
                                v-if="showIsbn"
                        >
                            <b-form-input
                                    id="input-isbn"
                                    v-model="comic.isbn"
                                    placeholder="Enter ISBN"
                            />
                        </b-input-group>

                        <b-button-group class="mt-3 float-right">
                            <b-button type="submit" variant="primary">save</b-button>
                            <b-button to="/comics" type="reset" variant="outline-danger">cancel</b-button>
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
        return this.comic.title.length >= 4;
      },
      yearState() {
        return (this.comic.year == null || this.comic.year === "") || (this.comic.year > 1950 && this.comic.year < 2099);
      },
      subtitleBtnVariant() {
        if (!this.showSubtitle) return "outline-dark";
        return "dark";
      },
      publisherBtnVariant() {
        if (!this.showPublisher) return "outline-dark";
        return "dark";
      },
      locationBtnVariant() {
        if (!this.showLocation) return "outline-dark";
        return "dark";
      },
      yearBtnVariant() {
        if (!this.showYear) return "outline-dark";
        return "dark";
      },
      editionBtnVariant() {
        if (!this.showEdition) return "outline-dark";
        return "dark";
      },
      linkBtnVariant() {
        if (!this.showLink) return "outline-dark";
        return "dark";
      },
      isbnBtnVariant() {
        if (!this.showIsbn) return "outline-dark";
        return "dark";
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
      }
    },
    data() {
      return {
        comic: {
          title: "",
          subTitle: null,
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
            changedBy: null
          }
        },
        persons: null,
        publishers: null,
        show: true,
        loading: true,
        errored: false,
        selectedPublisher: null
      };
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        //alert(JSON.stringify(this.comic));
        if (this.$route.path.endsWith("new")) {
          this.$api
            .post("/comics/", this.comic)
            .then(response => (this.comic = response.data))
            .catch(error => {
              console.log(error);
              this.errored = true;
            })
            .finally(() => (this.loading = false));
        } else {
          this.$api
            .put("/comics/" + this.comic.id, this.comic)
            .then(response => (this.comic = response.data))
            .catch(error => {
              console.log(error);
              this.errored = true;
            })
            .finally(() => (this.loading = false));
        }
      },
      addSubtitle() {
        this.comic.subTitle = "";
      },
      addCreator(person, role) {
        console.log("add creator: " + person.id, role);
        console.log("creators=" + this.comic.creators);
        this.comic.creators.push({ creator: {} });
      },
      addPublisher() {
        this.comic.publisher = "";
      },
      addLocation() {
        this.comic.location = "";
      },
      addYear() {
        this.comic.year = "";
      },
      addEdition() {
        this.comic.edition = "";
      },
      addLink() {
        this.comic.link = "";
      },
      addIsbn() {
        this.comic.isbn = "";
      },
      changePublisher() {
        console.log(this.selectedPublisher);
        this.publishers.forEach(publisher => {
          if (this.selectedPublisher === publisher.id) {
            this.comic.publisher = publisher;
          }
        });
      }
    },
    mounted() {
      // get comic
      if (!this.$route.path.endsWith("new")) {
        this.$api
          .get(this.$route.path)
          .then(response => {
            this.comic = response.data;
            if (this.comic.publisher != null) {
              this.selectedPublisher = this.comic.publisher.id;
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
        .get("/persons")
        .then(response => (this.persons = response.data))
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
      // get publishers
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
