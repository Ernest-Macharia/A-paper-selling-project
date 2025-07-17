<template>
    <div class="downloads-container container py-4">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-primary text-white py-3">
                <h2 class="h5 mb-0 d-flex align-items-center justify-content-center">
                    <i class="bi bi-download me-2"></i>My Downloaded Papers
                </h2>
            </div>

            <div class="card-body">
                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-5">
                    <div
                        class="spinner-border text-primary"
                        style="width: 3rem; height: 3rem"
                        role="status"
                    >
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-muted">Loading your downloads...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="!downloadedPapersList.length" class="text-center py-5">
                    <i class="bi bi-folder-x text-muted" style="font-size: 3rem"></i>
                    <h3 class="h5 mt-3">No Downloads Yet</h3>
                    <p class="text-muted">Papers you download will appear here</p>
                    <router-link to="/papers" class="btn btn-primary mt-3">
                        <i class="bi bi-search me-1"></i>Browse Papers
                    </router-link>
                </div>

                <!-- Downloads List -->
                <div v-else>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">Title</th>
                                    <th>File</th>
                                    <th>Price</th>
                                    <th>Download Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="paper in paginatedDownloads"
                                    :key="paper.id"
                                    class="download-item"
                                >
                                    <td class="ps-4">
                                        <router-link
                                            :to="{
                                                name: 'paper-details',
                                                params: { id: paper.id },
                                            }"
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
                                            <i class="bi bi-file-earmark-arrow-down me-1"></i
                                            >Download
                                        </a>
                                    </td>
                                    <td>
                                        <span
                                            v-if="paper.price != null"
                                            class="badge bg-success bg-opacity-10 text-success"
                                        >
                                            ${{ Number(paper.price).toFixed(2) }}
                                        </span>
                                        <span
                                            v-else
                                            class="badge bg-secondary bg-opacity-10 text-secondary"
                                            >Free</span
                                        >
                                    </td>
                                    <td>
                                        <span class="text-muted">{{
                                            formatDate(paper.download_date)
                                        }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <nav v-if="totalPages > 1" aria-label="Downloads navigation">
                        <ul class="pagination justify-content-center mt-4">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button
                                    class="page-link"
                                    :disabled="currentPage === 1"
                                    @click="currentPage--"
                                    aria-label="Previous"
                                >
                                    <i class="bi bi-chevron-left"></i>
                                </button>
                            </li>

                            <li class="page-item disabled">
                                <span class="page-link text-dark">
                                    Page {{ currentPage }} of {{ totalPages }}
                                </span>
                            </li>

                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button
                                    class="page-link"
                                    :disabled="currentPage === totalPages"
                                    @click="currentPage++"
                                    aria-label="Next"
                                >
                                    <i class="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'DownloadsPage',
    data() {
        return {
            downloadedPapersList: [],
            currentPage: 1,
            perPage: 8,
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
                console.error('Failed to fetch downloaded papers:', error);
            }
            this.isLoading = false;
        },
        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
    },
};
</script>

<style scoped>
.downloads-container {
    max-width: 1200px;
}

.card-header {
    border-radius: 0.5rem 0.5rem 0 0 !important;
}

.download-item:hover {
    background-color: rgba(13, 110, 253, 0.05);
}

.table th {
    border-bottom-width: 1px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    color: #6c757d;
}

.page-item.disabled .page-link {
    opacity: 0.6;
}

.page-link {
    min-width: 40px;
    text-align: center;
}

@media (max-width: 768px) {
    .card-header h2 {
        font-size: 1.1rem;
    }

    .table th,
    .table td {
        padding: 0.75rem 0.5rem;
    }

    .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
    }
}
</style>
