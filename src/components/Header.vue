<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark" sticky>
            <b-navbar-brand to="/">GenderComics</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/comics">Comics</b-nav-item>
                    <b-nav-item to="/persons">Persons</b-nav-item>
                    <b-nav-item to="/publishers">Publishers</b-nav-item>
                    <b-nav-item to="/roles">Roles</b-nav-item>
                    <b-nav-item to="/keywords">Keywords</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <!--
                    <b-nav-form>
                        <b-form-input size="sm" class="mr-sm-2" placeholder="not implemented yet" disabled></b-form-input>
                        <b-button size="sm" class="my-2 my-sm-0" type="submit" disabled>Search</b-button>
                    </b-nav-form>
                    -->
                    <b-form-select
                            v-model="language"
                    >
                        <b-form-select-option value="de"
                            >de</b-form-select-option
                        >
                        <b-form-select-option value="en"
                            >en</b-form-select-option
                        >
                    </b-form-select>

                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <em>User</em>
                        </template>
                        <b-dropdown-item href="#" disabled
                            >profile</b-dropdown-item
                        >
                        <b-dropdown-item to="logout">logout</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { getters, mutations } from '../services/store';

export default {
    name: 'Header',
    computed: {
        language: {
            get() {
                return getters.language();
            },
            set(val) {
                mutations.setLanguage(val)
            },
        },
    },
    methods: {
        changeLanguage(lang) {
            mutations.setLanguage(lang);
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
