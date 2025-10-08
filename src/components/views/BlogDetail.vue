<template>
    <Navbar />
    <section class="container mx-auto py-10 px-4 md:px-0">
        <!-- Loading -->
        <div v-if="blogLoading" class="text-center py-5">
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading article...</p>
        </div>

        <!-- Article -->
        <article v-else-if="selectedPost" class="max-w-3xl mx-auto">
            <img
                v-if="selectedPost.image"
                :src="selectedPost.image"
                alt="Blog cover"
                class="w-full h-80 object-cover rounded-3xl mb-6"
            />
            <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                {{ selectedPost.title }}
            </h1>
            <p class="text-sm text-gray-500 mb-5">
                By {{ selectedPost.author_name || 'Anonymous' }} ·
                {{ new Date(selectedPost.created_at).toLocaleDateString() }}
            </p>
            <div class="text-gray-700 leading-relaxed" v-html="selectedPost.content"></div>
        </article>

        <!-- Not Found -->
        <div v-else class="text-center py-5 text-muted">
            <p>Blog not found.</p>
            <router-link to="/blog" class="text-primary fw-semibold">← Back to blogs</router-link>
        </div>
    </section>

    <Footer />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'BlogDetail',
    components: {
        Footer,
        Navbar,
    },
    computed: {
        ...mapGetters('blog', ['selectedPost', 'blogLoading']),
    },
    created() {
        const slug = this.$route.params.id;
        this.fetchSinglePost(slug);
    },
    methods: {
        ...mapActions('blog', ['fetchSinglePost']),
    },
};
</script>

<style scoped>
.container {
    max-width: 850px;
}
</style>
