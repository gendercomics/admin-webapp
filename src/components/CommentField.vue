<template>
    <div>
        <div class="mt-4">
            <b-card no-body>
                <template #header>
                    <div class="float-left">
                        <span
                            ><font-awesome-icon :icon="['far', 'comment']"
                        /></span>
                        <span> {{ headerText }} on </span>
                        <span v-if="localValue.metaData != null">
                            <span
                                v-if="localValue.metaData.changedOn == null"
                                >{{
                                    moment(
                                        localValue.metaData.createdOn
                                    ).format('DD.MM.YYYY HH:mm')
                                }}</span
                            >
                            <span v-else>{{
                                moment(localValue.metaData.changedOn).format(
                                    'DD.MM.YYYY HH:mm'
                                )
                            }}</span>
                        </span>
                    </div>
                    <div class="float-right">
                        <!--
                        <b-button
                            class="mr-1"
                            disabled
                            variant="warning"
                            v-if="dirty"
                        >
                            <font-awesome-icon icon="exclamation-triangle" />
                        </b-button>
                        <b-button
                            class="mr-1"
                            disabled
                            variant="success"
                            v-else
                        >
                            <font-awesome-icon icon="check-circle" />
                        </b-button>
                        -->
                        <b-button @click="removeComment">
                            <font-awesome-icon icon="times-circle" />
                        </b-button>
                    </div>
                </template>
                <editor v-model="text.value" @input="saveComment" />
            </b-card>
        </div>

        <!--
        <b-container fluid class="mt-4 ml-4 mr-4">
            <b-row class="mt-4 mr-4">
                <b-col id="json-text">
                    <b-card header="localvalue">
                        <pre class="mt-0">{{ localValue }}</pre>
                    </b-card>
                    <b-card header="originalValue">
                        <pre class="mt-0">{{ originalValue }}</pre>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
        -->
    </div>
</template>

<script>
import Editor from '@/components/Editor';
import _ from 'lodash';
import TextService from '@/mixins/textservice';
export default {
    name: 'CommentField',
    mixins: [TextService],
    components: {
        Editor,
    },
    props: {
        value: {
            id: null,
            value: null,
            metaData: null,
        },
        removable: {
            type: Boolean,
            default: false,
        },
    },
    data: function() {
        return {
            text: {
                id: null,
                value: null,
                metadata: null,
            },
            originalValue: null,
        };
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
        headerText() {
            let userName = '...';
            let timestamp = '';
            if (this.localValue.metaData != null) {
                userName = this.localValue.metaData.createdBy;
            }
            return ' by ' + userName + timestamp;
        },
        dirty: function() {
            let changed =
                this.localValue === null && this.localValue.id === null;
            changed =
                changed && this.originalValue.value != this.localValue.value;
            this.$log.debug('dirty=', changed);
            return changed;
        },
    },
    watch: {
        '$data.text': function(newValue) {
            this.localValue = newValue;
        },
    },
    methods: {
        saveComment: _.debounce(function(val) {
            this.$log.debug('comment-value=' + val);
            this.$data.text.value = val;
            this.saveText();
        }, 1000),
        removeComment() {
            this.$log.debug('remove comment');
            // delete comment in database - if already stored
            if (this.localValue.id != null) {
                this.deleteText(this.localValue.id);
            }
            this.$nextTick(() => {
                this.$emit('remove', this.localValue);
            });
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.$data.text = this.localValue;
            this.originalValue = this.localValue;
        });
    },
};
</script>
