<template>
    <b-form-row class="pl-1 pr-1">
        <b-input-group class="pt-2" prepend="creator">
            <b-form-select
                id="select-person"
                v-model="person"
                @change="personUpdated()"
            >
                <option
                    v-for="person in persons"
                    v-bind:key="person.id"
                    :value="person.id"
                    >{{ fullName(person) }}</option
                >
            </b-form-select>

            <template v-slot:append>
                <b-form-select
                    :options="roles"
                    v-model="role"
                    value-field="id"
                    text-field="name"
                    @change="roleUpdated"
                >
                    <!--<option value="" disabled>-- Please select a role --</option>-->
                </b-form-select>
            </template>
        </b-input-group>
    </b-form-row>
</template>

<script>
export default {
    name: 'ComicCreator',
    props: {
        persons: null,
        roles: [],
    },
    data: function() {
        return {
            role: null,
            person: null,
        };
    },
    mounted() {},
    methods: {
        roleUpdated: function() {
            console.log('selectedRole:' + this.role);
        },
        personUpdated: function() {
            console.log('selectedPerson:' + this.person);
            this.$emit('changed', this.person);
        },
        fullName(person) {
            if (person.pseudonym !== null) return person.pseudonym;
            return person.firstName + ' ' + person.lastName;
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
