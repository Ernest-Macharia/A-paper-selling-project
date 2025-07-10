<template>
    <section class="page-section py-5">
        <div class="container">
            <h1 class="fw-bold text-primary-emphasis mb-4 text-center">📊 Dashboard</h1>

            <div v-if="isLoading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading your dashboard...</p>
            </div>

            <div v-else>
                <!-- Statistics Cards -->
                <div class="row g-4 mb-5">
                    <div class="col-md-3" v-for="(stat, index) in metrics" :key="index">
                        <div class="card border-0 shadow-sm rounded text-center p-3">
                            <div class="card-body">
                                <div class="text-primary fs-2 mb-2">
                                    <span>{{ stat.icon }}</span>
                                </div>
                                <h5 class="card-title">{{ stat.title }}</h5>
                                <p class="card-text fs-4 fw-bold mb-0">{{ stat.display }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Most Viewed + Latest Uploads -->
                <div class="row g-4 mb-5">
                    <!-- Most Viewed Papers -->
                    <div class="col-md-6">
                        <div class="bg-white rounded shadow-sm p-4 h-100">
                            <h5 class="mb-3 text-primary-emphasis">🔥 Most Viewed Papers</h5>

                            <div v-if="mostViewedPapers.length">
                                <div class="mb-3" v-for="paper in mostViewedPapers" :key="paper.id">
                                    <router-link
                                        :to="{ name: 'paper-details', params: { id: paper.id } }"
                                        class="paper-card card h-100 text-decoration-none p-3 border"
                                    >
                                        <h6 class="mb-1">{{ paper.title }}</h6>
                                        <p class="text-muted small mb-1">
                                            {{ paper.course.name }} · {{ paper.category.name }}
                                        </p>

                                        <div
                                            class="d-flex justify-content-between small text-muted mb-1"
                                        >
                                            <span
                                                ><i class="bi bi-eye me-1"></i
                                                >{{ paper.views }} views</span
                                            >
                                            <span
                                                ><i class="bi bi-download me-1"></i
                                                >{{ paper.download_count }} downloads</span
                                            >
                                        </div>

                                        <div
                                            class="d-flex justify-content-between small text-muted"
                                        >
                                            <span>
                                                <i class="bi bi-currency-dollar me-1"></i>
                                                {{ paper.price > 0 ? paper.price : 'Free' }}
                                            </span>
                                            <span>
                                                <i class="bi bi-star me-1"></i>
                                                {{ paper.reviews?.length || 0 }} reviews
                                            </span>
                                        </div>

                                        <hr class="my-2" />
                                    </router-link>
                                </div>

                                <!-- Pagination Controls -->
                                <div class="d-flex justify-content-between mt-3">
                                    <button
                                        class="btn btn-sm btn-outline-primary"
                                        :disabled="viewedPage === 1"
                                        @click="changeViewedPage(viewedPage - 1)"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        class="btn btn-sm btn-outline-primary"
                                        :disabled="!mostViewedHasNext"
                                        @click="changeViewedPage(viewedPage + 1)"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                            <div v-else class="alert alert-light text-center">
                                No viewed papers yet.
                            </div>
                        </div>
                    </div>

                    <!-- Latest Uploaded Papers -->
                    <div class="col-md-6">
                        <div class="bg-white rounded shadow-sm p-4 h-100">
                            <h5 class="mb-3 text-primary-emphasis">📤 Your Latest Uploads</h5>
                            <div v-if="latestUserPapers.length">
                                <div class="mb-3" v-for="paper in latestUserPapers" :key="paper.id">
                                    <router-link
                                        :to="{ name: 'paper-details', params: { id: paper.id } }"
                                        class="paper-card card h-100 text-decoration-none"
                                    >
                                        <h6 class="mb-1">{{ paper.title }}</h6>
                                        <p class="text-muted small mb-1">
                                            {{ paper.course.name }} · {{ paper.category.name }}
                                        </p>
                                        <div
                                            class="d-flex justify-content-between small text-muted"
                                        >
                                            <span
                                                ><i class="bi bi-calendar me-1"></i
                                                >{{
                                                    new Date(paper.upload_date).toLocaleDateString()
                                                }}</span
                                            >
                                            <span
                                                ><i class="bi bi-eye me-1"></i
                                                >{{ paper.views }} views</span
                                            >
                                        </div>
                                        <hr />
                                    </router-link>
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <button
                                        class="btn btn-sm btn-outline-primary"
                                        :disabled="uploadPage === 1"
                                        @click="changeUploadPage(uploadPage - 1)"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        class="btn btn-sm btn-outline-primary"
                                        :disabled="!latestHasNext"
                                        @click="changeUploadPage(uploadPage + 1)"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                            <div v-else class="alert alert-light text-center">
                                You haven’t uploaded any papers yet.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'Dashboard',
    data() {
        return {
            statistics: [],
            mostViewedPapers: [],
            latestUserPapers: [],
            viewedPage: 1,
            uploadPage: 1,
            mostViewedHasNext: false,
            latestHasNext: false,
            isLoading: true,
        };
    },
    computed: {
        metrics() {
            const stats = this.statistics;

            return [
                {
                    title: 'Uploads',
                    value: stats.user_papers_uploaded,
                    display:
                        stats.user_papers_uploaded > 0
                            ? `${stats.user_papers_uploaded} ${stats.user_papers_uploaded === 1 ? 'paper' : 'papers'}`
                            : 'No uploads',
                    icon: '📄',
                },
                {
                    title: 'Papers Downloaded',
                    value: stats.user_total_downloads,
                    display:
                        stats.user_total_downloads > 0
                            ? `${stats.user_total_downloads}`
                            : 'No downloads yet',
                    icon: '📥',
                },
                {
                    title: 'Earnings',
                    value: stats.user_total_earnings,
                    display:
                        stats.user_total_earnings > 0
                            ? `$${stats.user_total_earnings.toFixed(2)}`
                            : 'No earnings',
                    icon: '💰',
                },
                {
                    title: 'Reviews',
                    value: stats.user_review_count,
                    display: stats.user_review_count > 0 ? stats.user_review_count : 'No reviews',
                    icon: '⭐',
                },
                {
                    title: 'Views',
                    value: stats.user_total_views,
                    display: stats.user_total_views > 0 ? stats.user_total_views : 'No views',
                    icon: '👁️',
                },
                {
                    title: 'Orders',
                    value: stats.user_orders,
                    display: stats.user_orders > 0 ? stats.user_orders : 'No orders',
                    icon: '🛒',
                },
                {
                    title: 'Completed Orders',
                    value: stats.user_completed_orders,
                    display:
                        stats.user_completed_orders > 0
                            ? stats.user_completed_orders
                            : 'No completed orders',
                    icon: '✅',
                },
                {
                    title: 'Wishlist',
                    value: stats.user_wishlist_count,
                    display:
                        stats.user_wishlist_count > 0
                            ? stats.user_wishlist_count
                            : 'Empty wishlist',
                    icon: '📝',
                },
            ];
        },
    },
    async created() {
        await Promise.all([
            this.fetchDashboardStatisticsHandler(),
            this.fetchMostViewedPapersHandler(),
            this.fetchLatestUserPapersHandler(),
        ]);
        this.isLoading = false;
    },
    methods: {
        ...mapActions('papers', [
            'fetchDashboardStatistics',
            'fetchMostViewedPapers',
            'fetchLatestUserPapers',
        ]),

        async fetchDashboardStatisticsHandler() {
            try {
                const response = await this.fetchDashboardStatistics();
                this.statistics = response;
            } catch {
                this.statistics = {};
            }
        },

        async fetchMostViewedPapersHandler(page = this.viewedPage) {
            try {
                const response = await this.fetchMostViewedPapers({ page });
                this.mostViewedPapers = response.results;
                this.mostViewedHasNext = !!response.next;
            } catch {
                this.mostViewedPapers = [];
                this.mostViewedHasNext = false;
            }
        },

        async fetchLatestUserPapersHandler(page = this.uploadPage) {
            try {
                const response = await this.fetchLatestUserPapers({ page });
                this.latestUserPapers = response.results;
                this.latestHasNext = !!response.next;
            } catch {
                this.latestUserPapers = [];
                this.latestHasNext = false;
            }
        },

        async changeViewedPage(newPage) {
            this.viewedPage = newPage;
            await this.fetchMostViewedPapersHandler(newPage);
        },

        async changeUploadPage(newPage) {
            this.uploadPage = newPage;
            await this.fetchLatestUserPapersHandler(newPage);
        },
    },
};
</script>

<style scoped>
canvas {
    width: 100% !important;
    height: auto !important;
}

/* Paper Card Styling */
.paper-card {
    border: none;
    border-radius: 16px;
    background: linear-gradient(to bottom right, #ffffff, #f8f9ff);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition:
        transform 0.25s ease-in-out,
        box-shadow 0.25s ease-in-out;
}

.paper-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Card Title */
.paper-card .card-title {
    color: #3f51b5; /* Indigo */
}

/* Meta Info */
.paper-card .text-muted i {
    color: #6c63ff;
}
</style>
