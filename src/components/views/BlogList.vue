<template>
    <Navbar />
    <section class="container-fluid bg-light py-5">
        <div class="container">
            <!-- Header Section -->
            <div class="text-center mb-6">
                <h1 class="display-5 fw-bold text-gradient mb-3">Latest Articles</h1>
                <p class="lead text-muted">
                    Discover insights, stories, and knowledge from our community
                </p>
            </div>

            <!-- Loading State -->
            <div v-if="blogLoading" class="text-center py-5">
                <div
                    class="spinner-grow text-primary"
                    style="width: 3rem; height: 3rem"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted fs-5">Loading amazing content...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="blogError" class="alert alert-danger text-center py-4">
                <i class="bi bi-exclamation-triangle-fill fs-2 d-block mb-2"></i>
                <p class="mb-0 fs-5">{{ blogError }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!blogPosts || blogPosts.length === 0" class="text-center py-5">
                <div class="empty-state">
                    <i class="bi bi-journal-text text-muted" style="font-size: 4rem"></i>
                    <h3 class="mt-3 text-muted">No articles yet</h3>
                    <p class="text-muted">Be the first to share your thoughts and stories!</p>
                </div>
            </div>

            <!-- Blog Grid -->
            <div v-else class="row g-4">
                <div v-for="post in blogPosts" :key="post.id" class="col-lg-4 col-md-6">
                    <div class="card blog-card h-100 border-0 shadow-sm hover-lift">
                        <div class="card-img-container position-relative">
                            <img
                                v-if="post.image"
                                :src="post.image"
                                alt="Blog cover"
                                class="card-img-top"
                            />
                            <div
                                v-else
                                class="card-img-top bg-gradient-primary d-flex align-items-center justify-content-center"
                            >
                                <i
                                    class="bi bi-journal-text text-white"
                                    style="font-size: 2rem"
                                ></i>
                            </div>
                            <div class="card-badge position-absolute top-0 end-0 m-3">
                                <span class="badge bg-primary">{{
                                    post.category?.name || 'General'
                                }}</span>
                            </div>
                        </div>

                        <div class="card-body d-flex flex-column">
                            <div class="d-flex align-items-center mb-2">
                                <small class="text-muted">
                                    <i class="bi bi-calendar me-1"></i>
                                    {{ new Date(post.created_at).toLocaleDateString() }}
                                </small>
                                <small class="text-muted ms-3">
                                    <i class="bi bi-heart me-1"></i>
                                    {{ post.likes_count || 0 }}
                                </small>
                            </div>

                            <h5 class="card-title fw-bold text-dark line-clamp-2">
                                {{ post.title }}
                            </h5>
                            <p class="card-text text-muted line-clamp-3 flex-grow-1">
                                {{ truncateContent(post.content) }}
                            </p>

                            <div
                                class="d-flex justify-content-between align-items-center mt-auto pt-3"
                            >
                                <small class="text-muted">
                                    <i class="bi bi-person-circle me-1"></i>
                                    {{ post.author_name || 'Anonymous' }}
                                </small>
                                <router-link
                                    :to="{ name: 'BlogDetail', params: { id: post.slug } }"
                                    class="btn btn-primary btn-sm rounded-pill px-3"
                                >
                                    Read More <i class="bi bi-arrow-right ms-1"></i>
                                </router-link>
                            </div>
                        </div>
                    </div>
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
        truncateContent(content) {
            const plainText = content.replace(/<[^>]*>/g, '');
            return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
        },
    },
};
</script>

<style scoped>
.bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 200px;
}

.text-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.blog-card {
    transition: all 0.3s ease;
    border-radius: 15px;
    overflow: hidden;
}

.blog-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.hover-lift:hover {
    transform: translateY(-5px);
}

.card-img-top {
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.blog-card:hover .card-img-top {
    transform: scale(1.05);
}

.card-img-container {
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.empty-state {
    padding: 3rem 1rem;
}
</style>
