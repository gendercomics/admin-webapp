<template>
    <div class="text-left">
        <Header />

        <b-col lg="6" class="mt-3">
            <b-button to="roles/new" variant="outline-primary"
                >new role</b-button
            >
        </b-col>

        <RolesList />
    </div>
</template>

<script>
import Header from '@/components/Header';
import RolesList from '@/components/RolesList';

export default {
    name: 'roles',
    components: {
        RolesList,
        Header,
    },
};
</script>
