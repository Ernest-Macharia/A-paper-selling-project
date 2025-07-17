<template>
    <div class="container py-4 py-lg-5">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <!-- Header with stats -->
                <div
                    class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4"
                >
                    <div class="text-center text-md-start mb-3 mb-md-0">
                        <h2 class="fw-bold text-gradient-primary mb-2">Your Reviews</h2>
                        <p class="text-muted mb-0">Manage and view all your review activity</p>
                    </div>
                    <div class="d-flex gap-3">
                        <div class="text-center">
                            <div class="fs-3 fw-bold text-primary">{{ reviewsGiven.length }}</div>
                            <div class="text-muted small">Given</div>
                        </div>
                        <div class="text-center">
                            <div class="fs-3 fw-bold text-success">
                                {{ reviewsReceived.length }}
                            </div>
                            <div class="text-muted small">Received</div>
                        </div>
                    </div>
                </div>

                <!-- Tabs with better styling -->
                <ul class="nav nav-pills mb-4" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button
                            class="nav-link d-flex align-items-center gap-2"
                            :class="{ active: activeTab === 'given' }"
                            @click="activeTab = 'given'"
                            type="button"
                            role="tab"
                        >
                            <i class="bi bi-send-check"></i>
                            <span>Given</span>
                            <span class="badge bg-primary rounded-pill ms-1">{{
                                reviewsGiven.length
                            }}</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button
                            class="nav-link d-flex align-items-center gap-2"
                            :class="{ active: activeTab === 'received' }"
                            @click="activeTab = 'received'"
                            type="button"
                            role="tab"
                        >
                            <i class="bi bi-envelope-open"></i>
                            <span>Received</span>
                            <span class="badge bg-success rounded-pill ms-1">{{
                                reviewsReceived.length
                            }}</span>
                        </button>
                    </li>
                </ul>

                <!-- Loading State -->
                <div v-if="isloading" class="text-center py-5">
                    <div
                        class="spinner-grow text-primary"
                        role="status"
                        style="width: 3rem; height: 3rem"
                    >
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-muted">Loading your reviews...</p>
                </div>

                <!-- Reviews List -->
                <div v-else>
                    <div v-if="filteredReviews.length" class="card border-0 shadow-sm">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th scope="col" class="ps-4">Paper</th>
                                            <th scope="col">Rating</th>
                                            <th scope="col">
                                                {{
                                                    activeTab === 'given'
                                                        ? 'Reviewed By'
                                                        : 'Reviewer'
                                                }}
                                            </th>
                                            <th scope="col">Feedback</th>
                                            <th scope="col" class="pe-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="review in filteredReviews"
                                            :key="review.id"
                                            class="border-top"
                                        >
                                            <td class="ps-4">
                                                <router-link
                                                    :to="`/papers/${review.paper_id}`"
                                                    class="text-decoration-none"
                                                >
                                                    <div class="fw-semibold text-primary">
                                                        {{ review.paper_title }}
                                                    </div>
                                                    <small class="text-muted">{{
                                                        review.course_name
                                                    }}</small>
                                                </router-link>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center gap-1">
                                                    <div class="rating-stars">
                                                        <template v-for="star in 5" :key="star">
                                                            <i
                                                                class="bi"
                                                                :class="
                                                                    star <= review.rating
                                                                        ? 'bi-star-fill text-warning'
                                                                        : 'bi-star text-muted'
                                                                "
                                                            ></i>
                                                        </template>
                                                    </div>
                                                    <span
                                                        class="badge bg-primary bg-opacity-10 text-primary rounded-pill"
                                                    >
                                                        {{ review.rating }}.0
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <div
                                                        class="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center"
                                                    >
                                                        <i class="bi bi-person-fill text-muted"></i>
                                                    </div>
                                                    <div>
                                                        {{
                                                            activeTab === 'given'
                                                                ? review.user_name
                                                                : review.reviewer
                                                        }}
                                                        <div class="small text-muted">
                                                            {{ review.institution }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    class="comment-preview"
                                                    :title="review.comment || 'No comment'"
                                                >
                                                    {{ review.comment || 'No comment provided' }}
                                                </div>
                                            </td>
                                            <td class="pe-4 text-muted small">
                                                {{ formatDate(review.created_at) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-5">
                        <div class="mb-3">
                            <i class="bi bi-chat-square-text display-4 text-muted"></i>
                        </div>
                        <h5 class="fw-semibold">No reviews found</h5>
                        <p class="text-muted">
                            {{
                                activeTab === 'given'
                                    ? "You haven't reviewed any papers yet"
                                    : "You haven't received any reviews yet"
                            }}
                        </p>
                        <router-link
                            v-if="activeTab === 'given'"
                            to="/papers"
                            class="btn btn-outline-primary mt-2"
                        >
                            Browse Papers to Review
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Reviews',
    data() {
        return {
            activeTab: 'given',
            isloading: false,
        };
    },
    computed: {
        ...mapGetters('papers', ['reviewsGiven', 'reviewsReceived']),
        filteredReviews() {
            return this.activeTab === 'given' ? this.reviewsGiven : this.reviewsReceived;
        },
    },
    created() {
        this.fetchActiveTabReviews();
    },
    watch: {
        activeTab() {
            this.fetchActiveTabReviews();
        },
    },
    methods: {
        ...mapActions('papers', ['fetchReviewsGiven', 'fetchReviewsReceived']),

        async fetchActiveTabReviews() {
            this.isloading = true;
            try {
                if (this.activeTab === 'given') {
                    await this.fetchReviewsGiven();
                } else {
                    await this.fetchReviewsReceived();
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                this.isloading = false;
            }
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
.text-gradient-primary {
    background: linear-gradient(90deg, #3b71fe 0%, #8e54e9 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-pills .nav-link {
    padding: 0.5rem 1.25rem;
    border-radius: 50px;
    transition: all 0.3s ease;
}

.nav-pills .nav-link.active {
    box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.15);
}

.rating-stars {
    font-size: 1rem;
    letter-spacing: 2px;
}

.comment-preview {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
}

.avatar-sm {
    width: 32px;
    height: 32px;
}

.table {
    --bs-table-hover-bg: rgba(var(--bs-primary-rgb), 0.03);
}

.card {
    border-radius: 12px;
    overflow: hidden;
}

.bi-star-fill,
.bi-star {
    margin-right: 1px;
}
</style>
