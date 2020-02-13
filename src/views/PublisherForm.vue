<template>
    <div class="text-left">
        <Header/>
        <b-container fluid class="mt-4 ml-4 mr-4">

            <b-row>
                <b-form
                        id="publisher-form"
                        v-if="show"
                >
                    <div>
                        <b-card
                                bg-variant="light"
                                header="add a new publisher"
                                style="min-width: 50rem"
                        >
                            <b-card-body>

                                <b-row>
                                    <b-col>
                                        <b-form-group
                                                label-cols-sm="2"
                                                label="name:"
                                                label-align-sm="right"
                                                label-for="name"
                                        >
                                            <b-form-input
                                                    id="name"
                                                    v-model="publisher.name"
                                                    placeholder="enter publisher name"
                                                    trim
                                                    style="max-width: 25rem"
                                            ></b-form-input>
                                        </b-form-group>

                                        <b-form-group
                                                label-cols-sm="2"
                                                label="url:"
                                                label-align-sm="right"
                                                label-for="url"
                                        >
                                            <b-form-input
                                                    id="url"
                                                    type="url"
                                                    v-model="publisher.url"
                                                    placeholder="enter publisher url"
                                                    trim
                                                    style="max-width: 25rem"></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                                <b-row class="mt-2">
                                    <b-col>
                                        <b-button-group class="float-right">
                                            <b-button type="submit" variant="primary" @click.stop.prevent.submit()="onSubmit">save</b-button>
                                            <b-button to="/publishers" type="reset" variant="outline-danger">cancel</b-button>
                                        </b-button-group>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                    </div>

                </b-form>

            </b-row>

            <div v-if="debug">
                <b-row class="mt-4 mr-4">
                    <b-col id="json-publisher">
                        <b-card header="publisher">
                            <pre class="mt-0">{{ $data.publisher }}</pre>
                        </b-card>
                    </b-col>
                </b-row>
            </div>

        </b-container>

    </div>
</template>

<script>
  import Header from "@/components/Header";

  export default {
    name: "PublisherForm",
    components: {
      Header
    },
    data() {
      return {
        publisher: {
          name: null,
          url: null
        },
        show: true,
        errored: false,
        debug: false
      };
    },
    mounted() {
      // get role
      if (!this.$route.path.endsWith("new")) {
        this.$api
          .get(this.$route.path)
          .then(response => {
            this.publisher = response.data;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        if (this.$route.path.endsWith("new")) {
          this.$api
            .post("/publishers/", this.publisher)
            .then(response => (this.publisher = response.data, this.$router.push("/publishers")))
            .catch(error => {
              console.log(error);
              this.errored = true;
            });
        } else {
          this.$api
            .put("/publishers/" + this.publisher.id, this.publisher)
            .then(response => (this.publisher = response.data, this.$router.push("/publishers")))
            .catch(error => {
              console.log(error);
              this.errored = true;
            });
        }
      }
    }
  };
</script>
