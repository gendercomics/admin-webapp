<template>
    <div class="text-left">
        <Header />
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
