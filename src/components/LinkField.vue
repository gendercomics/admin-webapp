<template>
    <b-input-group :prepend="this.label" :size="this.size">
        <b-form-input
            v-model="localValue.url"
            type="url"
            :disabled="this.disabled"
            style="width: max-content"
        />
        <b-form-datepicker v-model="localValue.lastAccess" start-weekday="1" />

        <b-input-group-append>
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
    name: 'LinkField',
    props: {
        label: null,
        value: {
            url: null,
            lastAccess: null,
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
            this.localValue.url = null;
            this.localValue.lastAccess = null;
        },
        openLink() {
            this.$log.debug('open link: ' + this.localValue.url);
            window.open(this.localValue.url, '_blank');
        },
    },
};
</script>
