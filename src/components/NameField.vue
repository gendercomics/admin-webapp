<template>
    <b-input-group :size="size">
        <template #prepend>
            <b-input-group-text>{{ label }}</b-input-group-text>
            <b-form-select v-model="nameType" style="background-color: #e9ecef">
                <b-form-select-option value="firstLastName"
                    >firstname/lastname</b-form-select-option
                >
                <b-form-select-option value="name">name</b-form-select-option>
            </b-form-select>
        </template>

        <b-form-input
            v-if="!isPersonName"
            v-model="localValue.name"
            :disabled="disabled"
        />

        <b-form-input
            v-if="isPersonName"
            v-model="localValue.firstName"
            :disabled="disabled"
        />

        <b-form-input
            v-if="isPersonName"
            v-model="localValue.lastName"
            :disabled="disabled"
        />

        <template #append>
            <b-input-group-text>
                <b-form-checkbox
                    switch
                    v-b-tooltip.hover
                    title="pseudonym"
                    v-model="localValue.pseudonym" />
                <font-awesome-icon icon="user-secret" />
            </b-input-group-text>
            <b-input-group-text>
                <b-form-checkbox
                    switch
                    v-b-tooltip.hover
                    title="searchable"
                    v-model="localValue.searchable" />
                <font-awesome-icon icon="search" />
            </b-input-group-text>
            <b-button v-if="removable" @click="deleteValue"
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
        modelValue: {
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
                return this.modelValue;
            },
            set(val) {
                this.$emit('update:modelValue', val);
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
