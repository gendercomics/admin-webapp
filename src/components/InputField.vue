<template>
    <b-input-group :prepend="this.label" :size="this.size">
        <b-form-input
            v-model="localValue"
            :type="this.type"
            :disabled="this.disabled"
        />

        <b-input-group-append v-if="isUrl">
            <b-button
                @click="openLink"
                variant="dark-outline"
                style="background-color: #e9ecef"
                ><font-awesome-icon icon="external-link-alt"
            /></b-button>
        </b-input-group-append>

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
        isUrl() {
            return this.type === 'url';
        },
    },
    methods: {
        deleteValue() {
            this.$log.debug('delete ' + this.label);
            this.localValue = null;
        },
        openLink() {
            this.$log.debug('open link: ' + this.localValue);
            window.open(this.localValue, '_blank');
        },
    },
};
</script>
