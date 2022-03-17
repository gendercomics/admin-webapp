<template>
    <div>
        <b-input-group>
            <!-- predicate -->
            <b-input></b-input>

            <!-- related keyword -->
            <searchable-dropdown
                v-model="localValue.keyword"
                options-path="/keywords"
                class="flex-fill"
            />

            <template v-slot:append v-if="removable">
                <b-button @click="deleteValue"
                    ><font-awesome-icon icon="times-circle"
                /></b-button>
            </template>
        </b-input-group>
    </div>
</template>

<script>
import SearchableDropdown from '@/components/SearchableDropdown';
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
    },
    methods: {
        deleteValue() {
            this.$log.debug('delete relation');
            this.localValue = null;
        },
    },
};
</script>

<style scoped></style>
