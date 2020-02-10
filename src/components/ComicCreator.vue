<template>
    <b-form-row class="pl-1 pr-1">
        <b-input-group
                class="pt-2"
                prepend="creator"
        >
            <b-form-input
                    list="list-input-creators"
                    placeholder="Enter creator name"
                    v-model="this.person"
                    @change="personUpdated"
            />
            <datalist id="list-input-creators">
                <option v-for="person in persons" v-bind:key="person.id">{{ person.firstName + ' ' + person.lastName }}</option>
            </datalist>
            <template v-slot:append>
                <b-form-select :options="roles" v-model="role" @change="roleUpdated">
                    <option value="" disabled>-- Please select a role --</option>
                </b-form-select>
            </template>
        </b-input-group>
    </b-form-row>

</template>

<script>
    export default {
        name: "ComicCreator",
        props: {
            persons: null
        },
        data: function () {
            return {
                roles: ['artist', 'colorist', 'contributor', 'creator', 'editor', 'inker', 'letterer', 'penciller', 'writer'],
                role: null,
                person: null
            }
        },
        methods: {
            updateCreators: function() {
                console.log('selected: ' + this.selected);
            },
            roleUpdated: function () {
                console.log('selectedRole:' + this.role);
            },
            personUpdated: function () {
                //console.log('selectedPerson:' + this.person);
                //this.persons.forEach(element => this.selectPerson(element));
            },
            selectPerson(person) {
                console.log("person=" + person);
                // TODO iterate persons and select the right one or take the entered name


            }
        }
    };
</script>

<style lang="scss">
    @import "../styles/styles.scss";
</style>
