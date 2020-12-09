<template>
    <b-input-group :prepend="this.label" :size="this.size">
        <b-input-group-prepend>
            <b-form-select v-model="nameType" style="background-color: #e9ecef">
                <b-form-select-option value="firstLastName"
                    >firstname/lastname</b-form-select-option
                >
                <b-form-select-option value="name">name</b-form-select-option>
            </b-form-select>
        </b-input-group-prepend>

        <b-form-input
            v-if="!isPersonName"
            v-model="localValue.name"
            :disabled="this.disabled"
        />

        <b-form-input
            v-if="isPersonName"
            v-model="localValue.firstName"
            :disabled="this.disabled"
        />

        <b-form-input
            v-if="isPersonName"
            v-model="localValue.lastName"
            :disabled="this.disabled"
        />

        <b-input-group-append is-text>
            <b-form-checkbox
                switch
                v-b-tooltip.hover
                title="pseudonym"
                v-model="localValue.pseudonym"/>
            <font-awesome-icon icon="user-secret"
        /></b-input-group-append>

        <b-input-group-append is-text>
            <b-form-checkbox
                switch
                v-b-tooltip.hover
                title="searchable"
                v-model="localValue.searchable"/>
            <font-awesome-icon icon="search"
        /></b-input-group-append>

        <!-- remove button -->
        <template v-slot:append v-if="removable">
            <b-button @click="deleteValue"
                ><font-awesome-icon icon="times-circle"
            /></b-button>
        </template>
    </b-input-group>
</template>

<script>
export default {
    name: 'NameField',
    props: {
        label: null,
        value: {
            name: null,
            firstName: null,
            lastName: null,
            pseudonym: null,
            searchable: true,
        },
        removable: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: 'md',
        },
    },
    data() {
        return {
            nameType: 'firstLastName',
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
        isPersonName() {
            return this.nameType === 'firstLastName';
        },
    },
    mounted() {
        if (this.localValue.name !== null) {
            this.nameType = 'name';
        }
    },
    methods: {
        deleteValue() {
            this.$log.debug('delete name');
            this.localValue = null;
            this.$emit('delete');
        },
    },
};
</script>
