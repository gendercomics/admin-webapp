<template>
    <div class="text-left">
        <Header />
        <PublisherList />
    </div>
</template>

<script>
import Header from '@/components/Header';
import PublisherList from '../components/PublisherList';

export default {
    name: 'publishers',
    components: {
        PublisherList,
        Header,
    },
};
</script>
