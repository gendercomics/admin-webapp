<template>
    <div>
        <b-form-row class="pl-1 pr-1 w-100">
            <b-input-group class="pt-2">
                <!-- role -->
                <div
                    v-for="(role, idx) in localValue.roles"
                    v-bind:key="role.id"
                >
                    <b-form-select
                        v-model="localValue.roles[idx]"
                        :options="roleOptions"
                        text-field="value.name"
                        style="background-color: #E4E7EB;"
                    >
                    </b-form-select>
                </div>

                <b-button
                    variant="secondary"
                    v-if="localValue.roles.length > 1"
                    @click="removeLastRole"
                    ><font-awesome-icon icon="backspace"
                /></b-button>

                <!-- add role -->
                <b-button variant="secondary" @click="addRole"
                    ><font-awesome-icon icon="plus"
                /></b-button>

                <!-- name -->
                <b-dropdown
                    no-flip
                    variant="outline-secondary"
                    :text="fullName(this.localValue.name)"
                >
                    <b-dropdown-form @submit.stop.prevent="() => {}">
                        <b-form-group
                            style="min-width: 15em;"
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
                            {{ fullName(option) }}
                        </b-dropdown-item-button>
                        <b-dropdown-text v-if="availableOptions.length === 0">
                            no creator available to select
                        </b-dropdown-text>
                    </div>
                </b-dropdown>

                <!-- remove button -->
                <template v-slot:append v-if="removable">
                    <b-button @click="removeValue"
                        ><font-awesome-icon icon="times-circle"
                    /></b-button>
                </template>
            </b-input-group>
        </b-form-row>

    </div>
</template>

<script>
import RoleService from '@/mixins/roleservice';
import PersonService from '@/mixins/personservice';

export default {
    name: 'ComicCreator',
    mixins: [PersonService, RoleService],
    props: {
        value: {
            name: {},
            role: {
                id: null,
            },
            roles: [],
        },
        removable: {
            type: Boolean,
            default: false,
        },
    },
    data: function() {
        return {
            roleOptions: [],
            names: [],
            search: '',
            loading: true,
        };
    },
    mounted() {
        this.loadRoles();
        this.loadCreators();
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
                return 'no creator matching your search criteria';
            }
            return '';
        },
    },
    methods: {
        roleUpdated(idx) {
            this.$log.debug('idx=' + idx);
            this.roleOptions.forEach(role => {
                if (role.id === this.localValue.roles[idx].id) {
                    this.localValue.roles[idx] = role;
                }
            });
        },
        removeValue() {
            this.$log.debug('remove creator');
            this.$emit('remove', this.localValue);
        },
        fullName(creatorName) {
            if (creatorName.name != null) {
                return creatorName.name;
            }
            if (creatorName.firstName != null && creatorName.lastName != null) {
                return creatorName.firstName + ' ' + creatorName.lastName;
            }
            return '-- please select --';
        },
        onOptionClick(option) {
            this.$log.debug(
                'id=' + option.id + ', fullName=' + this.fullName(option)
            );
            this.localValue.name = option;
            this.search = '';
        },
        addRole() {
            this.$log.debug('addRole');
            this.localValue.roles.push({ id: null });
        },
        removeLastRole() {
            this.$log.debug('removeLastRole');
            this.localValue.roles.splice(this.localValue.roles.length - 1, 1);
        },
    },
};
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
