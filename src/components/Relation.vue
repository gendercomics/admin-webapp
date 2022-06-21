<template>
    <div class="mt-2">
        <b-input-group prepend="relation">
            <template #prepend>
                <b-input-group-text v-if="direction === 'out'"
                    ><font-awesome-icon icon="arrow-right-from-bracket"
                /></b-input-group-text>
                <b-input-group-text v-if="direction === 'in'"
                    ><font-awesome-icon icon="arrow-right-to-bracket"
                /></b-input-group-text>
            </template>

            <!-- source (out) -->
            <b-input
                disabled
                v-model="this.label"
                v-if="this.direction === 'out'"
            />

            <!-- source (in) -->
            <searchable-dropdown
                v-model="localValue.source"
                v-if="this.direction === 'in'"
                :options-path="targetRoute"
                class="flex-fill"
            />

            <!-- predicate -->
            <searchable-dropdown
                v-model="localValue.predicate"
                options-path="/predicates"
                class="flex-fill"
            />

            <!-- target (out) -->
            <searchable-dropdown
                v-model="localValue.target"
                v-if="this.direction === 'out'"
                :options-path="targetRoute"
                class="flex-fill"
            />

            <!-- target (in) -->
            <b-input
                disabled
                v-model="this.label"
                v-if="this.direction === 'in'"
            />

            <template v-slot:append v-if="removable">
                <b-button @click="deleteValue">
                    <font-awesome-icon icon="times-circle" />
                </b-button>
            </template>
        </b-input-group>
    </div>
</template>

<script>
import SearchableDropdown from '@/components/SearchableDropdown';
import { getters, mutations } from '@/services/store';

export default {
    name: 'Relation',
    components: {
        SearchableDropdown,
    },
    props: {
        label: null,
        value: {
            source: null,
            predicate: null,
            target: null,
        },
        targetRoute: null,
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
        direction: {
            type: String,
            default: 'out',
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
        language: {
            get() {
                return getters.language();
            },
            set(val) {
                mutations.setLanguage(val);
            },
        },
    },
    methods: {
        deleteValue() {
            this.$log.debug('delete relation');
            this.$emit('remove', this.localValue);
        },
    },
};
</script>

<style scoped></style>
