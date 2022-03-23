<template>
    <div class="mt-2">
        <b-input-group prepend="relation">
            <!-- predicate -->
            <b-input disabled v-model="this.label" />

            <!-- related keyword -->
            <searchable-dropdown
                v-model="localValue.predicate"
                options-path="/predicates"
                class="flex-fill"
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
        value: {},
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
