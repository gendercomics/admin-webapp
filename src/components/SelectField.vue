<template>
    <b-input-group :prepend="this.label">
        <b-form-select
            id="input-publisher"
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
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
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
            this.value = this.selected;
        }
    },
};
</script>
