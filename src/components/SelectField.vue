<template>
    <b-input-group class="pt-2" :prepend="this.label">
        <b-form-select
            id="input-publisher"
            :options="this.options"
            value-field="id"
            text-field="name"
            v-model="localValue"
        />
        <template v-slot:append>
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
