<template>
    <div>
        <b-row class="ml-2">
            <div id="button-col" class="mt-2 mb-2">
                <b-button-group vertical>
                    <b-button disabled>keyword</b-button>
                    <b-button
                        :variant="descriptionBtnVariant"
                        @click="addDescription"
                        :disabled="this.showDescription"
                        >description</b-button
                    >
                </b-button-group>
            </div>

            <b-col id="form-col" class="pl-0 mr-3">
                <input-field
                    label="name"
                    v-model="localValue.name"
                    class="m-2"
                    @input="valueUpdated()"
                />

                <input-text-area
                    class="m-2"
                    label="description"
                    v-model="localValue.description"
                    v-if="showDescription"
                    removable
                    @input="valueUpdated()"
                />
            </b-col>
        </b-row>
    </div>
</template>
<script>
import InputField from '../components/InputField';
import InputTextArea from '../components/InputTextArea';

export default {
    name: 'KeywordFormDetails',
    components: {
        InputField,
        InputTextArea,
    },
    props: {
        value: {
            name: null,
            description: null,
        },
    },
    computed: {
        descriptionBtnVariant() {
            if (!this.showDescription) return 'outline-dark';
            return 'dark';
        },
        backBtnVariant() {
            return 'outline-danger';
        },
        showDescription() {
            return this.value.description != null;
        },
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
        addDescription() {
            this.value.description = '';
        },
        valueUpdated: function() {
            console.log('value:' + this.value);
            this.$emit('input', this.value);
        },
    },
};
</script>
