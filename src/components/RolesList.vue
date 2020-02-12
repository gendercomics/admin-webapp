<template>
    <div>
        <b-container fluid class="mt-4 pl-4 pr-4">
            <b-row>
                <b-table
                        class="mt-4"
                        show-empty
                        small
                        striped
                        hover
                        head-variant="dark"
                        bordered
                        :fields="fields"
                        :items="roles"
                >

                    <template v-slot:cell(metaData.changedOn)="data">
                        <span v-if="moment(data.item.metaData.changedOn).isValid()">{{ moment(data.item.metaData.changedOn).format('DD.MM.YYYY HH:mm') }}</span>
                        <span v-else>{{ moment(data.item.metaData.createdOn).format('DD.MM.YYYY HH:mm') }}</span>
                    </template>

                    <template v-slot:cell(metaData.changedBy)="data">
                        <span v-if="data.item.metaData.changedBy == null">{{ data.item.metaData.createdBy }}</span>
                        <span v-else>{{ data.item.metaData.changedBy }}</span>
                    </template>

                </b-table>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: "RolesList",
        data() {
            return {
                fields: [
                    {key: 'name'},
                    {key: 'description'},
                    {key: 'metaData.changedOn', label: 'created/modified'},
                    {key: 'metaData.changedBy', label: 'by'}
                ],
                roles: null,
                loading: true,
                errored: false,
            };
        },
        mounted() {
            this.$api
                .get("/roles")
                .then(response => (this.roles = response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        }
    }
</script>

<style lang="scss">
    @import "../styles/styles.scss";
</style>