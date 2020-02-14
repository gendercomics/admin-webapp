<template>
    <b-form-row class="pl-1 pr-1">
        <b-input-group
                class="pt-2"
                prepend="creator"
        >
            <b-form-select
                    id="select-person"
                    v-model="person"
                    @change="personUpdated()"
            >
                <option v-for="person in persons" v-bind:key="person.id" :value="person.id">{{ person.firstName + " " + person.lastName}}</option>
            </b-form-select>

            <template v-slot:append>
                <b-form-select
                        :options="roles"
                        v-model="role"
                        value-field="id"
                        text-field="name"
                        @change="roleUpdated">
                    <!--<option value="" disabled>-- Please select a role --</option>-->
                </b-form-select>
            </template>

        </b-input-group>
    </b-form-row>

</template>

<script>
  export default {
    name: "ComicCreator",
    props: {
      persons: null,
      roles: null
    },
    data: function() {
      return {
        role: null,
        person: null
      };
    },
    mounted() {
    },
    methods: {
      updateCreators: function() {
        console.log("selected: " + this.selected);
      },
      roleUpdated: function() {
        console.log("selectedRole:" + this.role);
      },
      personUpdated: function() {
        console.log("selectedPerson:" + this.person);
        //this.persons.forEach(element => this.selectPerson(element));
        this.$emit("changed", this.person);
      },
      selectPerson(personId) {
        console.log("person=" + person);
        this.persons.forEach(person => {
          if (person.id === personId) {
            this.person = person;
          }
        });
      }
    }
  };
</script>

<style lang="scss">
    @import "../styles/styles.scss";
</style>
