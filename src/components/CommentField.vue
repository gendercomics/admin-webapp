<template>
    <div>
        <div class="mt-4">
            <b-card no-body>
                <template #header>
                    <div class="float-left">
                        <span>
                            {{ headerText }}
                        </span>
                    </div>
                    <div class="float-right">
                        <b-button
                            class="mr-1"
                            disabled
                            variant="warning"
                            v-if="!saved"
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
                    <b-card header="text">
                        <pre class="mt-0">{{ $data.text }}</pre>
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
            saved: false,
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
            if (
                this.localValue.metaData != null &&
                this.localValue.metaData.createdBy != null
            ) {
                userName = this.localValue.metaData.createdBy;
            }
            return 'comment by ' + userName + timestamp;
        },
    },
    methods: {
        saveComment: _.debounce(function(val) {
            this.$log.debug('comment-value=' + val);
            this.$data.text.value = val;
            this.saveText();
            this.$nextTick(function() {
                this.localValue = this.$data.text;
            });
            // TODO set localvalue (emit change)
        }, 1000),
        removeComment() {
            this.$log.debug('remove comment');
            // TODO delete comment in database
            this.$emit('remove', this.localValue);
        },
    },
    mounted() {
        this.$data.text = this.localValue;
        if (this.localValue.value != null && this.localValue.value.length > 0) {
            this.saved = true;
        }
    },
};
</script>
