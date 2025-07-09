<template>
    <div class="container py-4">
        <h2 class="mb-4 text-primary-emphasis fw-bold text-center">Reviews</h2>

        <!-- Tabs for Reviews Given / Received -->
        <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    :class="{ active: activeTab === 'given' }"
                    @click="activeTab = 'given'"
                    type="button"
                    role="tab"
                    aria-selected="activeTab === 'given'"
                >
                    Reviews Given
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    :class="{ active: activeTab === 'received' }"
                    @click="activeTab = 'received'"
                    type="button"
                    role="tab"
                    aria-selected="activeTab === 'received'"
                >
                    Reviews Received
                </button>
            </li>
        </ul>

        <!-- Loading State -->
        <div v-if="isloading" class="text-center text-secondary py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-2">Loading reviews...</div>
        </div>

        <!-- Table for Reviews -->
        <div v-else>
            <table v-if="filteredReviews.length" class="table table-hover rounded shadow-sm">
                <thead class="table-light">
                    <tr>
                        <th scope="col">Paper Name</th>
                        <th scope="col">Rating</th>
                        <th scope="col" v-if="activeTab === 'given'">Reviewed By</th>
                        <th scope="col" v-else>Reviewer</th>
                        <th scope="col">Comment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="review in filteredReviews" :key="review.id">
                        <td class="fw-semibold text-primary">{{ review.paper_title }}</td>
                        <td>
                            <span class="text-warning" style="font-size: 1.2rem">
                                <template v-for="star in 5" :key="star">
                                    <i
                                        class="bi"
                                        :class="star <= review.rating ? 'bi-star-fill' : 'bi-star'"
                                    ></i>
                                </template>
                            </span>
                        </td>
                        <td>{{ activeTab === 'given' ? review.user_name : review.reviewer }}</td>
                        <td class="fst-italic text-muted" style="max-width: 400px">
                            {{ review.comment || 'No comment' }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-else class="text-center text-muted fst-italic py-4">
                No reviews found in this category.
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
        fetchActiveTabReviews() {
            this.isloading = true;
            if (this.activeTab === 'given') {
                this.fetchReviewsGiven();
            } else {
                this.fetchReviewsReceived();
            }
            this.isloading = false;
        },
    },
};
</script>

<style scoped>
.bi-star-fill,
.bi-star {
    margin-right: 2px;
}
</style>
