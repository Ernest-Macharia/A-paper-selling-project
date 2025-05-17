<template>
  <div class="uploads-container">
    <h2>📚 My Uploaded Papers</h2>

    <table class="papers-table" v-if="paginatedPapers.length">
      <thead>
        <tr>
          <th>Title</th>
          <th>File</th>
          <th>Price</th>
          <th>Upload Date</th>
          <th>Status</th>
          <th>Views</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="paper in paginatedPapers" :key="paper.id">
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
          <td>{{ formatDate(paper.upload_date) }}</td>
          <td>{{ statusLabel(paper.status) }}</td>
          <td>{{ paper.views }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No papers uploaded yet.</p>

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
  name: 'Uploads',
  data() {
    return {
      uploadedPapersList: [],
      currentPage: 1,
      perPage: 4,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.uploadedPapersList.length / this.perPage);
    },
    paginatedPapers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.uploadedPapersList.slice(start, end);
    }
  },
  methods: {
    ...mapActions('papers', ['fetchUploadedPapers']),

    async fetchPapers() {
      try {
        const response = await this.fetchUploadedPapers();
        this.uploadedPapersList = response;
        this.currentPage = 1; // Reset to page 1 when fetching
      } catch (error) {
        console.error('❌ Failed to fetch papers:', error);
      }
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
        draft: "📝 Draft",
        published: "✅ Published",
        archived: "📦 Archived",
      };
      return map[status] || "❓ Unknown";
    }
  },
  async created() {
    await this.fetchPapers();
  }
};
</script>

<style scoped>
.uploads-container {
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
