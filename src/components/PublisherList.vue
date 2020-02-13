<template>
    <div>
        <b-container fluid class="pl-4 pr-4">
            <b-row>
                <b-table
                        class="mt-4"
                        show-empty
                        small
                        striped
                        hover
                        head-variant="dark"
                        bordered
                        :fields="fields"
                        :items="publishers"
                >

                    <template v-slot:cell(actions)="row">
                        <b-button
                                size="sm"
                                @click="edit(row.item)"
                                class="mr-1"
                        >edit
                        </b-button>
                    </template>

                    <template v-slot:cell(metaData.changedOn)="data">
                        <span v-if="moment(data.item.metaData.changedOn).isValid()">{{ moment(data.item.metaData.changedOn).format("DD.MM.YYYY HH:mm") }}</span>
                        <span v-else>{{ moment(data.item.metaData.createdOn).format("DD.MM.YYYY HH:mm") }}</span>
                    </template>

                    <template v-slot:cell(metaData.changedBy)="data">
                        <span v-if="data.item.metaData.changedBy == null">{{ data.item.metaData.createdBy }}</span>
                        <span v-else>{{ data.item.metaData.changedBy }}</span>
                    </template>

                </b-table>
            </b-row>
        </b-container>
    </div>
</template>

<script>
  export default {
    name: "RolesList",
    data() {
      return {
        fields: [
          { key: "actions", label: "actions" },
          { key: "name", label: "name" },
          { key: "url", label: "url" },
          { key: "metaData.changedOn", label: "created/modified" },
          { key: "metaData.changedBy", label: "by" }
        ],
        publishers: null,
        loading: true,
        errored: false
      };
    },
    mounted() {
      this.$api
        .get("/publishers")
        .then(response => (this.publishers = response.data))
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    methods: {
      edit(item) {
        console.log("edit item: " + item.id);
        this.$router.push("/publishers/" + item.id);
      }
    }
  };
</script>

<style lang="scss">
    @import "../styles/styles.scss";
</style>