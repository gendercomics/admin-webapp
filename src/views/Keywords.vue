<template>
    <div class="text-left">
        <Header />
        <KeywordList />
    </div>
</template>

<script>
import Header from '@/components/Header';
import KeywordList from '../components/KeywordList';
export default {
    name: 'keywords',
    components: {
        KeywordList,
        Header,
    },
};
</script>

<style scoped></style>
