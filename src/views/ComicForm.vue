<template>
    <section id="form-section" class="width-container">
        <div class="width-container">
            <form class="form">
                <header class="form__header">
                    <span class="heading-s">bibliographical data</span>
                </header>
                <!-- ID -->
                <div class="visually-hidden">comicId: {{ $route.params.id }}</div>
                <section class="form__section">
                    <div class="form-group">
                        <!-- title -->
                        <label class="label" for="title">title</label>
                        <input class="input" type="text" id="title" name="title" v-model="form.title" placeholder="title"/>
                    </div>
                    <!-- creators -->
                    <div class="form-group">
                        <label class="label" for="creator">author(s)</label>
                        <fieldset class="fieldset">
                            <div class="grid-row">
                                <div class="grid-column-one-half">
                                    <input class="input" id="creator" name="creator" v-model="form.authors" placeholder="name"/>
                                </div>
                                <div class="grid-column-one-half">
                                    <select class="select" id="creator-role" name="cretor-role">
                                        <option>- select role</option>
                                        <option>artist</option>
                                        <option>colorist</option>
                                        <option>contributor</option>
                                        <option>coverArtist</option>
                                        <option>creator</option>
                                        <option>inker</option>
                                        <option>letterer</option>
                                        <option>penciller</option>
                                        <option>writer</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <!-- in -->
                    <div class="form-group">
                        <label class="label" for="in">in</label>
                        <input class="input" type="text" id="in" name="in" v-model="form.in" placeholder="in"/>
                    </div>

                    <!-- pages -->
                    <div class="form-group">
                        <label class="label" for="pages">pages</label>
                        <input class="input" type="text" id="pages" name="pages" v-model="form.pages" placeholder="pages"/>
                    </div>

                    <!-- pages -->
                    <div class="form-group">
                        <label class="label" for="place-of-publication">place of publication</label>
                        <input class="input" type="text" id="place-of-publication" name="place-of-publication" v-model="form.placeOfPublication" placeholder="place of publication"/>
                    </div>

                    <!-- pages -->
                    <div class="form-group">
                        <label class="label" for="publisher">publisher</label>
                        <input class="input" type="text" id="publisher" name="publisher" v-model="form.publisher" placeholder="publisher"/>
                    </div>

                    <!-- year -->
                    <div class="form-group">
                        <label class="label" for="year">year</label>
                        <input class="input" type="text" id="year" name="year" v-model="form.year" placeholder="year"/>
                    </div>

                </section>

                <footer class="form__footer">
                    <div class="grid-row">
                        <div class="grid-column-one-half">
                            <button class="button button--start" type="button" name="save-button">save</button>
                        </div>
                        <div class="grid-column-one-half">
                            <button class="button button--start" type="button" name="cancel-button">cancel</button>
                        </div>
                    </div>
                </footer>

            </form>
        </div>
    </section>
</template>

<script>
    export default {
        name: "ComicForm",
        data() {
            return {
                form: {
                    title: "",
                    authors: [],
                    in: "",
                    pages: "",
                    placeOfPublication: "",
                    publisher: "",
                    year: ""
                }
            };
        }
    };
</script>
