<template>
    <div class="pl-1">
        <b-form-row>
            <b-input-group class="pt-2" prepend="publisher">
                <searchable-dropdown
                    v-model="localValue"
                    options-path="/publishers"
                />

                <b-form-input
                    v-if="hasOverride"
                    :value="localValue.location"
                    readonly
                    style="max-width: 15%; text-decoration: line-through;"
                />

                <b-form-input
                    v-else-if="localValue.location"
                    :value="localValue.location"
                    readonly
                    style="max-width: 15%;"
                />

                <b-button
                    @click="overrideLocation"
                    v-show="!hasOverride"
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
        </b-form-row>
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
        value: null,
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
