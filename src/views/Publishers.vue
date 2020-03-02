<template>
    <div class="text-left">
        <Header />

        <b-col lg="6" class="mt-3">
            <b-button to="publishers/new" variant="outline-primary"
                >new publisher</b-button
            >
        </b-col>

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
