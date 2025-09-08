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
                    <router-link to="/uploads" class="btn btn-primary mt-3">
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
                                    <th>Actions</th>
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
                                    <td class="text-nowrap">
                                        <button
                                            @click.stop="openEditModal(paper)"
                                            class="btn btn-sm btn-outline-primary me-1"
                                            title="Edit"
                                            :disabled="isProcessing"
                                        >
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            @click.stop="confirmDelete(paper.id)"
                                            class="btn btn-sm btn-outline-danger"
                                            title="Delete"
                                            :disabled="
                                                isProcessing || deletingPapers.includes(paper.id)
                                            "
                                        >
                                            <i
                                                v-if="!deletingPapers.includes(paper.id)"
                                                class="bi bi-trash"
                                            ></i>
                                            <span
                                                v-else
                                                class="spinner-border spinner-border-sm"
                                                role="status"
                                            ></span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <nav v-if="pagination.totalPages > 1" class="pagination-container">
                        <ul class="pagination justify-content-center mb-0">
                            <!-- Previous Button -->
                            <li
                                class="page-item"
                                :class="{ disabled: pagination.currentPage === 1 }"
                            >
                                <button
                                    class="page-link"
                                    @click="changePage(pagination.currentPage - 1)"
                                    :disabled="pagination.currentPage === 1"
                                >
                                    <i class="bi bi-chevron-left"></i>
                                </button>
                            </li>

                            <!-- Page Numbers -->
                            <li
                                v-for="page in pagination.visiblePages"
                                :key="page"
                                class="page-item"
                                :class="{ active: pagination.currentPage === page }"
                            >
                                <button class="page-link" @click="changePage(page)">
                                    {{ page }}
                                </button>
                            </li>

                            <!-- Next Button -->
                            <li
                                class="page-item"
                                :class="{
                                    disabled: pagination.currentPage === pagination.totalPages,
                                }"
                            >
                                <button
                                    class="page-link"
                                    @click="changePage(pagination.currentPage + 1)"
                                    :disabled="pagination.currentPage === pagination.totalPages"
                                >
                                    <i class="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Edit Paper Modal -->
        <div
            class="modal fade"
            id="editPaperModal"
            tabindex="-1"
            aria-hidden="true"
            ref="editModal"
        >
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Paper</h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <form v-if="editingPaper" @submit.prevent="submitEdit">
                            <div class="mb-3">
                                <label class="form-label">Title*</label>
                                <input
                                    v-model="editingPaper.title"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea
                                    v-model="editingPaper.description"
                                    class="form-control"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Price ($)</label>
                                <input
                                    v-model="editingPaper.price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    class="form-control"
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select v-model="editingPaper.status" class="form-select">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Current File</label>
                                <div>
                                    <a
                                        :href="editingPaper.file"
                                        target="_blank"
                                        class="btn btn-sm btn-outline-secondary"
                                    >
                                        <i class="bi bi-file-earmark-text me-1"></i> View Current
                                        File
                                    </a>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Replace File (optional)</label>
                                <input
                                    type="file"
                                    class="form-control"
                                    @change="handleFileChange"
                                    accept=".pdf,.doc,.docx"
                                />
                                <small class="text-muted">PDF or Word documents only</small>
                                <small v-if="newFile" class="text-success d-block mt-1">
                                    New file selected: {{ newFile.name }}
                                </small>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button
                                    type="button"
                                    class="btn btn-secondary me-2"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="btn btn-primary"
                                    :disabled="isSubmitting"
                                >
                                    <span v-if="isSubmitting">
                                        <span
                                            class="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Saving...
                                    </span>
                                    <span v-else>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
            class="modal fade"
            id="deleteConfirmationModal"
            tabindex="-1"
            aria-hidden="true"
            ref="deleteModal"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Deletion</h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            Are you sure you want to delete this paper? This action cannot be
                            undone.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            @click="handleDelete"
                            :disabled="isDeleting"
                        >
                            <span v-if="isDeleting">
                                <span
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Deleting...
                            </span>
                            <span v-else>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { Modal } from 'bootstrap';
import { toast } from 'vue3-toastify';

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
            pagination: {
                currentPage: 1,
                totalPages: 1,
                visiblePages: [], // Dynamic page range (e.g., [1, 2, 3])
            },

            // Edit modal state
            editingPaper: null,
            newFile: null,
            isSubmitting: false,

            // Delete modal state
            paperToDelete: null,
            isDeleting: false,
            isProcessing: false,

            // Modal instances
            editModal: null,
            deleteModal: null,
        };
    },
    computed: {
        ...mapGetters('papers', ['getPaperById']),
        ...mapState('papers', ['deletingPapers']),

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
    mounted() {
        this.editModal = new Modal(this.$refs.editModal);
        this.deleteModal = new Modal(this.$refs.deleteModal);
    },
    methods: {
        ...mapActions('papers', ['fetchUploadedPapers', 'updatePaper', 'deletePaper']),

        async fetchUploadedPapersHandler() {
            this.isLoading = true;
            try {
                const response = await this.fetchUploadedPapers({
                    page: this.pagination.currentPage,
                });

                // Update pagination from API response
                this.pagination.totalPages = Math.ceil(response.count / this.perPage);
                this.updateVisiblePages(); // Calculate visible page buttons

                this.uploadedPapersList = response.results;
            } catch (error) {
                console.error('Error loading papers:', error);
            } finally {
                this.isLoading = false;
            }
        },

        updateVisiblePages() {
            const range = 2;
            let start = Math.max(1, this.pagination.currentPage - range);
            let end = Math.min(this.pagination.totalPages, this.pagination.currentPage + range);

            this.pagination.visiblePages = Array.from(
                { length: end - start + 1 },
                (_, i) => start + i,
            );
        },

        openEditModal(paper) {
            this.editingPaper = { ...paper };
            this.newFile = null;
            this.editModal.show();
        },

        handleFileChange(event) {
            this.newFile = event.target.files[0];
        },

        validateEditForm() {
            if (!this.editingPaper.title || this.editingPaper.title.trim() === '') {
                toast.error('Title is required');
                return false;
            }

            if (this.editingPaper.price && isNaN(Number(this.editingPaper.price))) {
                toast.error('Price must be a valid number');
                return false;
            }

            if (
                this.newFile &&
                ![
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ].includes(this.newFile.type)
            ) {
                toast.error('Only PDF or Word documents are allowed');
                return false;
            }

            return true;
        },

        async submitEdit() {
            if (!this.validateEditForm()) return;
            this.isSubmitting = true;
            this.isProcessing = true;
            try {
                const formData = new FormData();
                formData.append('title', this.editingPaper.title);
                formData.append('description', this.editingPaper.description);
                formData.append('price', this.editingPaper.price);
                formData.append('status', this.editingPaper.status);

                if (this.newFile) {
                    formData.append('file', this.newFile);
                }

                await this.updatePaper({
                    paperId: this.editingPaper.id,
                    formData,
                });

                toast.success('Paper updated successfully');
                this.editModal.hide();
                await this.fetchUploadedPapersHandler();
            } catch (error) {
                if (error.response?.status === 400) {
                    const errors = error.response.data;
                    for (const [field, messages] of Object.entries(errors)) {
                        const message = Array.isArray(messages) ? messages.join(', ') : messages;
                        toast.error(`${field}: ${message}`);
                    }
                } else if (error.response?.status === 403) {
                    toast.error("You don't have permission to edit this paper");
                } else {
                    toast.error('Failed to update paper');
                    console.error('Update error:', error);
                }
            } finally {
                this.isSubmitting = false;
                this.isProcessing = false;
            }
        },

        confirmDelete(paperId) {
            this.paperToDelete = paperId;
            this.deleteModal.show();
        },

        async handleDelete() {
            if (!this.paperToDelete || this.isDeleting) return;

            this.isDeleting = true;
            this.isProcessing = true;

            try {
                await this.deletePaper(this.paperToDelete);
                toast.success('Paper deleted successfully');
                this.deleteModal.hide();
                await this.fetchUploadedPapersHandler();
            } catch (error) {
                if (error.response?.status === 403) {
                    toast.error("You don't have permission to delete this paper");
                } else if (error.response?.status === 404) {
                    toast.error('Paper not found');
                } else {
                    toast.error('Failed to delete paper');
                }
                console.error(error);
            } finally {
                this.isDeleting = false;
                this.isProcessing = false;
                this.paperToDelete = null;
            }
        },

        onSearch() {
            this.currentPage = 1;
        },
        changePage(page) {
            if (page >= 1 && page <= this.pagination.totalPages) {
                this.pagination.currentPage = page;
                this.fetchUploadedPapersHandler();
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

.btn-outline-primary,
.btn-outline-danger {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
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
