<template>
    <b-dropdown
        variant="outline-secondary"
        no-flip
        :text="displayName(localValue.nameForWebAppList)"
    >
        <b-dropdown-form @submit.stop.prevent="() => {}">
            <b-form-group
                style="min-width: 15em"
                class="mb-0"
                :description="searchDesc"
            >
                <b-input-group>
                    <b-input-group-prepend is-text>
                        <font-awesome-icon icon="search" />
                    </b-input-group-prepend>

                    <b-form-input
                        v-model="search"
                        type="search"
                        size="sm"
                        autocomplete="off"
                    ></b-form-input>
                </b-input-group>
            </b-form-group>
        </b-dropdown-form>
        <b-dropdown-divider />
        <div style="max-height: 20em; overflow-y: auto">
            <b-dropdown-item-button
                v-for="option in availableOptions"
                :key="option.id"
                @click="onOptionClick(option)"
            >
                {{ option.nameForWebAppList }}
            </b-dropdown-item-button>
            <b-dropdown-text v-if="availableOptions.length === 0">
                no value available to select
            </b-dropdown-text>
        </div>
    </b-dropdown>
</template>

<script>
import { httpClient } from '@/services/httpclient';

export default {
    name: 'SearchableDropdown',
    props: {
        value: null,
        optionsPath: null,
        displayProperty: null,
    },
    data: function() {
        return {
            options: [],
            search: '',
            loading: false,
        };
    },
    computed: {
        localValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        criteria() {
            // Compute the search criteria
            return this.search.trim().toLowerCase();
        },
        availableOptions() {
            const criteria = this.criteria;
            if (criteria) {
                this.$log.debug('criteria=' + criteria);
                return this.options.filter(
                    opt =>
                        opt.nameForWebAppList.toLowerCase().indexOf(criteria) >
                        -1
                );
            }
            // Show all options available
            return this.options;
        },
        searchDesc() {
            if (this.criteria && this.availableOptions.length === 0) {
                return 'no keywords matching your search criteria';
            }
            return '';
        },
    },
    mounted() {
        this.loadOptions();
    },
    methods: {
        onOptionClick(option) {
            this.$log.debug(
                'id=' + option.id + ', name=' + option.nameForWebAppList
            );
            this.localValue = option;
            this.search = '';
        },
        loadOptions() {
            // get publishers
            httpClient
                .get(this.optionsPath)
                .then(response => (this.options = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        displayName(name) {
            if (name != null && name.length > 0) {
                return name;
            }
            return '-- please select --';
        },
    },
};
</script>

<style scoped></style>
