<template>
    <div class="text-left">
        <Header />
        <PersonList />
    </div>
</template>

<script>
import Header from '@/components/Header';
import PersonList from '@/components/PersonList';

export default {
    name: 'persons',
    components: {
        Header,
        PersonList,
    },
};
</script>
