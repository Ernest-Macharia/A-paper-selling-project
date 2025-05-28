<template>
  <Navbar />
  <div class="container py-5">
    <h2 class="mb-4 text-primary">Browse by Categories</h2>

    <!--  Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        @input="onSearch"
        type="text"
        class="form-control"
        placeholder="Search categories..."
      />
    </div>

    <!-- Empty State -->
    <div v-if="categories.length === 0" class="text-center text-muted mt-5">
      <p>No categories found.</p>
    </div>

    <!-- Category Cards -->
    <div v-else class="row g-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="col-md-4"
      >
        <router-link class="text-decoration-none">
          <div class="card h-100 shadow border-0 rounded-4 bg-light">
            <div class="card-body">
              <h5 class="card-title text-primary">{{ category.name }}</h5>
              <p v-if="category.paper_count > 0" class="card-text text-muted">
                {{ category.paper_count }} {{ category.paper_count === 1 ? 'paper' : 'papers' }}
              </p>
              <p v-else class="card-text text-muted">No papers available.</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 📄 Pagination Controls -->
    <div
      v-if="totalPages > 1"
      class="d-flex justify-content-center align-items-center gap-3 mt-4"
    >
      <button
        class="btn btn-outline-primary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <span class="fw-semibold text-primary">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="btn btn-outline-primary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/components/home/Navbar.vue';

export default {
  name: 'CategoriesPage',
  components: { Navbar },

  data() {
    return {
      categories: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
    };
  },

  async created() {
    await this.loadCategories();
  },

  methods: {
    ...mapActions('papers', ['fetchCategories']),

    async loadCategories() {
      try {
        const response = await this.fetchCategories({
          search: this.searchQuery,
          page: this.currentPage,
        });

        this.categories = response.results;
        this.totalPages = Math.ceil(response.count / 10);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    },

    onSearch() {
      this.currentPage = 1;
      this.loadCategories();
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadCategories();
      }
    },
  },
};
</script>
