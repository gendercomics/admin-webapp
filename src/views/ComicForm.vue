<template>
    <div class="text-left">
        <Header/>

        <div class="ml-1 p-2 text-primary">
            <h2>new comic ...</h2>
        </div>

        <b-container fluid>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group
                        id="input-group-1"
                        label="title:"
                        label-for="input-1"
                        :state="titleState"
                >
                    <b-form-input
                            id="input-1"
                            v-model="form.title"
                            required
                            placeholder="Enter title"
                            :state="titleState"
                    ></b-form-input>
                    <b-form-invalid-feedback>Enter at least 4 characters</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group
                        id="input-group-2"
                        label="subtitle:"
                        label-for="input-2"
                >
                    <b-form-input
                            id="input-2"
                            v-model="form.subtitle"
                            placeholder="Enter subtitle"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-3" label="creator(s):" label-for="input-3">
                    <b-form-input
                            id="input-3"
                            v-model="form.creator"
                            required
                            placeholder="Enter creator name"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-4" label="Food:" label-for="input-4">
                    <b-form-select
                            id="input-4"
                            v-model="form.food"
                            :options="foods"
                            required
                    ></b-form-select>
                </b-form-group>

                <b-form-group id="input-group-5" label="status:">
                    <b-form-radio-group v-model="form.status" id="radiobuttons-5">
                        <b-form-radio value="draft">draft</b-form-radio>
                        <b-form-radio value="review">review</b-form-radio>
                        <b-form-radio value="final">final</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>

                <b-button type="submit" variant="primary">save</b-button>
                <b-button type="reset" variant="danger">reset</b-button>

            </b-form>

            <b-card class="mt-3" header="Form Data Result">
                <pre class="m-0">{{ form }}</pre>
            </b-card>


        </b-container>
    </div>

</template>

<script>
    import Header from "@/components/Header";

    export default {
        name: "ComicForm",
        components: {
            Header
        },
        computed: {
            titleState() {
                return this.form.title.length >= 4 ? true : false
            },
        },
        data() {
            return {
                form: {
                    title: '',
                    subtitle: '',
                    name: '',
                    food: null,
                    status: 'draft'
                },
                foods: [{text: 'Select One', value: null}, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
                show: true
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault()
                alert(JSON.stringify(this.form))
            },
            onReset(evt) {
                evt.preventDefault()
                // Reset our form values
                this.form.title = ''
                this.form.subtitle = ''
                this.form.name = ''
                this.form.food = null
                this.form.statur = ''
                // Trick to reset/clear native browser form validation state
                this.show = false
                this.$nextTick(() => {
                    this.show = true
                })
            }
        }
    };
</script>
