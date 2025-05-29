<template>
  <Navbar />
  <div class="container py-5">
    <h2 class="mb-4 text-center fw-bold text-primary-emphasis display-6">Explore Academic Papers</h2>
    
    <div class="row mb-3">
      <div class="col-md-4">
        <select v-model="selectedCategory" @change="filterPapers" class="form-select">
          <option value="">All Categories</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.name.toLowerCase()"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="col-md-5">
        <input
          v-model="searchQuery"
          @input="filterPapers"
          type="text"
          class="form-control"
          placeholder="Search papers by title..."
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPapers.length === 0" class="text-center text-muted fs-5 mt-5">
      No papers found matching your search/filter.
    </div>

    <!-- Papers Table -->
    <div v-else>
      <div class="table-responsive">
        <table class="table table-hover align-middle text-center">
          <thead class="table-light">
            <tr>
              <th @click="toggleSort('title')" class="sortable">
                Title
                <i
                  v-if="sortKey === 'title'"
                  :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                  class="ms-1"
                ></i>
                <i v-else class="bi bi-caret-up bi bi-caret-down text-muted ms-1"></i>
              </th>
              <th>Category</th>
              <th>Downloads</th>
              <th>Reviews</th>
              <th @click="toggleSort('price')" class="sortable">
                Price
                <i
                  v-if="sortKey === 'price'"
                  :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                  class="ms-1"
                ></i>
                <i v-else class="bi bi-caret-up bi bi-caret-down text-muted ms-1"></i>
              </th>
              <th @click="toggleSort('upload_date')" class="sortable">
                Upload Date
                <i
                  v-if="sortKey === 'upload_date'"
                  :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                  class="ms-1"
                ></i>
                <i v-else class="bi bi-caret-up bi bi-caret-down text-muted ms-1"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="paper in paginatedPapers"
              :key="paper.id"
            >
              <td class="text-start">
                <router-link
                  :to="{ name: 'paper-details', params: { id: paper.id } }"
                  class="text-decoration-none text-primary fw-semibold"
                >
                  {{ paper.title }}
                </router-link>
              </td>
              <td>{{ paper.category?.name || paper.category || 'N/A' }}</td>
              <td>{{ paper.downloads }}</td>
              <td>{{ paper.reviews || 0 }} / 5</td>
              <td class="fw-bold text-success">
                {{ paper.is_free ? 'Free' : `$${paper.price}` }}
              </td>
              <td>{{ formatDate(paper.upload_date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1"
        class="d-flex justify-content-center mt-4">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">« Prev</button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">Next »</button>
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
      filteredPapers: [],
      categories: [],
      searchQuery: '',
      selectedCategory: '',
      currentPage: 1,
      pageSize: 8,
      isLoading: false,
      sortKey: '',
      sortAsc: true, 
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredPapers.length / this.pageSize);
    },
    paginatedPapers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredPapers.slice(start, start + this.pageSize);
    },

    filterPapers() {
      const query = this.searchQuery.toLowerCase();
      this.filteredPapers = this.papers.filter((paper) => {
        const matchesTitle = paper.title.toLowerCase().includes(query);
        const matchesCategory =
          !this.selectedCategory ||
          (paper.category?.name?.toLowerCase?.() === this.selectedCategory);
        return matchesTitle && matchesCategory;
      });

      this.sortPapers();
      this.currentPage = 1;
    },
  },

  created() {
    this.loadPapers();
    this.loadCategories();
  },

  methods: {
    ...mapActions('papers', ['fetchAllPapers', 'fetchCategories']),
    async loadPapers() {
      this.isLoading = true;
      try {
        const data = await this.fetchAllPapers();
        this.papers = data.results;
        this.filteredPapers = data.results;
      } catch (error) {
        console.error('Error fetching papers:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadCategories() {
      try {
        const response = await this.fetchCategories({
          search: this.searchQuery,
          page: this.currentPage,
        });

        this.categories = response.results;
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    sortPapers() {
      const key = this.sortKey;
      const asc = this.sortAsc ? 1 : -1;
      this.filteredPapers.sort((a, b) => {
        const valA = a[key]?.toString().toLowerCase?.() || '';
        const valB = b[key]?.toString().toLowerCase?.() || '';

        if (!isNaN(a[key]) && !isNaN(b[key])) {
          return (a[key] - b[key]) * asc;
        }
        return valA.localeCompare(valB) * asc;
      });
    },

    toggleSort(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
      this.sortPapers();
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
};
</script>

<style scoped>
.paper-card {
  border-radius: 1rem;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}
.paper-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
}
.pagination .page-link {
  color: #007bff;
  border: none;
  background-color: transparent;
}
.pagination .page-link:hover {
  background-color: #e9f5ff;
}
.pagination .active .page-link {
  background-color: #007bff;
  color: white;
  border-radius: 0.25rem;
}
.table th, .table td {
  vertical-align: middle;
}

.table td:first-child {
  max-width: 300px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.sortable {
  cursor: pointer;
  user-select: none;
}
.sortable i {
  font-size: 0.85rem;
}
</style>
