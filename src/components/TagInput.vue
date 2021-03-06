<template>
    <div class="mt-2">
        <b-form-group class="mb-0">
            <b-input-group>
                <b-form-tags v-model="localValue" no-outer-focus>
                    <template v-slot="{ tags, disabled, addTag, removeTag }">
                        <b-row>
                            <b-col class="col-sm-3">
                                <b-dropdown
                                    size="sm"
                                    variant="outline-secondary"
                                    block
                                    menu-class="w-100"
                                >
                                    <template v-slot:button-content>
                                        <font-awesome-icon icon="tags" />
                                        {{ label }}
                                    </template>

                                    <b-dropdown-form
                                        @submit.stop.prevent="() => {}"
                                    >
                                        <b-form-group
                                            style="min-width: available"
                                            class="mb-0"
                                            :description="searchDesc"
                                            :disabled="disabled"
                                        >
                                            <b-input-group>
                                                <b-input-group-prepend is-text>
                                                    <font-awesome-icon
                                                        icon="search"
                                                    />
                                                </b-input-group-prepend>

                                                <b-form-input
                                                    v-model="search"
                                                    id="tag-search-input"
                                                    type="search"
                                                    size="sm"
                                                    autocomplete="off"
                                                ></b-form-input>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-dropdown-form>
                                    <b-dropdown-divider></b-dropdown-divider>
                                    <b-dropdown-item-button
                                        v-for="option in availableOptions"
                                        :key="option.id"
                                        @click="
                                            onOptionClick({
                                                option,
                                                addTag,
                                            })
                                        "
                                    >
                                        {{ option.values[language].name }}
                                    </b-dropdown-item-button>
                                    <b-dropdown-text
                                        v-if="availableOptions.length === 0"
                                    >
                                        no keywords available to select
                                    </b-dropdown-text>
                                </b-dropdown>
                            </b-col>

                            <b-col class="pl-0 pb-0">
                                <ul
                                    v-if="tags.length > 0"
                                    class="list-inline d-inline-block ml-1 mb-0"
                                >
                                    <li
                                        v-for="tag in tagNames"
                                        :key="tag"
                                        class="list-inline-item"
                                    >
                                        <b-form-tag
                                            @remove="
                                                onTagRemoved({ tag, removeTag })
                                            "
                                            :title="tag.name"
                                            :disabled="disabled"
                                            variant="secondary"
                                            >{{ tag }}</b-form-tag
                                        >
                                    </li>
                                </ul>
                            </b-col>
                        </b-row>
                    </template>
                </b-form-tags>

                <template v-slot:append>
                    <b-button @click="deleteValue"
                        ><font-awesome-icon icon="times-circle"
                    /></b-button>
                </template>
            </b-input-group>
        </b-form-group>

        <!--
        <b-row class="mt-4">
            <b-col id="json-tagnames">
                <b-card header="tagnames">
                    <pre class="mt-0"> {{tagNames}}</pre>
                </b-card>
            </b-col>
        </b-row>
        -->
    </div>
</template>

<script>
import { httpClient } from '../services/httpclient';
import { getters } from '../services/store';

export default {
    name: 'TagInput',
    props: {
        label: null,
        value: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: () => 'content',
        },
    },
    data: function() {
        return {
            tagNames: [],
            options: [],
            search: '',
            loading: true,
        };
    },
    computed: {
        criteria() {
            // Compute the search criteria
            return this.search.trim().toLowerCase();
        },
        availableOptions() {
            const criteria = this.criteria;
            // Filter out already selected options
            const options = this.options.filter(
                opt =>
                    this.tagNames.indexOf(opt.values[this.language].name) === -1
            );
            if (criteria) {
                // Show only options that match criteria
                return options.filter(
                    opt =>
                        opt.values[this.language].name
                            .toLowerCase()
                            .indexOf(criteria) > -1
                );
            }
            // Show all options available
            return options;
        },
        searchDesc() {
            if (this.criteria && this.availableOptions.length === 0) {
                return 'no keywords matching your search criteria';
            }
            return '';
        },
        localValue: {
            get() {
                return this.mappedTags;
            },
            set() {
                this.$emit('input', this.mappedTags);
            },
        },
        mappedTags: function() {
            return this.options.filter(option =>
                this.tagNames.includes(option.values[this.language].name)
            );
        },
        language() {
            return getters.language();
        },
    },
    methods: {
        onOptionClick({ option, addTag }) {
            this.$log.debug(
                'option clicked: ' +
                    option.id +
                    '::' +
                    option.values[this.language].name
            );
            addTag(option.values[this.language].name);
            this.tagNames.push(option.values[this.language].name);
            this.search = '';
        },
        onTagRemoved({ tag, removeTag }) {
            removeTag(tag);
            this.tagNames.splice(this.tagNames.indexOf(tag), 1);
            this.$emit('input', this.mappedTags);
        },
        deleteValue() {
            this.$log.debug('delete ' + this.label);
            this.$emit('input', null);
        },
        loadOptions() {
            httpClient
                .get('/keywords?type=' + this.type)
                .then(response => (this.options = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        initTagNames() {
            this.value.forEach(value => {
                this.tagNames.push(value.values[this.language].name);
            });
        },
    },
    watch: {
        language: function() {
            this.$log.debug('language changed:' + this.language);
            this.tagNames = [];
            this.initTagNames();
        },
    },
    created() {
        this.loadOptions();
        this.initTagNames();
    },
};
</script>
