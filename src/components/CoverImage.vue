<template>
    <div>
        <b-card no-body class="w-25" align="left">
            <template #header>
                <b-input-group size="sm" prepend="cover">
                    <b-form-input
                        v-if="localValue"
                        v-model="localValue"
                        disabled
                    />

                    <b-form-file
                        v-else
                        v-model="file"
                        :state="Boolean(file)"
                        placeholder="image..."
                        drop-placeholder="drop image here..."
                        accept="image/*"
                        @input="uploadFile"
                        size="sm"
                    ></b-form-file>

                    <template v-slot:append>
                        <b-button @click="removeValue" size="sm">
                            <font-awesome-icon icon="times-circle" />
                        </b-button>
                    </template>
                </b-input-group>
            </template>
            <b-img
                style="width: 100%;"
                :src="imageUrl"
                v-if="localValue.length > 0"
                v-bind="mainProps"
            />
        </b-card>
    </div>
</template>

<script>
import { httpClient } from '@/services/httpclient';

export default {
    name: 'CoverImage',
    props: {
        comicId: null,
        value: null,
    },
    data() {
        return {
            file: null,
            mainProps: {
                class: 'm-0',
            },
        };
    },
    computed: {
        localValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$log.debug('image changed: ' + val);
                this.$emit('input', val);
            },
        },
        imageUrl() {
            if (this.localValue != null || !this.localValue.length > 0) {
                return (
                    'http://localhost:8001/images/' +
                    this.comicId +
                    '/' +
                    this.localValue
                );
            }
            return null;
        },
    },
    watch: {
        file: {
            handler(value) {
                this.localValue = value.name;
            },
        },
    },
    methods: {
        uploadFile() {
            this.$log.debug('upload file: ' + this.file.name);

            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('comicId', this.comicId);

            httpClient
                .post('/files/upload/', formData)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        deleteFile() {
            this.$log.debug('delete file: ' + this.file.name);
            httpClient
                .delete('/files/' + this.comicId + '/' + this.file.name)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        removeValue() {
            this.$log.debug('remove cover');
            if (this.file != null) {
                this.deleteFile();
            }
            this.$emit('remove');
        },
    },
    mounted() {
        this.localValue = this.value;
    },
};
</script>

<style scoped></style>
