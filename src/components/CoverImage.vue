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
            <div>
                <b-spinner v-if="imageLoading" />
                <b-img
                    v-else
                    :src="imageUrl"
                    v-bind="mainProps"
                    style="width: 100%"
                />
            </div>
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
                class: 'p-1',
            },
            imageLoading: false,
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
            if (this.localValue != null && this.localValue.length > 0) {
                this.$log.debug('imageUrl localValue: ' + this.localValue);
                return (
                    process.env.VUE_APP_API_URL +
                    'images/' +
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
        async uploadFile() {
            this.imageLoading = true;
            this.$log.debug('upload file: ' + this.file.name);
            this.loading = true;

            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('comicId', this.comicId);

            await httpClient
                .post('/files/upload/', formData)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));

            await this.isFileAvailable();
        },
        deleteFile() {
            this.$log.debug('delete file: ' + this.localValue);
            httpClient
                .delete('/files/' + this.comicId + '/' + this.localValue)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        async isFileAvailable() {
            let responseStatus;
            await httpClient
                .head(this.imageUrl)
                .then(response => (responseStatus = response.status))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(
                    () => this.$log.debug('response-status=' + responseStatus),
                    (this.imageLoading = false)
                );
        },
        removeValue() {
            this.$log.debug('remove cover');
            if (this.localValue != null) {
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
