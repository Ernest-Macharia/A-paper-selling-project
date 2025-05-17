<template>
  <Navbar />
  <div class="container py-5">
    <h2 class="mb-4 text-center">📚 Explore All Papers</h2>

    <div v-if="isLoading" class="text-center my-5">
      <span class="spinner-border" role="status" aria-hidden="true"></span>
    </div>

    <div v-else>
      <div class="row g-4">
        <div
          v-for="paper in paginatedPapers"
          :key="paper.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <div class="card shadow-sm h-100 text-center border-0 paper-card">
            <div class="card-body d-flex flex-column justify-content-between">
              <router-link
                :to="{ name: 'paper-details', params: { id: paper.id } }"
                class="paper-link stretched-link"
              >
                <h5 class="card-title">{{ paper.title }}</h5>
              </router-link>
              <div class="mt-3 small text-muted">💾 {{ paper.downloads }} downloads</div>
              <div class="mt-1 small text-muted">⭐ {{ paper.reviews }} / 5</div>
              <div class="fw-bold text-success mt-2">$ {{ paper.price }}</div>
              <div class="mt-2 small">Uploaded: {{ formatDate(paper.upload_date) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-center mt-4">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              Previous
            </button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
            class="page-item"
          >
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button
              class="page-link"
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/home/Navbar.vue';
import { mapActions } from 'vuex';

export default {
  name: 'Papers',
  components: { Navbar },
  data() {
    return {
      papers: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      pageSize: 12,
    };
  },
  computed: {
    paginatedPapers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.papers.slice(start, start + this.pageSize);
    },
  },
  methods: {
    ...mapActions('papers', ['fetchAllPapers']),
    async loadPapers() {
      this.isLoading = true;
      try {
        const data = await this.fetchAllPapers();
        this.papers = data;
        this.totalPages = Math.ceil(this.papers.length / this.pageSize);
      } catch (error) {
        console.error('Error fetching papers:', error);
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    addToCart(paper) {
      alert(`✅ "${paper.title}" has been added to your cart!`);
    },
  },
  created() {
    this.loadPapers();
  },
};
</script>

<style scoped>
.paper-card {
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.paper-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}
.paper-link {
  text-decoration: none;
  color: #333;
}
.paper-link:hover {
  text-decoration: underline;
}
</style>
