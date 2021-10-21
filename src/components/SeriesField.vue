<template>
    <b-form-row>
        <b-col>
            <b-input-group
                id="input-group-series"
                class="pt-2"
                prepend="series"
            >
                <searchable-dropdown
                    v-model="localValue.comic"
                    options-path="/comics/type/series"
                    class="flex-fill"
                />

                <template v-slot:append>
                    <b-button @click="removeSeries()">
                        <font-awesome-icon icon="times-circle" />
                    </b-button>
                </template>
            </b-input-group>
        </b-col>
        <b-col>
            <b-input-group prepend="volume" class="pt-2">
                <b-form-input v-model="localValue.volume" v-if="hasVolume" />
                <template v-slot:append v-if="hasVolume">
                    <b-button @click="removeVolume"
                        ><font-awesome-icon icon="backspace"
                    /></b-button>
                </template>
                <template v-slot:append v-else>
                    <b-button @click="addVolume"
                        ><font-awesome-icon icon="plus"
                    /></b-button>
                </template>
            </b-input-group>
        </b-col>
    </b-form-row>
</template>

<script>
import SearchableDropdown from '@/components/SearchableDropdown';
export default {
    name: 'SeriesField',
    components: {
        SearchableDropdown,
    },
    props: {
        value: {},
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
        hasVolume() {
            return this.localValue !== null && this.localValue.volume !== null;
        },
    },
    methods: {
        removeSeries() {
            this.$log.debug('remove series: ' + this.localValue.comic.title);
            this.$emit('remove');
        },
        addVolume() {
            this.$log.debug('add volume');
            this.localValue.volume = '';
        },
        removeVolume() {
            this.$log.debug(
                'remove volume: ' + JSON.stringify(this.localValue.volume)
            );
            this.localValue.volume = null;
        },
    },
};
</script>

<style scoped></style>
