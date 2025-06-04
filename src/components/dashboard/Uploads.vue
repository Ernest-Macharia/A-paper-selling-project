<template>
  <div class="container py-5">
    <h2 class="mb-4 text-primary-emphasis">My Uploaded Papers</h2>

    <!-- Search -->
    <div class="mb-4 search-bar">
      <input
        v-model="searchQuery"
        @input="onSearch"
        type="text"
        class="form-control"
        placeholder="Search uploaded papers..."
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredPapers.length === 0" class="text-center text-muted mt-5">
      <p>No uploaded papers found.</p>
    </div>

    <!-- Table -->
    <div v-else class="table-responsive rounded-4 shadow-sm">
      <table class="table table-bordered table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th @click="toggleSort('title')" class="sortable">
              Title
              <i :class="sortIcon('title')" class="ms-2"></i>
            </th>
            <th>File</th>
            <th @click="toggleSort('price')" class="sortable">
              Price
              <i :class="sortIcon('price')" class="ms-2"></i>
            </th>
            <th @click="toggleSort('upload_date')" class="sortable">
              Upload Date
              <i :class="sortIcon('upload_date')" class="ms-2"></i>
            </th>
            <th @click="toggleSort('status')" class="sortable">
              Status
              <i :class="sortIcon('status')" class="ms-2"></i>
            </th>
            <th @click="toggleSort('views')" class="sortable">
              Views
              <i :class="sortIcon('views')" class="ms-2"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paper in paginatedPapers" :key="paper.id">
            <td>{{ paper.title }}</td>
            <td>
              <a :href="paper.file" target="_blank" class="btn btn-sm btn-outline-primary">View File</a>
            </td>
            <td>
              {{ paper.price != null ? '$' + Number(paper.price).toFixed(2) : '—' }}
            </td>
            <td>{{ formatDate(paper.upload_date) }}</td>
            <td>{{ statusLabel(paper.status) }}</td>
            <td>{{ paper.views }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
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
</template>

<script>
import Navbar from '@/components/home/Navbar.vue';
import { mapActions } from 'vuex';

export default {
  name: 'Uploads',
  components: { Navbar },
  data() {
    return {
      uploadedPapersList: [],
      currentPage: 1,
      perPage: 8,
      searchQuery: '',
      sortKey: 'upload_date',
      sortAsc: false,
    };
  },
  computed: {
    filteredPapers() {
      const query = this.searchQuery.toLowerCase();
      return this.uploadedPapersList.filter(paper =>
        paper.title.toLowerCase().includes(query)
      );
    },
    sortedPapers() {
      return [...this.filteredPapers].sort((a, b) => {
        const aVal = a[this.sortKey];
        const bVal = b[this.sortKey];

        if (typeof aVal === 'string') {
          return this.sortAsc
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return this.sortAsc ? aVal - bVal : bVal - aVal;
        }
      });
    },
    paginatedPapers() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.sortedPapers.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.ceil(this.filteredPapers.length / this.perPage);
    }
  },
  methods: {
    ...mapActions('papers', ['fetchUploadedPapers']),
    async fetchPapers() {
      try {
        const response = await this.fetchUploadedPapers();
        this.uploadedPapersList = response.results;
        this.currentPage = 1;
      } catch {
        this.uploadedPapersList = [];
      }
    },
    onSearch() {
      this.currentPage = 1;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    toggleSort(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    sortIcon(key) {
      if (this.sortKey === key) {
        return this.sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill';
      }
      return 'bi bi-caret-up bi bi-caret-down text-muted';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    statusLabel(status) {
      const map = {
        draft: '📝 Draft',
        published: '✅ Published',
        archived: '📦 Archived',
      };
      return map[status] || '❓ Unknown';
    }
  },
  async created() {
    await this.fetchPapers();
  }
};
</script>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable i {
  font-size: 0.85rem;
}

.search-bar input {
  max-width: 400px;
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
</style>
