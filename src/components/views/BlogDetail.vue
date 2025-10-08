<template>
    <Navbar />
    <section class="container-fluid bg-light min-vh-100 py-5">
        <div class="container">
            <!-- Loading State -->
            <div v-if="blogLoading" class="text-center py-5">
                <div
                    class="spinner-grow text-primary"
                    style="width: 3rem; height: 3rem"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted fs-5">Loading article...</p>
            </div>

            <!-- Article Content -->
            <div v-else-if="selectedPost" class="row justify-content-center">
                <div class="col-lg-8">
                    <!-- Back Button -->
                    <div class="mb-4">
                        <router-link to="/blog" class="btn btn-outline-primary rounded-pill px-4">
                            <i class="bi bi-arrow-left me-2"></i>Back to Articles
                        </router-link>
                    </div>

                    <!-- Article Header -->
                    <article class="blog-article bg-white rounded-4 shadow-sm p-4 p-md-5">
                        <!-- Featured Image -->
                        <div v-if="selectedPost.image" class="article-image mb-4">
                            <img
                                :src="selectedPost.image"
                                alt="Blog cover"
                                class="img-fluid rounded-3 w-100"
                                style="max-height: 400px; object-fit: cover"
                            />
                        </div>

                        <!-- Article Meta -->
                        <div class="article-meta mb-4">
                            <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
                                <span
                                    v-if="selectedPost.category"
                                    class="badge bg-primary fs-6 px-3 py-2"
                                >
                                    {{ selectedPost.category.name }}
                                </span>
                                <div class="d-flex align-items-center text-muted">
                                    <i class="bi bi-calendar me-2"></i>
                                    {{ formatDate(selectedPost.created_at) }}
                                </div>
                                <div class="d-flex align-items-center text-muted">
                                    <i class="bi bi-clock me-2"></i>
                                    {{ readingTime }} min read
                                </div>
                            </div>
                        </div>

                        <!-- Article Title -->
                        <h1 class="article-title display-5 fw-bold text-dark mb-4">
                            {{ selectedPost.title }}
                        </h1>

                        <!-- Author Info -->
                        <div
                            class="author-section d-flex align-items-center mb-5 p-4 bg-light rounded-3"
                        >
                            <div class="author-avatar me-3">
                                <div
                                    class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style="width: 50px; height: 50px; font-size: 1.2rem"
                                >
                                    {{
                                        selectedPost.author_name
                                            ? selectedPost.author_name.charAt(0).toUpperCase()
                                            : 'A'
                                    }}
                                </div>
                            </div>
                            <div class="author-info">
                                <h6 class="mb-1 fw-bold">
                                    {{ selectedPost.author_name || 'Anonymous' }}
                                </h6>
                                <small class="text-muted">Article Author</small>
                            </div>
                        </div>

                        <!-- Article Content -->
                        <div
                            class="article-content fs-5 lh-lg text-dark"
                            v-html="selectedPost.content"
                        ></div>

                        <!-- Tags -->
                        <div
                            v-if="selectedPost.tags && selectedPost.tags.length"
                            class="tags-section mt-5 pt-4 border-top"
                        >
                            <h6 class="fw-bold mb-3">Tags:</h6>
                            <div class="d-flex flex-wrap gap-2">
                                <span
                                    v-for="tag in selectedPost.tags"
                                    :key="tag.id"
                                    class="badge bg-light text-dark border px-3 py-2"
                                >
                                    #{{ tag.name }}
                                </span>
                            </div>
                        </div>

                        <!-- Like & Comment Actions -->
                        <div class="action-buttons mt-5 pt-4 border-top">
                            <div class="d-flex gap-3">
                                <button
                                    @click="toggleLike"
                                    class="btn rounded-pill px-4"
                                    :class="
                                        isLiked ? 'btn-primary text-white' : 'btn-outline-primary'
                                    "
                                    :disabled="likeLoading"
                                >
                                    <span
                                        v-if="likeLoading"
                                        class="spinner-border spinner-border-sm me-2"
                                    ></span>
                                    <i
                                        v-else
                                        class="bi me-2"
                                        :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"
                                    ></i>
                                    {{ isLiked ? 'Liked' : 'Like' }} ({{
                                        selectedPost.likes_count || 0
                                    }})
                                </button>
                                <button class="btn btn-outline-secondary rounded-pill px-4">
                                    <i class="bi bi-chat me-2"></i>
                                    Comment ({{
                                        selectedPost.comments ? selectedPost.comments.length : 0
                                    }})
                                </button>
                            </div>
                        </div>
                    </article>

                    <!-- Comments Section -->
                    <div class="comments-section mt-5">
                        <div class="bg-white rounded-4 shadow-sm p-4 p-md-5">
                            <h4 class="fw-bold mb-4">
                                <i class="bi bi-chat-text me-2 text-primary"></i>
                                Comments ({{
                                    selectedPost.comments ? selectedPost.comments.length : 0
                                }})
                            </h4>

                            <!-- Comment Form -->
                            <div class="comment-form mb-5">
                                <form @submit.prevent="submitComment">
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Add a comment</label>
                                        <textarea
                                            v-model.trim="newComment"
                                            rows="4"
                                            class="form-control border-2"
                                            :class="{ 'is-invalid': commentError }"
                                            placeholder="Share your thoughts..."
                                            required
                                            :disabled="commentLoading"
                                        ></textarea>
                                        <div v-if="commentError" class="invalid-feedback">
                                            {{ commentError }}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        class="btn btn-primary rounded-pill px-4"
                                        :disabled="!newComment.trim() || commentLoading"
                                    >
                                        <span
                                            v-if="commentLoading"
                                            class="spinner-border spinner-border-sm me-2"
                                        ></span>
                                        <i v-else class="bi bi-send me-2"></i>
                                        {{ commentLoading ? 'Posting...' : 'Post Comment' }}
                                    </button>
                                </form>
                            </div>

                            <!-- Comments List -->
                            <div
                                v-if="selectedPost.comments && selectedPost.comments.length"
                                class="comments-list"
                            >
                                <div
                                    v-for="comment in selectedPost.comments"
                                    :key="comment.id"
                                    class="comment-item border-bottom pb-4 mb-4"
                                >
                                    <div class="d-flex align-items-start">
                                        <div class="comment-avatar me-3">
                                            <div
                                                class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                style="width: 40px; height: 40px; font-size: 1rem"
                                            >
                                                {{
                                                    comment.user_name
                                                        ? comment.user_name.charAt(0).toUpperCase()
                                                        : 'U'
                                                }}
                                            </div>
                                        </div>
                                        <div class="comment-content flex-grow-1">
                                            <div
                                                class="d-flex justify-content-between align-items-center mb-2"
                                            >
                                                <h6 class="fw-bold mb-0">
                                                    {{ comment.user_name || 'Anonymous' }}
                                                </h6>
                                                <small class="text-muted">
                                                    {{ formatDate(comment.created_at) }}
                                                </small>
                                            </div>
                                            <p class="text-dark mb-0">{{ comment.content }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- No Comments -->
                            <div v-else class="text-center py-4 text-muted">
                                <i class="bi bi-chat-square-text" style="font-size: 2rem"></i>
                                <p class="mt-2 mb-0">
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Not Found -->
            <div v-else class="text-center py-5">
                <div class="alert alert-warning py-4">
                    <i class="bi bi-exclamation-triangle-fill fs-2 d-block mb-3"></i>
                    <h4 class="mb-3">Article Not Found</h4>
                    <p class="mb-3">
                        The article you're looking for doesn't exist or has been moved.
                    </p>
                    <router-link to="/blog" class="btn btn-primary rounded-pill px-4">
                        <i class="bi bi-arrow-left me-2"></i>Back to Articles
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
    name: 'BlogDetail',
    components: {
        Footer,
        Navbar,
    },
    data() {
        return {
            newComment: '',
            commentError: '',
            commentLoading: false,
            likeLoading: false,
        };
    },
    computed: {
        ...mapGetters('blog', ['selectedPost', 'blogLoading', 'blogError', 'isLiked']),
        readingTime() {
            if (!this.selectedPost?.content) return 0;
            const words = this.selectedPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
            return Math.ceil(words / 200);
        },
        currentPostId() {
            return this.selectedPost?.id;
        },
    },
    async created() {
        const slug = this.$route.params.id;
        await this.fetchSinglePost(slug);

        // Check like status when post is loaded
        if (this.selectedPost) {
            await this.checkLikeStatus(this.selectedPost.id);
        }
    },
    methods: {
        ...mapActions('blog', ['fetchSinglePost', 'toggleLike', 'addComment', 'checkLikeStatus']),
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
        async toggleLike() {
            if (!this.selectedPost || this.likeLoading) return;

            this.likeLoading = true;
            try {
                await this.toggleLike(this.selectedPost.id);
            } catch (error) {
                console.error('Error toggling like:', error);
            } finally {
                this.likeLoading = false;
            }
        },
        async submitComment() {
            if (!this.newComment.trim() || !this.selectedPost || this.commentLoading) {
                this.commentError = 'Comment cannot be empty';
                return;
            }

            this.commentLoading = true;
            this.commentError = '';

            try {
                await this.addComment({
                    postId: this.selectedPost.id,
                    content: this.newComment,
                });
                this.newComment = '';
            } catch (error) {
                this.commentError =
                    error.response?.data?.content?.[0] ||
                    'Failed to post comment. Please try again.';
                console.error('Error posting comment:', error);
            } finally {
                this.commentLoading = false;
            }
        },
    },
    watch: {
        '$route.params.id': {
            async handler(newSlug) {
                if (newSlug) {
                    await this.fetchSinglePost(newSlug);
                    if (this.selectedPost) {
                        await this.checkLikeStatus(this.selectedPost.id);
                    }
                }
            },
            immediate: false,
        },
    },
};
</script>

<style scoped>
/* Previous styles remain the same */
.blog-article {
    line-height: 1.8;
}

.article-title {
    line-height: 1.2;
}

.article-content {
    font-size: 1.1rem;
}

.article-content ::v-deep h1,
.article-content ::v-deep h2,
.article-content ::v-deep h3 {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.article-content ::v-deep p {
    margin-bottom: 1.5rem;
}

.article-content ::v-deep img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin: 2rem 0;
}

.article-image img {
    transition: transform 0.3s ease;
}

.article-image:hover img {
    transform: scale(1.02);
}

.comment-item:last-child {
    border-bottom: none !important;
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
}

.form-control.border-2 {
    border-width: 2px !important;
    border-color: #e9ecef;
}

.form-control.border-2:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
</style>
