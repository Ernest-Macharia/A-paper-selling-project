<template>
    <section class="dashboard-page">
        <div class="container">
            <!-- Header Section -->
            <div class="dashboard-header text-center mb-5">
                <h1 class="display-5 fw-bold text-gradient-primary mb-3">📊 Dashboard Overview</h1>
                <p class="lead text-muted">Your academic resources at a glance</p>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="loading-state text-center py-5">
                <div
                    class="spinner-grow text-primary"
                    style="width: 3rem; height: 3rem"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 fs-5 text-muted">Preparing your dashboard...</p>
            </div>

            <!-- Content -->
            <div v-else>
                <!-- Metrics Cards Grid - Compact 2 rows of 4 cards -->
                <div class="row g-2 mb-3">
                    <!-- First Row -->
                    <div
                        class="col-xl-3 col-lg-4 col-md-6"
                        v-for="(stat, index) in metrics.slice(0, 4)"
                        :key="'first-' + index"
                    >
                        <div class="metric-card card border-0 h-100 transition-all hover-lift-sm">
                            <div class="card-body text-center p-2">
                                <div class="metric-icon mb-1">
                                    <span class="fs-2">{{ stat.icon }}</span>
                                </div>
                                <h6 class="card-title fw-semibold mb-1 small">{{ stat.title }}</h6>
                                <p class="metric-value fs-4 fw-bold mb-0">
                                    {{ stat.display }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-2 mb-4">
                    <!-- Second Row -->
                    <div
                        class="col-xl-3 col-lg-4 col-md-6"
                        v-for="(stat, index) in metrics.slice(4)"
                        :key="'second-' + index"
                    >
                        <div class="metric-card card border-0 h-100 transition-all hover-lift-sm">
                            <div class="card-body text-center p-2">
                                <div class="metric-icon mb-1">
                                    <span class="fs-2">{{ stat.icon }}</span>
                                </div>
                                <h6 class="card-title fw-semibold mb-1 small">{{ stat.title }}</h6>
                                <p class="metric-value fs-4 fw-bold mb-0">
                                    {{ stat.display }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Papers Sections -->
                <div class="row g-4">
                    <!-- Most Viewed Papers -->
                    <div class="col-lg-6">
                        <div class="papers-section card border-0 h-100">
                            <div class="card-header bg-transparent border-0 pb-0">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h3 class="section-title mb-0">
                                        <i class="bi bi-fire me-2 text-danger"></i>Most Viewed
                                        Papers
                                    </h3>
                                    <div class="section-actions d-flex align-items-center">
                                        <button
                                            class="btn btn-sm btn-outline-secondary"
                                            :disabled="viewedPage === 1"
                                            @click="changeViewedPage(viewedPage - 1)"
                                        >
                                            <i class="bi bi-chevron-left"></i>
                                        </button>
                                        <span class="mx-2 text-muted small">
                                            Page {{ viewedPage }}
                                        </span>
                                        <button
                                            class="btn btn-sm btn-outline-secondary"
                                            :disabled="!mostViewedHasNext"
                                            @click="changeViewedPage(viewedPage + 1)"
                                        >
                                            <i class="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="filter-controls d-flex align-items-center">
                                    <div
                                        class="input-group input-group-sm me-2"
                                        style="width: 150px"
                                    >
                                        <span class="input-group-text"
                                            ><i class="bi bi-search"></i
                                        ></span>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Search..."
                                            v-model="viewedSearchQuery"
                                            @input="debounceFetchMostViewedPapers"
                                        />
                                    </div>
                                    <select
                                        class="form-select form-select-sm me-2"
                                        style="width: 120px"
                                        v-model="viewedSortBy"
                                        @change="fetchMostViewedPapersHandler(1)"
                                    >
                                        <option value="views">Most Viewed</option>
                                        <option value="downloads">Most Downloads</option>
                                        <option value="recent">Most Recent</option>
                                    </select>
                                    <select
                                        class="form-select form-select-sm"
                                        style="width: 100px"
                                        v-model="viewedPriceFilter"
                                        @change="fetchMostViewedPapersHandler(1)"
                                    >
                                        <option value="all">All</option>
                                        <option value="free">Free</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                </div>
                            </div>

                            <div class="card-body">
                                <div v-if="mostViewedPapers.length" class="papers-list">
                                    <div
                                        v-for="paper in mostViewedPapers"
                                        :key="paper.id"
                                        class="paper-item"
                                    >
                                        <router-link
                                            :to="{
                                                name: 'paper-details',
                                                params: { id: paper.id },
                                            }"
                                            class="paper-link d-block text-decoration-none"
                                        >
                                            <div class="paper-content p-3">
                                                <div
                                                    class="d-flex justify-content-between align-items-start mb-2"
                                                >
                                                    <h6 class="paper-title mb-0">
                                                        {{ paper.title }}
                                                    </h6>
                                                    <span
                                                        class="badge bg-primary-light text-primary rounded-pill"
                                                    >
                                                        {{
                                                            paper.price > 0
                                                                ? `$${paper.price}`
                                                                : 'Free'
                                                        }}
                                                    </span>
                                                </div>

                                                <p class="paper-meta text-muted small mb-2">
                                                    <span class="me-2">
                                                        <i class="bi bi-book me-1"></i>
                                                        {{ paper.course?.name || 'N/A' }}
                                                    </span>
                                                    <span>
                                                        <i class="bi bi-tag me-1"></i>
                                                        {{ paper.category?.name || 'N/A' }}
                                                    </span>
                                                </p>

                                                <div
                                                    class="paper-stats d-flex justify-content-between"
                                                >
                                                    <span class="stat-item">
                                                        <i class="bi bi-eye me-1"></i>
                                                        {{ paper.views || 0 }} views
                                                    </span>
                                                    <span class="stat-item">
                                                        <i class="bi bi-download me-1"></i>
                                                        {{ paper.download_count || 0 }} downloads
                                                    </span>
                                                    <span class="stat-item">
                                                        <i class="bi bi-star me-1"></i>
                                                        {{ paper.reviews?.length || 0 }} reviews
                                                    </span>
                                                </div>
                                            </div>
                                        </router-link>
                                    </div>
                                </div>

                                <div v-else class="empty-state text-center py-4">
                                    <i class="bi bi-file-earmark-x display-5 text-muted mb-3"></i>
                                    <p class="text-muted">No papers found matching your criteria</p>
                                    <button
                                        class="btn btn-sm btn-outline-primary mt-2"
                                        @click="resetViewedFilters"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Latest Uploads -->
                    <div class="col-lg-6">
                        <div class="papers-section card border-0 h-100">
                            <div class="card-header bg-transparent border-0 pb-0">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h3 class="section-title mb-0">
                                        <i class="bi bi-cloud-arrow-up me-2 text-primary"></i>Your
                                        Latest Uploads
                                    </h3>
                                    <div class="section-actions d-flex align-items-center">
                                        <button
                                            class="btn btn-sm btn-outline-secondary"
                                            :disabled="uploadPage === 1"
                                            @click="changeUploadPage(uploadPage - 1)"
                                        >
                                            <i class="bi bi-chevron-left"></i>
                                        </button>
                                        <span class="mx-2 text-muted small">
                                            Page {{ uploadPage }}
                                        </span>
                                        <button
                                            class="btn btn-sm btn-outline-secondary"
                                            :disabled="!latestHasNext"
                                            @click="changeUploadPage(uploadPage + 1)"
                                        >
                                            <i class="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="filter-controls d-flex align-items-center">
                                    <div
                                        class="input-group input-group-sm me-2"
                                        style="width: 150px"
                                    >
                                        <span class="input-group-text"
                                            ><i class="bi bi-search"></i
                                        ></span>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Search..."
                                            v-model="uploadSearchQuery"
                                            @input="debounceFetchLatestUserPapers"
                                        />
                                    </div>
                                    <select
                                        class="form-select form-select-sm me-2"
                                        style="width: 120px"
                                        v-model="uploadSortBy"
                                        @change="fetchLatestUserPapersHandler(1)"
                                    >
                                        <option value="recent">Most Recent</option>
                                        <option value="views">Most Viewed</option>
                                        <option value="downloads">Most Downloads</option>
                                    </select>
                                    <select
                                        class="form-select form-select-sm"
                                        style="width: 100px"
                                        v-model="uploadStatusFilter"
                                        @change="fetchLatestUserPapersHandler(1)"
                                    >
                                        <option value="all">All</option>
                                        <option value="published">Published</option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div class="card-body">
                                <div v-if="latestUserPapers.length" class="papers-list">
                                    <div
                                        v-for="paper in latestUserPapers"
                                        :key="paper.id"
                                        class="paper-item"
                                    >
                                        <router-link
                                            :to="{
                                                name: 'paper-details',
                                                params: { id: paper.id },
                                            }"
                                            class="paper-link d-block text-decoration-none"
                                        >
                                            <div class="paper-content p-3">
                                                <div
                                                    class="d-flex justify-content-between align-items-start mb-2"
                                                >
                                                    <h6 class="paper-title mb-0">
                                                        {{ paper.title }}
                                                    </h6>
                                                    <span
                                                        class="badge rounded-pill"
                                                        :class="{
                                                            'bg-success-light text-success':
                                                                paper.status === 'published',
                                                            'bg-warning-light text-warning':
                                                                paper.status === 'pending',
                                                            'bg-danger-light text-danger':
                                                                paper.status === 'rejected',
                                                        }"
                                                    >
                                                        {{ paper.status || 'N/A' }}
                                                    </span>
                                                </div>

                                                <p class="paper-meta text-muted small mb-2">
                                                    <span class="me-2">
                                                        <i class="bi bi-book me-1"></i>
                                                        {{ paper.course?.name || 'N/A' }}
                                                    </span>
                                                    <span>
                                                        <i class="bi bi-tag me-1"></i>
                                                        {{ paper.category?.name || 'N/A' }}
                                                    </span>
                                                </p>

                                                <div
                                                    class="paper-stats d-flex justify-content-between"
                                                >
                                                    <span class="stat-item">
                                                        <i class="bi bi-eye me-1"></i>
                                                        {{ paper.views || 0 }} views
                                                    </span>
                                                    <span class="stat-item">
                                                        <i class="bi bi-download me-1"></i>
                                                        {{ paper.download_count || 0 }} downloads
                                                    </span>
                                                    <span class="stat-item">
                                                        <i class="bi bi-cash-coin me-1"></i>
                                                        ${{ paper.price || '0.00' }}
                                                    </span>
                                                </div>
                                            </div>
                                        </router-link>
                                    </div>
                                </div>

                                <div v-else class="empty-state text-center py-4">
                                    <i class="bi bi-cloud-arrow-up display-5 text-muted mb-3"></i>
                                    <p class="text-muted">No papers found matching your criteria</p>
                                    <div>
                                        <button
                                            class="btn btn-sm btn-outline-primary mt-2 me-2"
                                            @click="resetUploadFilters"
                                        >
                                            Reset Filters
                                        </button>
                                        <router-link
                                            to="/upload"
                                            class="btn btn-sm btn-primary mt-2"
                                        >
                                            Upload New Paper
                                        </router-link>
                                    </div>
                                </div>
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
import { mapActions } from 'vuex';
import { debounce } from 'lodash';
import Footer from '@/components/home/Footer.vue';

export default {
    name: 'Dashboard',
    components: {
        Footer,
    },
    data() {
        return {
            statistics: {},
            mostViewedPapers: [],
            latestUserPapers: [],
            viewedPage: 1,
            uploadPage: 1,
            mostViewedHasNext: false,
            latestHasNext: false,
            isLoading: false,

            // Filter states for Most Viewed Papers
            viewedSearchQuery: '',
            viewedSortBy: 'views',
            viewedPriceFilter: 'all',

            // Filter states for Latest Uploads
            uploadSearchQuery: '',
            uploadSortBy: 'recent',
            uploadStatusFilter: 'all',
        };
    },
    computed: {
        metrics() {
            const stats = this.statistics;

            return [
                {
                    title: 'Uploads',
                    value: stats?.user_papers_uploaded,
                    display:
                        stats?.user_papers_uploaded > 0
                            ? `${stats?.user_papers_uploaded} ${stats?.user_papers_uploaded === 1 ? 'paper' : 'papers'}`
                            : 'No uploads',
                    icon: '📄',
                    color: 'text-primary',
                },
                {
                    title: 'Downloads',
                    value: stats?.user_total_downloads,
                    display:
                        stats?.user_total_downloads > 0
                            ? `${stats?.user_total_downloads}`
                            : 'None yet',
                    icon: '📥',
                    color: 'text-success',
                },
                {
                    title: 'Views',
                    value: stats?.user_total_views,
                    display: stats?.user_total_views > 0 ? stats?.user_total_views : 'No views',
                    icon: '👁️',
                    color: 'text-info',
                },
                {
                    title: 'Earnings',
                    value: stats?.wallet_total_earned,
                    display:
                        stats?.wallet_total_earned > 0
                            ? `$${stats?.wallet_total_earned?.toFixed(2)}`
                            : '$0.00',
                    icon: '💰',
                    color: 'text-warning',
                },
                {
                    title: 'Balance',
                    value: stats?.wallet_available_balance,
                    display:
                        stats?.wallet_available_balance > 0
                            ? `$${stats?.wallet_available_balance?.toFixed(2)}`
                            : '$0.00',
                    icon: '💳',
                    color: 'text-info',
                },
                {
                    title: 'Withdrawn',
                    value: stats?.wallet_total_withdrawn,
                    display:
                        stats?.wallet_total_withdrawn > 0
                            ? `$${stats?.wallet_total_withdrawn?.toFixed(2)}`
                            : 'No withdrawals',
                    icon: '🏦',
                    color: 'text-danger',
                },
                {
                    title: 'Reviews',
                    value: stats?.user_review_count,
                    display: stats?.user_review_count > 0 ? stats?.user_review_count : 'No reviews',
                    icon: '⭐',
                    color: 'text-warning',
                },
            ].filter(Boolean);
        },
    },
    created() {
        this.debounceFetchMostViewedPapers = debounce(() => {
            this.fetchMostViewedPapersHandler(1);
        }, 500);

        this.debounceFetchLatestUserPapers = debounce(() => {
            this.fetchLatestUserPapersHandler(1);
        }, 500);

        this.fetchDashboardData();
    },
    methods: {
        ...mapActions('papers', [
            'fetchDashboardStatistics',
            'fetchMostViewedPapers',
            'fetchLatestUserPapers',
        ]),

        async fetchDashboardData() {
            this.isLoading = true;
            try {
                await Promise.all([
                    this.fetchDashboardStatisticsHandler(),
                    this.fetchMostViewedPapersHandler(),
                    this.fetchLatestUserPapersHandler(),
                ]);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchDashboardStatisticsHandler() {
            try {
                const response = await this.fetchDashboardStatistics();
                this.statistics = response;
            } catch {
                this.statistics = {};
            }
        },

        async fetchMostViewedPapersHandler(page = 1) {
            try {
                const response = await this.fetchMostViewedPapers({
                    page,
                    search: this.viewedSearchQuery,
                    sort: this.viewedSortBy,
                    price: this.viewedPriceFilter,
                });

                // Handle different possible response structures
                const responseData = response?.data || response;
                this.mostViewedPapers =
                    responseData?.results || responseData?.items || responseData || [];
                this.mostViewedHasNext =
                    !!responseData?.next || responseData?.pagination?.has_next || false;
                this.viewedPage = page;
            } catch {
                this.mostViewedPapers = [];
                this.mostViewedHasNext = false;
            }
        },

        async fetchLatestUserPapersHandler(page = 1) {
            try {
                const response = await this.fetchLatestUserPapers({
                    page,
                    search: this.uploadSearchQuery,
                    sort: this.uploadSortBy,
                    status: this.uploadStatusFilter,
                });

                // Handle different possible response structures
                const responseData = response?.data || response;
                this.latestUserPapers =
                    responseData?.results || responseData?.items || responseData || [];
                this.latestHasNext =
                    !!responseData?.next || responseData?.pagination?.has_next || false;
                this.uploadPage = page;
            } catch {
                this.latestUserPapers = [];
                this.latestHasNext = false;
            }
        },

        async changeViewedPage(newPage) {
            await this.fetchMostViewedPapersHandler(newPage);
        },

        async changeUploadPage(newPage) {
            await this.fetchLatestUserPapersHandler(newPage);
        },

        resetViewedFilters() {
            this.viewedSearchQuery = '';
            this.viewedSortBy = 'views';
            this.viewedPriceFilter = 'all';
            this.fetchMostViewedPapersHandler(1);
        },

        resetUploadFilters() {
            this.uploadSearchQuery = '';
            this.uploadSortBy = 'recent';
            this.uploadStatusFilter = 'all';
            this.fetchLatestUserPapersHandler(1);
        },
    },
};
</script>

<style scoped>
/* Dashboard Layout */
.dashboard-page {
    padding: 2rem 0 4rem;
    background-color: #f8fafc;
}

.dashboard-header {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

/* Text Gradient */
.text-gradient-primary {
    background: linear-gradient(to right, #4f46e5, #10b981);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

/* Loading State */
.loading-state {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Metrics Cards - Smaller size */
.metric-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.hover-lift-sm:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.metric-icon {
    opacity: 0.9;
}

.metric-value {
    color: #4f46e5;
    line-height: 1.2;
}

/* Papers Sections */
.papers-section {
    border-radius: 12px;
    overflow: hidden;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 2px 4px -1px rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
}

.filter-controls {
    padding: 0.5rem 0;
}

.paper-item {
    margin-bottom: 1rem;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
}

.paper-item:last-child {
    margin-bottom: 0;
}

.paper-link {
    color: inherit;
}

.paper-content {
    background: white;
    border-radius: 8px;
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.paper-content:hover {
    border-color: rgba(79, 70, 229, 0.3);
    box-shadow:
        0 4px 6px -1px rgba(79, 70, 229, 0.1),
        0 2px 4px -1px rgba(79, 70, 229, 0.06);
}

.paper-title {
    font-weight: 500;
    color: #1e293b;
    transition: color 0.2s ease;
}

.paper-link:hover .paper-title {
    color: #4f46e5;
}

.paper-meta {
    color: #64748b;
}

.paper-stats {
    font-size: 0.8rem;
    color: #64748b;
}

.stat-item {
    display: flex;
    align-items: center;
}

/* Empty State */
.empty-state {
    background-color: #f8fafc;
    border-radius: 8px;
}

/* Badges */
.badge.bg-primary-light {
    background-color: #e0e7ff;
    color: #4f46e5;
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.bg-success-light {
    background-color: #d1fae5;
    color: #065f46;
}

.bg-warning-light {
    background-color: #fef3c7;
    color: #92400e;
}

.bg-danger-light {
    background-color: #fee2e2;
    color: #b91c1c;
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
    .dashboard-header h1 {
        font-size: 2rem;
    }

    .metric-value {
        font-size: 1.5rem;
    }

    .filter-controls {
        flex-wrap: wrap;
    }

    .filter-controls .input-group,
    .filter-controls .form-select {
        margin-bottom: 0.5rem;
        width: 100% !important;
    }
}

/* Transition Effects */
.transition-all {
    transition: all 0.2s ease;
}

.hover-lift:hover {
    transform: translateY(-3px);
}
</style>
