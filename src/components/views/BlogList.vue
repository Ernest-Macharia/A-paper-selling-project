<template>
    <Navbar />
    <section class="container mx-auto py-10">
        <h1 class="text-3xl font-bold mb-6 text-center">Latest Articles</h1>

        <!-- Loading -->
        <div v-if="blogLoading" class="text-center py-5">
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading blogs...</p>
        </div>

        <!-- Error -->
        <div v-else-if="blogError" class="text-center text-danger py-5">
            {{ blogError }}
        </div>

        <!-- Empty -->
        <div v-else-if="!blogPosts || blogPosts.length === 0" class="text-center py-5 text-muted">
            <p>No blog posts have been published yet.</p>
        </div>

        <!-- Blog Grid -->
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="post in blogPosts"
                :key="post.id"
                class="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden"
            >
                <img
                    v-if="post.image"
                    :src="post.image"
                    alt="Blog cover"
                    class="w-full h-52 object-cover"
                />
                <div class="p-4">
                    <h2 class="text-lg font-semibold mb-2 text-gray-800">{{ post.title }}</h2>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-3">
                        {{ post.content }}
                    </p>
                    <router-link
                        :to="{ name: 'BlogDetail', params: { id: post.slug } }"
                        class="text-primary fw-semibold"
                    >
                        Read more →
                    </router-link>
                </div>
            </div>
        </div>
    </section>

    <Footer />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'BlogList',
    components: {
        Footer,
        Navbar,
    },
    computed: {
        ...mapGetters('blog', ['blogPosts', 'blogLoading', 'blogError']),
    },
    created() {
        this.fetchBlogPosts();
    },
    methods: {
        ...mapActions('blog', ['fetchBlogPosts']),
    },
};
</script>

<style scoped>
.container {
    max-width: 1100px;
}
</style>
