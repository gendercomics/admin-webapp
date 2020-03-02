<template>
    <div class="text-left">
        <Header />
        <b-container fluid class="mt-4 pl-4 pr-4">
            <b-row>
                <b-form id="role-form" v-if="show">
                    <div>
                        <b-card
                            bg-variant="light"
                            header="add a new role"
                            style="min-width: 50rem"
                        >
                            <b-card-body>
                                <b-row>
                                    <b-col>
                                        <b-form-group
                                            label-cols-sm="2"
                                            label="name:"
                                            label-align-sm="right"
                                            label-for="name"
                                        >
                                            <b-form-input
                                                id="name"
                                                v-model="role.name"
                                                placeholder="enter role name"
                                                trim
                                                style="max-width: 10rem"
                                            ></b-form-input>
                                        </b-form-group>

                                        <b-form-group
                                            label-cols-sm="2"
                                            label="description:"
                                            label-align-sm="right"
                                            label-for="role-description"
                                        >
                                            <b-form-textarea
                                                id="role-description"
                                                placeholder="enter role description ..."
                                                v-model="role.description"
                                                style="min-width: 20rem"
                                            />
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                                <b-row class="mt-2">
                                    <b-col>
                                        <b-button-group class="float-right">
                                            <b-button
                                                type="submit"
                                                variant="primary"
                                                @click.stop.prevent.submit()="
                                                    onSubmit
                                                "
                                                >save</b-button
                                            >
                                            <b-button
                                                to="/roles"
                                                type="reset"
                                                variant="outline-danger"
                                                >cancel</b-button
                                            >
                                        </b-button-group>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                    </div>
                </b-form>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Header from '@/components/Header';

export default {
    name: 'RolesForm',
    components: {
        Header,
    },
    data() {
        return {
            role: {
                name: null,
                description: null,
            },
            show: true,
            errored: false,
            debug: false,
        };
    },
    mounted() {
        // get role
        if (!this.$route.path.endsWith('new')) {
            this.$api
                .get(this.$route.path)
                .then(response => {
                    this.role = response.data;
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                });
        }
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            if (this.$route.path.endsWith('new')) {
                this.$api
                    .post('/roles/', this.role)
                    .then(
                        response => (
                            (this.role = response.data),
                            this.$router.push('/roles')
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    });
            } else {
                this.$api
                    .put('/roles/' + this.role.id, this.role)
                    .then(
                        response => (
                            (this.role = response.data),
                            this.$router.push('/roles')
                        )
                    )
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    });
            }
        },
    },
};
</script>

<style scoped></style>
