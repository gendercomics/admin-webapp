<template>
    <div class="text-left">
        <Header/>

        <b-col lg="6" class="mt-3">
            <b-button to="roles/new" variant="outline-primary">new role</b-button>
        </b-col>

        <RolesList/>

    </div>
</template>

<script>
  import Header from "@/components/Header";
  import RolesList from "@/components/RolesList";

  export default {
    name: "roles",
    components: {
      RolesList,
      Header
    },
    data() {
      return {
        role: {
          name: null,
          description: null
        },
        show: true,
        errored: false,
        debug: true
      };
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        this.$api
          .post("/roles/", this.role)
          .then(response => (this.role = response.data))
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    }
  };
</script>