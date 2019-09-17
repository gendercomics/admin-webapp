<template>
    <div class="hello">
        <h1 align="left">bibliographical data</h1>
        <section>
            <div id="comic-form" align="left">
                <div>
                    <label>comicId: {{ $route.params.id }}</label>
                </div>
                <div align="left">
                    <label for="title">title:</label>
                    <input id="title" v-model="form.title" type="text" placeholder="title">
                </div>
                <div align="left">
                    <label>authors:</label>
                    <input v-model="form.authors" type="text" placeholder="authors">
                    <button>new</button>
                </div>
                <div align="left">
                    <label>isbn:</label>
                    <input v-model="form.isbn" type="text" placeholder="isbn">
                    <button>gnd</button>
                </div>
                <div>
                    <button>save</button>
                    <button>cancel</button>
                </div>
                <p>Message is: {{ form.title }}</p>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: "ComicForm",
        data() {
            return {
                form: {
                    title: 'Comic title!',
                    authors: ['one', 'two'],
                    isbn: '123-123'
                }
            }
        }
    }
</script>
