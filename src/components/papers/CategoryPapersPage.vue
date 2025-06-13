<template>
    <div class="container py-5">
        <h2 class="mb-4">Papers in {{ categoryName }}</h2>
        <div v-if="papers.length">
            <div v-for="paper in papers" :key="paper.id" class="mb-3">
                <div class="card shadow-sm p-3">
                    <h5>{{ paper.title }}</h5>
                    <p>{{ paper.description }}</p>
                </div>
            </div>
        </div>
        <p v-else>No papers found for this category.</p>
    </div>
</template>

<script>
import api from '@/api';

export default {
    name: 'CategoryPapersPage',
    data() {
        return {
            papers: [],
            categoryName: '',
        };
    },
    async created() {
        const categoryId = this.$route.params.categoryId;
        try {
            const response = await api.get(`/exampapers/papers/?category=${categoryId}`);
            this.papers = response.data.results;
            if (this.papers.length) {
                this.categoryName = this.papers[0].category.name;
            }
        } catch (err) {
            console.error('Failed to fetch papers:', err);
        }
    },
};
</script>
