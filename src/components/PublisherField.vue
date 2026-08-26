<template>
    <div class="ps-1">
        <b-row>
            <b-input-group class="pt-2" prepend="publisher">
                <searchable-dropdown
                    v-model="localValue"
                    options-path="/publishers"
                />

                <b-form-input
                    v-if="hasOverride"
                    :model-value="localValue.location"
                    readonly
                    style="max-width: 15%; text-decoration: line-through"
                />

                <b-form-input
                    v-else-if="localValue.location"
                    :model-value="localValue.location"
                    readonly
                    style="max-width: 15%"
                />

                <b-button
                    @click="overrideLocation"
                    v-show="!hasOverride && localValue.location != null"
                    :disabled="localValue.id == null"
                    ><font-awesome-icon icon="edit"
                /></b-button>

                <b-form-input
                    v-show="hasOverride"
                    style="max-width: 25%"
                    v-model="localValue.locationOverride"
                />

                <b-button @click="removeOverrideLocation" v-show="hasOverride"
                    ><font-awesome-icon icon="backspace"
                /></b-button>

                <template v-slot:append>
                    <b-button @click="removeValue">
                        <font-awesome-icon icon="times-circle" />
                    </b-button>
                </template>
            </b-input-group>
        </b-row>
    </div>
</template>

<script>
import SearchableDropdown from '@/components/SearchableDropdown';
export default {
    name: 'PublisherField',
    components: {
        SearchableDropdown,
    },
    props: {
        modelValue: null,
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
        hasOverride() {
            return (
                this.localValue != null &&
                this.localValue.locationOverride != null
            );
        },
    },
    methods: {
        overrideLocation() {
            this.$log.debug('overrideLocation');
            this.localValue = {
                ...this.localValue,
                locationOverride: '',
            };
        },
        removeOverrideLocation() {
            this.$log.debug('remove override location');
            this.localValue.locationOverride = null;
        },
        removeValue() {
            this.$log.debug('remove publisher');
            this.$emit('remove');
        },
    },
};
</script>

<style scoped></style>
