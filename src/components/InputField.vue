<template>
    <b-input-group :prepend="this.label" :size="this.size">
        <b-form-input
            v-model="localValue"
            :type="this.type"
            :disabled="this.disabled"
        />

        <b-input-group-append v-if="link">
            <b-button
                @click="openWikiData"
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
        link: null,
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
        openWikiData() {
            console.log('open wikidata link: ' + this.link);
            window.open(this.link, '_blank');
        },
    },
};
</script>
