<template>
    <b-input-group :prepend="this.label">
        <b-form-textarea
            v-model="localValue"
            :rows="this.rows"
            placeholder="write something ..."
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
    name: 'InputField',
    props: {
        label: null,
        value: null,
        rows: {
            type: Number,
            default: 2,
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
