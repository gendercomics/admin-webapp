import { httpClient } from '@/services/httpclient';

export default {
    data: function() {
        return {
            roleOptions: [],
            loading: false,
        };
    },
    created: function() {},
    methods: {
        loadRoles() {
            this.loading = true;
            httpClient
                .get('/roles')
                .then(response =>
                    response.data.forEach(role => this.addRoleOption(role))
                )
                .catch(error => {
                    this.$log.error(error);
                })
                .finally(() => (this.loading = false));
        },
        addRoleOption(role) {
            let roleOption = { value: null, text: null };
            roleOption.value = role;
            roleOption.text = name;
            this.roleOptions.push(roleOption);
        },
    },
};
