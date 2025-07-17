<template>
    <div class="uploads-container container py-4">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-primary text-white py-3">
                <div
                    class="d-flex flex-column flex-md-row justify-content-between align-items-md-center"
                >
                    <h2 class="h5 mb-3 mb-md-0">
                        <i class="bi bi-upload me-2"></i>My Uploaded Papers
                    </h2>

                    <div class="search-bar position-relative" style="max-width: 400px">
                        <input
                            v-model="searchQuery"
                            @input="onSearch"
                            type="text"
                            class="form-control form-control-sm ps-4"
                            placeholder="Search papers..."
                        />
                        <i
                            class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                        ></i>
                    </div>
                </div>
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
                    <p class="mt-3 text-muted">Loading your uploads...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="filteredPapers.length === 0" class="text-center py-5">
                    <i class="bi bi-file-earmark-x text-muted" style="font-size: 3rem"></i>
                    <h3 class="h5 mt-3">No Uploads Found</h3>
                    <p class="text-muted">Papers you upload will appear here</p>
                    <router-link to="/upload" class="btn btn-primary mt-3">
                        <i class="bi bi-plus-circle me-1"></i>Upload New Paper
                    </router-link>
                </div>

                <!-- Papers Table -->
                <div v-else>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th @click="toggleSort('title')" class="sortable ps-4">
                                        <div class="d-flex align-items-center">
                                            Title
                                            <i :class="sortIcon('title')" class="ms-2"></i>
                                        </div>
                                    </th>
                                    <th>File</th>
                                    <th @click="toggleSort('price')" class="sortable">
                                        <div class="d-flex align-items-center">
                                            Price
                                            <i :class="sortIcon('price')" class="ms-2"></i>
                                        </div>
                                    </th>
                                    <th @click="toggleSort('upload_date')" class="sortable">
                                        <div class="d-flex align-items-center">
                                            Upload Date
                                            <i :class="sortIcon('upload_date')" class="ms-2"></i>
                                        </div>
                                    </th>
                                    <th @click="toggleSort('status')" class="sortable">
                                        <div class="d-flex align-items-center">
                                            Status
                                            <i :class="sortIcon('status')" class="ms-2"></i>
                                        </div>
                                    </th>
                                    <th @click="toggleSort('views')" class="sortable">
                                        <div class="d-flex align-items-center">
                                            Views
                                            <i :class="sortIcon('views')" class="ms-2"></i>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="paper in paginatedPapers"
                                    :key="paper.id"
                                    class="paper-item"
                                >
                                    <td class="ps-4">
                                        <router-link
                                            :to="{
                                                name: 'paper-details',
                                                params: { id: paper.id },
                                            }"
                                            class="text-decoration-none text-primary fw-semibold d-inline-block text-truncate"
                                            style="max-width: 200px"
                                            :title="paper.title"
                                        >
                                            {{ paper.title }}
                                        </router-link>
                                    </td>
                                    <td>
                                        <a
                                            :href="paper.file"
                                            target="_blank"
                                            class="btn btn-sm btn-outline-primary"
                                        >
                                            <i class="bi bi-file-earmark-text me-1"></i>View
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
                                            formatDate(paper.upload_date)
                                        }}</span>
                                    </td>
                                    <td>
                                        <span :class="statusClass(paper.status)">
                                            {{ statusLabel(paper.status) }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge bg-info bg-opacity-10 text-info">
                                            {{ paper.views }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <nav v-if="totalPages > 1" aria-label="Uploads navigation" class="mt-4">
                        <ul class="pagination justify-content-center mb-0">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button
                                    class="page-link"
                                    @click="changePage(currentPage - 1)"
                                    aria-label="Previous"
                                >
                                    <i class="bi bi-chevron-left"></i>
                                </button>
                            </li>

                            <li
                                v-for="page in visiblePages"
                                :key="page"
                                class="page-item"
                                :class="{ active: currentPage === page }"
                            >
                                <button class="page-link" @click="changePage(page)">
                                    {{ page }}
                                </button>
                            </li>

                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button
                                    class="page-link"
                                    @click="changePage(currentPage + 1)"
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
    name: 'UploadedPapers',
    data() {
        return {
            uploadedPapersList: [],
            currentPage: 1,
            perPage: 10,
            searchQuery: '',
            sortKey: 'upload_date',
            sortAsc: false,
            isLoading: false,
        };
    },
    computed: {
        filteredPapers() {
            const query = this.searchQuery.toLowerCase();
            return this.uploadedPapersList.filter((paper) =>
                paper.title.toLowerCase().includes(query),
            );
        },
        sortedPapers() {
            return [...this.filteredPapers].sort((a, b) => {
                const aVal = a[this.sortKey];
                const bVal = b[this.sortKey];

                if (typeof aVal === 'string') {
                    return this.sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
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
        },
        visiblePages() {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(this.totalPages, start + maxVisible - 1);

            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        },
    },
    async created() {
        await this.fetchUploadedPapersHandler();
    },
    methods: {
        ...mapActions('papers', ['fetchUploadedPapers']),
        async fetchUploadedPapersHandler() {
            this.isLoading = true;
            try {
                const response = await this.fetchUploadedPapers();
                this.uploadedPapersList = response.results || [];
                this.currentPage = 1;
            } catch {
                this.uploadedPapersList = [];
            }
            this.isLoading = false;
        },
        onSearch() {
            this.currentPage = 1;
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
            return 'bi bi-arrow-down-up text-muted opacity-50';
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
        statusLabel(status) {
            const map = {
                draft: 'Draft',
                published: 'Published',
                archived: 'Archived',
            };
            return map[status] || 'Unknown';
        },
        statusClass(status) {
            const map = {
                draft: 'badge bg-warning bg-opacity-10 text-warning',
                published: 'badge bg-success bg-opacity-10 text-success',
                archived: 'badge bg-secondary bg-opacity-10 text-secondary',
            };
            return map[status] || 'badge bg-light text-dark';
        },
    },
};
</script>

<style scoped>
.uploads-container {
    max-width: 1200px;
}

.card-header {
    border-radius: 0.5rem 0.5rem 0 0 !important;
}

.sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease;
}

.sortable:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.sortable i {
    font-size: 0.85rem;
}

.paper-item:hover {
    background-color: rgba(13, 110, 253, 0.05);
}

.search-bar input {
    padding-left: 2.5rem;
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
    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .search-bar {
        width: 100%;
        max-width: 100% !important;
        margin-top: 1rem;
    }

    .table-responsive {
        font-size: 0.9rem;
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
