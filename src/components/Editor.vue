<template>
    <div>
        <editor-menu-bubble
            class="menububble"
            :editor="editor"
            @hide="hideLinkMenu"
            v-if="editable"
            v-slot="{ commands, isActive, getMarkAttrs, menu }"
        >
            <div
                class="menububble"
                :class="{ 'is-active': menu.isActive }"
                :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
            >
                <form
                    class="menububble__form"
                    v-if="linkMenuIsActive"
                    @submit.prevent="setLinkUrl(commands.link, linkUrl)"
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
                        @click="setLinkUrl(commands.link, null)"
                        type="button"
                    >
                        <font-awesome-icon icon="times-circle" />
                    </button>
                </form>

                <template v-else>
                    <button
                        class="menububble__button"
                        @click="showLinkMenu(getMarkAttrs('link'))"
                        :class="{ 'is-active': isActive.link() }"
                    >
                        <span>{{
                            isActive.link() ? 'Update Link' : 'Add Link'
                        }}</span>
                    </button>
                </template>
            </div>
        </editor-menu-bubble>
        <editor-menu-bar
            v-if="editable"
            :editor="editor"
            v-slot="{ commands, isActive }"
        >
            <div class="menubar mt-2">
                <!-- bold -->
                <b-button
                    class="m-1"
                    size="sm"
                    variant="light"
                    :pressed="isActive.bold()"
                    @click="commands.bold"
                >
                    <font-awesome-icon icon="bold" />
                </b-button>
                <!-- italic -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.italic"
                    :pressed="isActive.italic()"
                >
                    <font-awesome-icon icon="italic" />
                </b-button>
                <!-- underline -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.underline"
                    :pressed="isActive.underline()"
                >
                    <font-awesome-icon icon="underline" />
                </b-button>
                <!-- paragraph -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.paragraph"
                    :pressed="isActive.paragraph()"
                >
                    <font-awesome-icon icon="paragraph" />
                </b-button>
                <!-- H1 -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.heading({ level: 1 })"
                    :pressed="isActive.heading({ level: 1 })"
                >
                    <b>H1</b>
                </b-button>
                <!-- H2 -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.heading({ level: 2 })"
                    :pressed="isActive.heading({ level: 2 })"
                >
                    <b>H2</b>
                </b-button>
                <!-- H3 -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.heading({ level: 3 })"
                    :pressed="isActive.heading({ level: 3 })"
                >
                    <b>H3</b>
                </b-button>
                <!-- bullet list -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.bullet_list"
                    :pressed="isActive.bullet_list()"
                >
                    <font-awesome-icon icon="list-ul" />
                </b-button>
                <!-- ordered list -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.ordered_list"
                    :pressed="isActive.ordered_list()"
                >
                    <font-awesome-icon icon="list-ol" />
                </b-button>
                <!-- undo -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.undo"
                >
                    <font-awesome-icon icon="undo" />
                </b-button>
                <!-- redo -->
                <b-button
                    class="m-1"
                    variant="light"
                    size="sm"
                    @click="commands.redo"
                >
                    <font-awesome-icon icon="redo" />
                </b-button>
            </div>
        </editor-menu-bar>
        <editor-content :editor="editor" class="m-2" />
    </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap';
import {
    Bold,
    BulletList,
    HardBreak,
    Heading,
    History,
    Link,
    ListItem,
    OrderedList,
    Underline,
    Italic,
} from 'tiptap-extensions';
import {
    faBold,
    faItalic,
    faListOl,
    faListUl,
    faParagraph,
    faRedo,
    faTimesCircle,
    faUnderline,
    faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(
    faBold,
    faItalic,
    faListOl,
    faListUl,
    faParagraph,
    faRedo,
    faTimesCircle,
    faUnderline,
    faUndo
);
export default {
    name: 'Editor',
    components: {
        EditorContent,
        EditorMenuBar,
        EditorMenuBubble,
    },
    props: {
        value: null,
        editable: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            editor: new Editor({
                content: '',
                extensions: [
                    new Bold(),
                    new BulletList(),
                    new HardBreak(),
                    new Heading({
                        levels: [1, 2, 3],
                    }),
                    new History(),
                    new Italic(),
                    new Link(),
                    new ListItem(),
                    new OrderedList(),
                    new Underline(),
                ],
                onUpdate: ({ getHTML }) => {
                    this.localValue = getHTML();
                    this.$emit('input', this.localValue);
                },
            }),
            localValue: null,
            linkUrl: null,
            linkMenuIsActive: false,
        };
    },
    watch: {
        value: {
            handler(value) {
                if (this.localValue == null) {
                    this.editor.setContent(value);
                }
            },
        },
        watch: {
            editable() {
                this.editor.setOptions({
                    editable: this.editable,
                });
            },
        },
    },
    methods: {
        showLinkMenu(attrs) {
            this.linkUrl = attrs.href;
            this.linkMenuIsActive = true;
            this.$nextTick(() => {
                this.$refs.linkInput.focus();
            });
        },
        hideLinkMenu() {
            this.linkUrl = null;
            this.linkMenuIsActive = false;
        },
        setLinkUrl(command, url) {
            command({ href: url });
            this.hideLinkMenu();
        },
    },
    beforeDestroy() {
        // Always destroy your editor instance when it's no longer needed
        this.editor.destroy();
    },
};
</script>

<style lang="scss">
@import './src/styles/tiptap/variables';
@import './src/styles/tiptap/menububble';
</style>
