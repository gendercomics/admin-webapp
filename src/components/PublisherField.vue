<template>
    <div class="pl-1">
        <b-form-row>
            <b-input-group class="pt-2" prepend="publisher">
                <searchable-dropdown
                    v-model="localPublisher"
                    options-path="/publishers"
                />

                <b-form-input
                    v-if="localPublisher.location"
                    :value="localPublisher.location"
                    readonly
                    style="max-width: 15%;"
                    v-bind:class="{
                        'text-decoration: line-through': this
                            .localLocationOverride,
                    }"
                />

                <!-- display and modify location for publisher
                <b-form-input
                    style="max-width: 15%"
                    v-if="localPublisher.location != null"
                    :value="localPublisher.location"
                    readonly
                />
                -->

                <b-button @click="overrideLocation" v-show="false"
                    ><font-awesome-icon icon="edit"
                /></b-button>

                <b-form-input
                    style="max-width: 25%"
                    v-if="this.localLocationOverride"
                />

                <b-button
                    v-if="this.localLocationOverride"
                    @click="removeOverrideLocation"
                    ><font-awesome-icon icon="backspace"
                /></b-button>

                <template v-slot:append>
                    <b-button @click="removeValue">
                        <font-awesome-icon icon="times-circle" />
                    </b-button>
                </template>
            </b-input-group>
        </b-form-row>

        <!--
        <b-container fluid class="mt-4 ml-4 mr-4">
            <b-row class="mt-4 mr-4">
                <b-col id="json-comic">
                    <b-card header="localLocationOverride">
                        <pre class="mt-0">{{ this.localLocationOverride }}</pre>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
        -->
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
        locationOverride: {
            publisherId: null,
            override: null,
        },
    },
    data: function() {
        return {
            loading: true,
        };
    },
    computed: {
        localPublisher: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        localLocationOverride: {
            get() {
                return this.locationOverride;
            },
            set(val) {
                this.$emit('location-override', val);
            },
        },
    },
    methods: {
        overrideLocation() {
            this.$log.debug('overrideLocation');
            this.localLocationOverride = {
                id: this.localPublisher.id,
                location: 'oida',
            };
        },
        removeOverrideLocation() {
            this.$log.debug('remove override location');
        },
        removeValue() {
            this.$log.debug('remove publisher');
            this.$emit('remove');
        },
    },
};
</script>

<style scoped></style>
