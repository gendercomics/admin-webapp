<template>
    <b-form-row class="pl-1 pr-1">
        <b-input-group
                class="pt-2"
                prepend="creator"
        >
            <b-form-input
                    list="list-input-creators"
                    placeholder="Enter creator name"
            />

            <datalist id="list-input-creators">
                <option v-for="person in persons" v-bind:key="person.id">{{ person.firstName + ' ' + person.lastName }}</option>
            </datalist>
            <template v-slot:append>
                <b-form-select :options="roles">
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
                roles: ['artist', 'colorist', 'contributor', 'creator', 'editor', 'inker', 'letterer', 'penciller', 'writer']
            }
        },
        methods: {}
    };
</script>

<style lang="scss">
    @import "../styles/styles.scss";
</style>
