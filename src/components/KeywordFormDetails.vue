<template>
    <div class="ml-2">
        <div>{{ value }}</div>

<!--
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

                <input-field label="name" v-model="value.name" class="m-2" />

                <input-text-area
                    class="m-2"
                    label="description"
                    v-model="value.description"
                    v-if="showDescription"
                    removable
                />
            </b-col>
        </b-row>
        -->
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
        nameState() {
            if (this.value.name.length < 1) {
                return false;
            }
            return null;
        },
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
    },
    methods: {
        addDescription() {
            this.value.description = '';
        },
    },
};
</script>
