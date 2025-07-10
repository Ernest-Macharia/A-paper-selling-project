<template>
    <div class="downloads-container">
        <h2 class="mb-4 text-primary-emphasis text-center">My Downloaded Papers</h2>

        <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <template v-else-if="downloadedPapersList.length">
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
                        <td class="text-start">
                            <router-link
                                :to="{ name: 'paper-details', params: { id: paper.id } }"
                                class="text-decoration-none text-primary fw-semibold"
                            >
                                {{ paper.title }}
                            </router-link>
                        </td>
                        <td>
                            <a
                                :href="paper.file"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-sm btn-outline-primary"
                                download
                            >
                                View File
                            </a>
                        </td>
                        <td class="fw-bold text-success">
                            {{ paper.price != null ? '$' + Number(paper.price).toFixed(2) : '—' }}
                        </td>
                        <td>{{ formatDate(paper.download_date) }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="pagination" v-if="totalPages > 1">
                <button
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                    aria-label="Previous Page"
                >
                    ⬅ Prev
                </button>

                <span>Page {{ currentPage }} of {{ totalPages }}</span>

                <button
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                    aria-label="Next Page"
                >
                    Next ➡
                </button>
            </div>
        </template>

        <p v-else class="no-downloads-message">You haven't downloaded any papers yet.</p>
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
            isLoading: false,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.downloadedPapersList.length / this.perPage);
        },
        paginatedDownloads() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.downloadedPapersList.slice(start, start + this.perPage);
        },
    },
    async created() {
        await this.fetchDownloadedPapersHandler();
    },
    methods: {
        ...mapActions('papers', ['fetchDownloadedPapers']),
        async fetchDownloadedPapersHandler() {
            this.isLoading = true;
            try {
                const response = await this.fetchDownloadedPapers();
                this.downloadedPapersList = Array.isArray(response) ? response : [];
                this.currentPage = 1;
            } catch (error) {
                console.error('❌ Failed to fetch downloaded papers:', error);
            }
            this.isLoading = false;
        },
        formatDate(date) {
            if (!date) return '—';
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

.no-downloads-message {
    margin-top: 1rem;
    text-align: center;
    font-style: italic;
    color: #666;
}
</style>
