<template>
    <b-input-group :prepend="this.label">
        <b-form-select
            :options="this.options"
            value-field="id"
            text-field="name"
            v-model="localValue"
        />
        <template v-slot:append v-if="removable">
            <b-button @click="deleteValue"
                ><font-awesome-icon icon="times-circle"
            /></b-button>
        </template>
    </b-input-group>
</template>

<script>
export default {
    name: 'SelectField',
    props: {
        label: null,
        modelValue: null,
        options: null,
        selected: null,
        removable: {
            type: Boolean,
            default: false,
        },
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
    },
    methods: {
        deleteValue() {
            this.$log.debug('delete ' + this.label);
            this.localValue = null;
        },
    },
    created() {
        if (this.selected !== null) {
            this.$emit('update:modelValue', this.selected);
        }
    },
};
</script>
