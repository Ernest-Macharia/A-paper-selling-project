<template>
  <div class="downloads-container">
    <h2>📥 My Downloaded Papers</h2>

    <table class="papers-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>File</th>
          <th>Price</th>
          <th>Download Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="paper in paginatedDownloads" :key="paper.id">
          <td>{{ paper.title }}</td>
          <td>
            <a :href="paper.file" target="_blank" class="btn btn-sm btn-outline-primary">
              View File
            </a>
          </td>
          <td>
            {{ paper.price !== null && paper.price !== undefined 
              ? '$' + Number(paper.price).toFixed(2) 
              : '—' }}
          </td>
          <td>{{ formatDate(paper.download_date) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- <p v-else>No papers downloaded yet.</p> -->

    <div class="pagination" v-if="totalPages > 1">
      <button 
        :disabled="currentPage === 1" 
        @click="currentPage--"
      >
        ⬅ Prev
      </button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button 
        :disabled="currentPage === totalPages" 
        @click="currentPage++"
      >
        Next ➡
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Downloads',
  data() {
    return {
      downloadedPapersList: [],
      currentPage: 1,
      perPage: 4,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.downloadedPapersList.length / this.perPage);
    },
    paginatedDownloads() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.downloadedPapersList.slice(start, end);
    }
  },
  methods: {
    ...mapActions('papers', ['fetchDownloadedPapers']),

    async fetchPapers() {
      try {
        const response = await this.fetchDownloadedPapers();
        this.downloadedPapersList = response;
        this.currentPage = 1; // Reset to page 1 when fetching
      } catch (error) {
        console.error('❌ Failed to fetch downloaded papers:', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  },
  async created() {
    await this.fetchPapers();
  }
};
</script>

<style scoped>
.downloads-container {
  padding: 1rem;
}

.papers-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.papers-table th,
.papers-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: center;
}

.papers-table th {
  background: #4a90e2;
  color: white;
}

.papers-table tbody tr:hover {
  background-color: #f1f5ff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.pagination button {
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

button.btn-secondary {
  margin-top: 10px;
}
</style>
