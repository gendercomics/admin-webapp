<template>
    <div>
        <b-form-row class="pl-1 pr-1">
            <b-input-group class="pt-2">
                <!-- role -->
                <b-form-select
                    :options="roles"
                    v-model="role"
                    value-field="id"
                    text-field="name"
                    style="background-color: #E4E7EB; max-width: 15%"
                >
                    <!--<option value="" disabled>-- Please select a role --</option>-->
                </b-form-select>

                <!-- name -->
                <b-dropdown variant="outline-secondary" block>
                    <b-dropdown-form @submit.stop.prevent="() => {}">
                        <b-form-group
                            style="min-width: available"
                            class="mb-0"
                            :description="searchDesc"
                        >
                            <b-input-group>
                                <b-input-group-prepend is-text>
                                    <font-awesome-icon icon="search" />
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
                        @click="onOptionClick(option)"
                    >
                        {{ fullName(option) }}
                    </b-dropdown-item-button>
                    <b-dropdown-text v-if="availableOptions.length === 0">
                        no creator available to select
                    </b-dropdown-text>
                </b-dropdown>

                <!-- remove button -->
                <template v-slot:append v-if="removable">
                    <b-button @click="removeValue"
                        ><font-awesome-icon icon="times-circle"
                    /></b-button>
                </template>
            </b-input-group>
        </b-form-row>

        <div>
            <b-row class="mt-4">
                <b-col id="json">
                    <b-card header="localValue">
                        <pre class="mt-0">{{ localValue }}</pre>
                    </b-card>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import RoleService from '@/mixins/roleservice';
import PersonService from '@/mixins/personservice';

export default {
    name: 'ComicCreator',
    mixins: [PersonService, RoleService],
    props: {
        creator: {
            name: {},
            role: {},
        },
        removable: {
            type: Boolean,
            default: false,
        },
    },
    data: function() {
        return {
            role: 'artist',
            roles: [],
            names: [],
            name: null,
            search: '',
            loading: true,
            tagNames: [],
        };
    },
    mounted() {
        this.loadRoles();
        this.loadCreators();
    },
    computed: {
        localValue: {
            get() {
                return this.creator;
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
                return this.names.filter(
                    opt =>
                        this.fullName(opt)
                            .toLowerCase()
                            .indexOf(criteria) > -1
                );
            }
            // Show all options available
            return this.names;
        },
        searchDesc() {
            if (this.criteria && this.availableOptions.length === 0) {
                return 'no keywords matching your search criteria';
            }
            return '';
        },
    },
    methods: {
        roleChanged: function() {
            console.log('selectedRole:' + this.role);
        },
        personUpdated: function() {
            console.log('selectedPerson:' + this.name);
            this.$emit('changed', this.name);
        },
        removeValue() {
            this.$log.debug('remove creator');
            this.localValue = null;
        },
        fullName(creatorName) {
            if (creatorName.name != null) {
                return creatorName.name;
            }
            return creatorName.firstName + ' ' + creatorName.lastName;
        },
        onOptionClick(option) {
            this.$log.debug('option clicked: ' + option.id);
            this.search = '';
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
