<template>
    <b-input-group>
        <input-field :label="this.label" v-model="localValue" type="url" />

        <!--
        <b-form-datepicker placeholder="last access"/>
-->
        <template v-slot:append v-if="removable">
            <b-button @click="deleteValue"
                ><font-awesome-icon icon="times-circle"
            /></b-button>
        </template>
    </b-input-group>
</template>

<script>
import InputField from '@/components/InputField';
export default {
    name: 'LinkField',
    components: { InputField },
    props: {
        label: null,
        url: null,
        lastAccess: null,
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
                return this.url;
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
