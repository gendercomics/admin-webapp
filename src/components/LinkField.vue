<template>
    <b-input-group :prepend="this.label" :size="this.size">
        <b-form-input
            v-model="localValue.url"
            type="url"
            :disabled="this.disabled"
            style="width: max-content"
        />
        <b-form-datepicker v-model="localValue.lastAccess" start-weekday="1" />

        <template #append>
            <b-button
                @click="openLink"
                variant="dark-outline"
                style="background-color: #e9ecef"
                ><font-awesome-icon icon="external-link-alt"
            /></b-button>
            <b-button v-if="removable" @click="deleteValue"
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
        modelValue: {
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
            this.$emit('remove', this.localValue);
        },
        openLink() {
            this.$log.debug('open link: ' + this.localValue.url);
            window.open(this.localValue.url, '_blank');
        },
    },
};
</script>
