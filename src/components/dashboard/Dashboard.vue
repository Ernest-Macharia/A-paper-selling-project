<template>
  <div>
    <!-- Main Content -->
    <div class="container-fluid p-4">
      <!-- Dashboard Overview -->
      <div v-if="$route.path === '/dashboard'">
        <h2 class="mb-3 fw-bold">Welcome, {{ userName }} 👋</h2>
        <p class="text-muted">Here's an overview of your activity</p>

        <!-- Statistics Summary with color blocks -->
        <div class="row text-center mb-4">
          <div class="col-md-3">
            <div class="card shadow-sm p-3 mb-3 stat-card bg-primary text-white">
              <h5>📄 Papers Uploaded</h5>
              <p class="fs-3 fw-bold">{{ stats.uploads }}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card shadow-sm p-3 mb-3 stat-card bg-success text-white">
              <h5>📥 Downloads</h5>
              <p class="fs-3 fw-bold">{{ stats.downloads }}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card shadow-sm p-3 mb-3 stat-card bg-warning text-dark">
              <h5>💰 Earnings</h5>
              <p class="fs-3 fw-bold">${{ stats.earnings.toFixed(2) }}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card shadow-sm p-3 mb-3 stat-card bg-info text-white">
              <h5>⭐ Reviews</h5>
              <p class="fs-3 fw-bold">{{ stats.reviews }}</p>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="row mb-4">
          <div class="col-md-6 mb-3">
            <div class="card shadow-sm p-3">
              <h5 class="mb-3">📈 Downloads Over Time</h5>
              <canvas id="downloadsChart"></canvas>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="card shadow-sm p-3">
              <h5 class="mb-3">💸 Earnings Over Time</h5>
              <canvas id="earningsChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <h4 class="mt-4">📝 Recent Activities</h4>
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

      <!-- Render Nested Views -->
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: "Dashboard",
  data() {
    return {
      userName: "John Doe",
      stats: {
        uploads: 12,
        downloads: 25,
        earnings: 102.5,
        reviews: 8,
      },
      recentActivities: [
        "📄 Uploaded a new research paper on AI",
        "📥 Downloaded 'Machine Learning Basics'",
        "💰 Earned $5 from a recent download",
        "⭐ Received a new review on 'Blockchain Technology'",
      ],
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    renderCharts() {
      const downloadsCtx = document.getElementById("downloadsChart");
      new Chart(downloadsCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Downloads',
            data: [5, 10, 15, 25],
            borderColor: '#0d6efd',
            fill: false,
          }],
        },
      });

      const earningsCtx = document.getElementById("earningsChart");
      new Chart(earningsCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Earnings ($)',
            data: [20, 35, 50, 75],
            backgroundColor: '#ffc107',
          }],
        },
      });
    },
  },
  mounted() {
    this.renderCharts();
  },
};
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
}
canvas {
  width: 100% !important;
  height: auto !important;
}
</style>
