<template>
    <div class="text-start">
        <Header />
        <PredicateList />
    </div>
</template>

<script>
import Header from '@/components/Header';
import PredicateList from '@/components/PredicateList';
export default {
    name: 'predicates',
    components: {
        PredicateList,
        Header,
    },
};
</script>

<style scoped></style>
