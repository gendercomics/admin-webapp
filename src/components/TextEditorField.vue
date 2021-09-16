<template>
    <div>
        <div>
            <b-card no-body>
                <template #header>
                    <div class="float-left">
                        <span> {{ headerText }} </span>
                    </div>
                    <div class="float-right">
                        <b-button
                            @click="removeDescription"
                            v-if="removable"
                            size="sm"
                        >
                            <font-awesome-icon icon="times-circle" />
                        </b-button>
                    </div>
                </template>
                <editor v-model="$data.content" />
            </b-card>
        </div>
    </div>
</template>

<script>
import Editor from '@/components/Editor';
export default {
    name: 'TextEditorField',
    components: {
        Editor,
    },
    props: {
        value: {},
        headerText: {
            type: String,
            default: '',
        },
        removable: {
            type: Boolean,
            default: false,
        },
    },
    data: function() {
        return {
            content: '',
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
    },
    watch: {
        '$data.content': function(newValue) {
            this.$log.debug('newValue=' + newValue);
            this.localValue = newValue;
        },
    },
    methods: {
        removeDescription() {
            this.$log.debug('remove description');
            this.localValue = null;
            this.$emit('remove', this.localValue);
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.$data.content = this.localValue;
        });
    },
};
</script>
