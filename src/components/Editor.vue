<template>
    <div>
        <bubble-menu
            v-if="editor && editable"
            :editor="editor"
            class="menububble is-active"
        >
            <form
                class="menububble__form"
                v-if="linkMenuIsActive"
                @submit.prevent="setLinkUrl(linkUrl)"
            >
                <input
                    class="menububble__input"
                    type="text"
                    v-model="linkUrl"
                    placeholder="https://"
                    ref="linkInput"
                    @keydown.esc="hideLinkMenu"
                />
                <button
                    class="menububble__button"
                    @click="setLinkUrl(null)"
                    type="button"
                >
                    <font-awesome-icon icon="times-circle" />
                </button>
            </form>
            <template v-else>
                <button
                    class="menububble__button"
                    @click="showLinkMenu"
                    :class="{ 'is-active': editor.isActive('link') }"
                >
                    <span>{{
                        editor.isActive('link') ? 'Update Link' : 'Add Link'
                    }}</span>
                </button>
            </template>
        </bubble-menu>

        <div v-if="editor && editable" class="menubar mt-2">
            <!-- bold -->
            <b-button
                class="m-1"
                size="sm"
                variant="light"
                :pressed="editor.isActive('bold')"
                @click="editor.chain().focus().toggleBold().run()"
            >
                <font-awesome-icon icon="bold" />
            </b-button>
            <!-- italic -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                :pressed="editor.isActive('italic')"
                @click="editor.chain().focus().toggleItalic().run()"
            >
                <font-awesome-icon icon="italic" />
            </b-button>
            <!-- underline -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                :pressed="editor.isActive('underline')"
                @click="editor.chain().focus().toggleUnderline().run()"
            >
                <font-awesome-icon icon="underline" />
            </b-button>
            <!-- paragraph -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                :pressed="editor.isActive('paragraph')"
                @click="editor.chain().focus().setParagraph().run()"
            >
                <font-awesome-icon icon="paragraph" />
            </b-button>
            <!-- H1 -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                :pressed="editor.isActive('heading', { level: 1 })"
                @click="
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
            >
                <b>H1</b>
            </b-button>
            <!-- H2 -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                :pressed="editor.isActive('heading', { level: 2 })"
                @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
            >
                <b>H2</b>
            </b-button>
            <!-- H3 -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                :pressed="editor.isActive('heading', { level: 3 })"
                @click="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                "
            >
                <b>H3</b>
            </b-button>
            <!-- bullet list -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                :pressed="editor.isActive('bulletList')"
                @click="editor.chain().focus().toggleBulletList().run()"
            >
                <font-awesome-icon icon="list-ul" />
            </b-button>
            <!-- ordered list -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                :pressed="editor.isActive('orderedList')"
                @click="editor.chain().focus().toggleOrderedList().run()"
            >
                <font-awesome-icon icon="list-ol" />
            </b-button>
            <!-- undo -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                @click="editor.chain().focus().undo().run()"
            >
                <font-awesome-icon icon="undo" />
            </b-button>
            <!-- redo -->
            <b-button
                class="m-1"
                variant="light"
                size="sm"
                @click="editor.chain().focus().redo().run()"
            >
                <font-awesome-icon icon="redo" />
            </b-button>
        </div>
        <editor-content v-if="editor" :editor="editor" class="m-2" />
    </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

export default {
    name: 'Editor',
    components: {
        EditorContent,
        BubbleMenu,
    },
    props: {
        modelValue: null,
        editable: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            editor: null,
            linkUrl: null,
            linkMenuIsActive: false,
        };
    },
    watch: {
        modelValue(value) {
            if (this.editor && this.editor.getHTML() !== value) {
                this.editor.commands.setContent(value, false);
            }
        },
        editable(val) {
            this.editor?.setEditable(val);
        },
    },
    methods: {
        showLinkMenu() {
            const attrs = this.editor.getAttributes('link');
            this.linkUrl = attrs.href || '';
            this.linkMenuIsActive = true;
            this.$nextTick(() => {
                this.$refs.linkInput?.focus();
            });
        },
        hideLinkMenu() {
            this.linkUrl = null;
            this.linkMenuIsActive = false;
        },
        setLinkUrl(url) {
            if (url) {
                this.editor.chain().focus().setLink({ href: url }).run();
            } else {
                this.editor.chain().focus().unsetLink().run();
            }
            this.hideLinkMenu();
        },
    },
    mounted() {
        this.editor = new Editor({
            content: this.modelValue || '',
            editable: this.editable,
            extensions: [
                StarterKit,
                Underline,
                Link.configure({ openOnClick: false }),
            ],
            onUpdate: () => {
                this.$emit('update:modelValue', this.editor.getHTML());
            },
        });
    },
    beforeUnmount() {
        this.editor?.destroy();
    },
};
</script>

<style lang="scss">
@use '@/styles/tiptap/menububble';
</style>
