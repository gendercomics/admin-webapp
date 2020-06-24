<template>
    <b-input-group :prepend="this.label">
        <b-form-input v-model="localValue" :type="this.type" />
        <template v-slot:append v-if="removable">
            <b-button @click="deleteValue"
                ><font-awesome-icon icon="times-circle"
            /></b-button>
        </template>
    </b-input-group>
</template>

<script>
export default {
    name: 'InputField',
    props: {
        label: null,
        value: null,
        type: null,
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
};
</script>
