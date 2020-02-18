<template>
    <b-input-group class="pt-2" :prepend="this.label">
        <b-form-input v-model="localValue" />
        <template v-slot:append>
            <b-button @click="deleteValue"
                ><font-awesome-icon icon="times-circle"
            /></b-button>
        </template>
    </b-input-group>
</template>

<script>
export default {
    name: 'TextInput',
    props: {
        label: null,
        value: null,
    },
    data: function() {
        return {
            localValue: null,
        };
    },
    created() {
        this.localValue = this.value;

        this.$watch('localValue', value => {
            this.$emit('input', value);
        });
    },
    methods: {
        deleteValue() {
            this.$log.debug('delete ' + this.label);
            this.localValue = null;
        },
    },
};
</script>
