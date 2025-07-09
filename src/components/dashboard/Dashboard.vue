<template>
    <div class="container-fluid p-4">
        <!-- Dashboard Overview -->
        <div v-if="$route.path === '/dashboard'">
            <div class="mb-4">
                <h2 class="fw-bold">Welcome, {{ statistics.user_name }} 👋</h2>
                <p class="text-muted">Here's an overview of your activity</p>
            </div>

            <!-- Metric Grid -->
            <div class="row g-4 mb-5">
                <div class="col-sm-6 col-lg-3" v-for="metric in metrics" :key="metric.title">
                    <div
                        class="p-4 bg-white rounded-3 shadow-sm h-100 d-flex flex-column justify-content-between"
                    >
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div
                                class="text-3xl"
                                :class="{ 'opacity-30': metric.isEmpty }"
                                :title="metric.isEmpty ? metric.tooltip : ''"
                            >
                                {{ metric.icon }}
                            </div>
                            <div class="text-gray-500 text-sm font-semibold tracking-wide">
                                {{ metric.title }}
                            </div>
                        </div>
                        <div
                            class="text-xl font-bold"
                            :class="{
                                'text-muted': metric.isEmpty,
                                'text-gray-800': !metric.isEmpty,
                            }"
                            :title="metric.isEmpty ? metric.tooltip : ''"
                        >
                            {{ metric.display }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="row g-4 mb-5">
                <div class="col-md-6">
                    <div class="bg-white rounded-3 shadow-sm p-4 h-100">
                        <h5 class="mb-3">📈 Downloads Over Time</h5>
                        <canvas id="downloadsChart" />
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="bg-white rounded-3 shadow-sm p-4 h-100">
                        <h5 class="mb-3">💸 Earnings Over Time</h5>
                        <canvas id="earningsChart" />
                    </div>
                </div>
            </div>

            <!-- Recent Activities
      <div>
        <h5 class="mb-3">📝 Recent Activities</h5>
        <div v-if="recentActivities.length">
          <ul class="list-group">
            <li
              v-for="(activity, index) in recentActivities"
              :key="index"
              class="list-group-item list-group-item-light"
            >
              {{ activity }}
            </li>
          </ul>
        </div>
        <div v-else class="text-center text-muted py-4 border rounded bg-light">
          No recent activity yet. Start uploading papers to see your progress!
        </div>
      </div> -->
        </div>

        <!-- Nested Views -->
        <router-view v-else />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Chart from 'chart.js/auto';

export default {
    name: 'Dashboard',
    data() {
        return {
            statistics: [],
            // recentActivities: [
            //   "📄 Uploaded a new research paper on AI",
            //   "📥 Downloaded 'Machine Learning Basics'",
            //   "💰 Earned $5 from a recent download",
            //   "⭐ Received a new review on 'Blockchain Technology'",
            // ],
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
                    isEmpty: stats.user_papers_uploaded === 0,
                    tooltip: 'You have not uploaded any papers yet.',
                },
                {
                    title: 'Papers Downloaded',
                    value: stats.user_total_downloads,
                    display:
                        stats.user_total_downloads > 0
                            ? `${stats.user_total_downloads}`
                            : 'No downloads yet',
                    icon: '📥',
                    isEmpty: stats.user_total_downloads === 0,
                    tooltip: 'You have not downloaded any papers yet.',
                },
                {
                    title: 'Earnings',
                    value: stats.user_total_earnings,
                    display:
                        stats.user_total_earnings > 0
                            ? `$${stats.user_total_earnings.toFixed(2)}`
                            : 'No earnings',
                    icon: '💰',
                    isEmpty: stats.user_total_earnings === 0,
                    tooltip: 'No earnings yet.',
                },
                {
                    title: 'Reviews',
                    value: stats.user_review_count,
                    display: stats.user_review_count > 0 ? stats.user_review_count : 'No reviews',
                    icon: '⭐',
                    isEmpty: stats.user_review_count === 0,
                    tooltip: 'No reviews received.',
                },
                {
                    title: 'Views',
                    value: stats.user_total_views,
                    display: stats.user_total_views > 0 ? stats.user_total_views : 'No views',
                    icon: '👁️',
                    isEmpty: stats.user_total_views === 0,
                    tooltip: 'No views on your uploads yet.',
                },
                {
                    title: 'Orders',
                    value: stats.user_orders,
                    display: stats.user_orders > 0 ? stats.user_orders : 'No orders',
                    icon: '🛒',
                    isEmpty: stats.user_orders === 0,
                    tooltip: 'No orders placed yet.',
                },
                {
                    title: 'Completed Orders',
                    value: stats.user_completed_orders,
                    display:
                        stats.user_completed_orders > 0
                            ? stats.user_completed_orders
                            : 'No completed orders',
                    icon: '✅',
                    isEmpty: stats.user_completed_orders === 0,
                    tooltip: 'No completed orders yet.',
                },
                {
                    title: 'Wishlist',
                    value: stats.user_wishlist_count,
                    display:
                        stats.user_wishlist_count > 0
                            ? stats.user_wishlist_count
                            : 'Empty wishlist',
                    icon: '📝',
                    isEmpty: stats.user_wishlist_count === 0,
                    tooltip: 'You haven’t added anything to your wishlist.',
                },
            ];
        },
    },

    created() {
        this.fetchDashboardStatisticsHandler();
    },
    methods: {
        ...mapActions('papers', ['fetchDashboardStatistics']),
        renderCharts() {
            const downloadsCtx = document.getElementById('downloadsChart');

            // Replace with real chart data fetch later
            // const downloadData = [10, 25, 30, this.statistics.user_total_downloads || 0];
            // const earningsData = [20, 35, 40, this.statistics.user_total_earnings || 0];
            new Chart(downloadsCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                    datasets: [
                        {
                            label: 'Downloads',
                            data: [5, 10, 12, 25],
                            borderColor: '#0d6efd',
                            backgroundColor: 'rgba(13, 110, 253, 0.1)',
                            fill: true,
                            tension: 0.3,
                        },
                    ],
                },
            });

            const earningsCtx = document.getElementById('earningsChart');
            new Chart(earningsCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                    datasets: [
                        {
                            label: 'Earnings ($)',
                            data: [20, 35, 50, 75],
                            backgroundColor: '#ffc107',
                        },
                    ],
                },
            });
        },

        async fetchDashboardStatisticsHandler() {
            try {
                const response = await this.fetchDashboardStatistics();
                this.statistics = response;
            } catch (error) {
                console.error('Error fetching dashboard statistics:', error);
            }
        },
    },
    mounted() {
        this.renderCharts();
    },
};
</script>

<style scoped>
canvas {
    width: 100% !important;
    height: auto !important;
}
</style>
