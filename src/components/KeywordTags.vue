<template>
    <div class="mt-2">
        <b-form-group>
            <b-input-group>
                <b-form-tags
                    :value="value"
                    @input="$emit('input', $event)"
                    no-outer-focus
                    class="mb-2"
                >
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
                                        :key="option"
                                        @click="
                                            onOptionClick({
                                                option,
                                                addTag,
                                            })
                                        "
                                    >
                                        {{ option }}
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
                                    class="list-inline d-inline-block ml-1"
                                >
                                    <li
                                        v-for="tag in tags"
                                        :key="tag"
                                        class="list-inline-item"
                                    >
                                        <b-form-tag
                                            @remove="removeTag(tag)"
                                            :title="tag"
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
                    <b-button @click="deleteValue" class="mb-2"
                        ><font-awesome-icon icon="times-circle"
                    /></b-button>
                </template>
            </b-input-group>
        </b-form-group>
    </div>
</template>

<script>
import { httpClient } from '../services/httpclient';

export default {
    name: 'KeywordTags',
    props: {
        label: null,
        value: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: 'content',
        },
    },
    data: function() {
        return {
            search: '',
            loading: true,
            keywordOptions: [],
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
                opt => this.value.indexOf(opt) === -1
            );
            if (criteria) {
                // Show only options that match criteria
                return options.filter(
                    opt => opt.toLowerCase().indexOf(criteria) > -1
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
        options() {
            let list = [];
            this.keywordOptions.forEach(function(item) {
                list.push(item.name);
            });
            return list;
        },
        localValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
    },
    methods: {
        onOptionClick({ option, addTag }) {
            addTag(option);
            this.search = '';
        },
        deleteValue() {
            this.$log.debug('delete ' + this.label);
            this.localValue = null;
        },
        loadOptions() {
            httpClient
                .get('/keywords?type=' + this.type)
                .then(response => (this.keywordOptions = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
    },
    mounted() {
        this.loadOptions();
        /*
        this.keywordOptions.forEach(function(item) {
            this.options.push(item.name);
        });
         */
    },
};
</script>
