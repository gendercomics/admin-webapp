<template>
    <b-navbar toggleable="lg" data-bs-theme="dark" variant="dark" sticky="top">
        <b-navbar-brand to="/">GenderComics</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item to="/comics">Comics</b-nav-item>
                <b-nav-item to="/persons">Persons</b-nav-item>
                <b-nav-item to="/publishers">Publishers</b-nav-item>
                <b-nav-item to="/keywords">Keywords</b-nav-item>
                <b-nav-item-dropdown text="more">
                    <b-dropdown-item to="/roles">Roles</b-dropdown-item>
                    <b-dropdown-item to="/predicates"
                        >Predicates</b-dropdown-item
                    >
                </b-nav-item-dropdown>
                <b-nav-item-dropdown text="NEW">
                    <b-dropdown-item to="/comics/new">comic</b-dropdown-item>
                    <b-dropdown-item to="/persons/new">person</b-dropdown-item>
                    <b-dropdown-item to="/publishers/new"
                        >publisher</b-dropdown-item
                    >
                    <b-dropdown-item to="/keywords/new"
                        >keyword</b-dropdown-item
                    >
                </b-nav-item-dropdown>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ms-auto">
                <b-form-select v-model="language">
                    <b-form-select-option value="de">de</b-form-select-option>
                    <b-form-select-option value="en">en</b-form-select-option>
                </b-form-select>

                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template v-slot:button-content>
                        <font-awesome-icon icon="user-circle" size="lg" />
                    </template>
                    <b-dropdown-item href="#" disabled>profile</b-dropdown-item>
                    <b-dropdown-item to="/logout">logout</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import { useComicListStore } from '../stores/comicListStore';

export default {
    name: 'Header',
    setup() {
        return { store: useComicListStore() };
    },
    computed: {
        language: {
            get() {
                return this.store.language;
            },
            set(val) {
                this.store.language = val;
            },
        },
    },
};
</script>
