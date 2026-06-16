<template>
    <b-dropdown
        variant="outline-secondary"
        no-flip
        :text="displayName(this.localValue)"
    >
        <b-dropdown-form @submit.stop.prevent="() => {}">
            <b-form-group
                style="min-width: 15em"
                class="mb-0"
                :description="searchDesc"
            >
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text>
                            <font-awesome-icon icon="search" />
                        </b-input-group-text>
                    </template>

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
                {{ displayName(option) }}
            </b-dropdown-item-button>
            <b-dropdown-text v-if="availableOptions.length === 0">
                no value available to select
            </b-dropdown-text>
        </div>
    </b-dropdown>
</template>

<script>
import { httpClient } from '@/services/httpclient';
import { useComicListStore } from '@/stores/comicListStore';

export default {
    name: 'SearchableDropdown',
    props: {
        modelValue: null,
        optionsPath: null,
        displayProperty: null,
    },
    setup() {
        return { store: useComicListStore() };
    },
    data: function () {
        return {
            options: [],
            search: '',
            loading: false,
        };
    },
    computed: {
        localValue: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit('update:modelValue', val);
            },
        },
        language() {
            return this.store.language;
        },
        criteria() {
            // Compute the search criteria
            return this.search.trim().toLowerCase();
        },
        availableOptions() {
            const criteria = this.criteria;
            if (criteria) {
                //this.$log.debug('criteria=' + criteria);
                return this.options.filter(
                    (opt) =>
                        this.displayName(opt).toLowerCase().indexOf(criteria) >
                        -1
                );
            }
            // Show all options available
            return this.options;
        },
        searchDesc() {
            if (this.criteria && this.availableOptions.length === 0) {
                return 'no match for your search criteria';
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
                'id=' + option.id + ', name=' + this.displayName(option)
            );
            this.localValue = option;
            this.search = '';
        },
        loadOptions() {
            // get publishers
            httpClient
                .get(this.optionsPath)
                .then((response) => (this.options = response.data))
                .catch((error) => {
                    this.$log.error(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        displayName(item) {
            this.$log.debug(JSON.stringify(item));
            if (
                item !== null &&
                item !== '' &&
                item.displayNames[this.language] != null
            ) {
                return item.displayNames[this.language];
            }
            return '-- please select --';
        },
    },
};
</script>

<style scoped></style>
