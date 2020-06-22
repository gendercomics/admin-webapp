<template>
    <div>
        <vue-tags-input
            v-model="tag"
            :tags="tags"
            :autocomplete-items="filteredItems"
            @tags-changed="newTags => (tags = newTags)"
        />
        {{ autocompleteItems }}
    </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import { httpClient } from '../services/httpclient';

export default {
    name: 'TagInput',
    components: {
        VueTagsInput,
    },
    props: {
        label: null,
        type: {
            type: String,
            default: 'content',
        },
    },
    data() {
        return {
            tag: '',
            tags: [],
            autocompleteItems: [],
        };
    },
    computed: {
        filteredItems() {
            return this.autocompleteItems.filter(i => {
                return (
                    i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1
                );
            });
        },
    },
    mounted() {
        httpClient
            .get('/keywords?type=' + this.type)
            .then(response => (this.autocompleteItems = response.data))
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
    },
};
</script>
