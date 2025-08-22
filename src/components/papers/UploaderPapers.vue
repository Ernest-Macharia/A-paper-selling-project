<template>
    <Navbar :categories="categories" :papers="papers" />
    <div class="container py-4">
        <!-- Hero Section -->
        <div class="hero-section text-center mb-5">
            <h1 class="display-5 fw-bold text-dark mb-3">
                <template v-if="isCurrentUser"> Your Uploaded Papers </template>
                <template v-else> Papers by {{ uploaderName }} </template>
            </h1>
            <p class="lead text-muted mb-4">
                <template v-if="isCurrentUser">
                    Manage and showcase your academic contributions
                </template>
                <template v-else> Browse this author's collection of academic resources </template>
            </p>

            <!-- Search and Filter Bar -->
            <div
                class="search-filter-container bg-white rounded-4 shadow-sm p-3 mx-auto"
                style="max-width: 800px"
            >
                <div class="row g-3">
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-transparent border-end-0">
                                <i class="bi bi-search text-muted"></i>
                            </span>
                            <input
                                v-model="searchQuery"
                                @input="applyFilters"
                                type="text"
                                class="form-control border-start-0 ps-0"
                                :placeholder="
                                    isCurrentUser ? 'Search your papers...' : 'Search papers...'
                                "
                            />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select
                            v-model="selectedCategory"
                            @change="applyFilters"
                            class="form-select"
                        >
                            <option value="">All Categories</option>
                            <option
                                v-for="category in categories"
                                :key="category.id"
                                :value="category.name"
                            >
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select v-model="sortKey" @change="applyFilters" class="form-select">
                            <option value="">Sort by</option>
                            <option value="title">Title (A–Z)</option>
                            <option value="-title">Title (Z–A)</option>
                            <option value="price">Price (Low → High)</option>
                            <option value="-price">Price (High → Low)</option>
                            <option value="upload_date">Date (Oldest)</option>
                            <option value="-upload_date">Date (Newest)</option>
                            <option value="school__name">School (A–Z)</option>
                            <option value="-school__name">School (Z–A)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5 my-5">
            <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">
                <template v-if="isCurrentUser"> Loading your papers... </template>
                <template v-else> Loading papers by {{ uploaderName }}... </template>
            </p>
        </div>

        <!-- Empty State -->
        <div v-else-if="papers.length === 0" class="empty-state text-center py-5 my-5">
            <i class="bi bi-file-earmark-x display-5 text-muted mb-4"></i>
            <h4 class="text-dark mb-2">
                <template v-if="isCurrentUser"> You haven't uploaded any papers yet </template>
                <template v-else> No papers found </template>
            </h4>
            <p class="text-muted">
                <template v-if="isCurrentUser">
                    Get started by uploading your first academic paper
                </template>
                <template v-else> This author hasn't shared any papers yet </template>
            </p>
            <template v-if="isCurrentUser">
                <router-link to="/dashboard/upload-file" class="btn btn-primary mt-3">
                    <i class="bi bi-upload me-2"></i>Upload Paper
                </router-link>
            </template>
            <button class="btn btn-outline-primary mt-3 ms-2" @click="resetFilters">
                <i class="bi bi-arrow-counterclockwise me-2"></i>Reset Filters
            </button>
        </div>

        <!-- Papers Grid -->
        <div v-else class="papers-grid">
            <div class="row g-4">
                <div v-for="paper in papers" :key="paper.id" class="col-lg-4 col-md-6">
                    <div class="paper-card card border-0 shadow-sm h-100 hover-lift">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span
                                    class="badge rounded-pill bg-primary bg-opacity-10 text-primary"
                                >
                                    {{ paper.category?.name || 'General' }}
                                </span>
                                <span class="text-muted small">
                                    <i class="bi bi-calendar me-1"></i>
                                    {{ formatDate(paper.upload_date) }}
                                </span>
                            </div>

                            <h5 class="card-title mb-3">
                                <router-link
                                    :to="{ name: 'paper-details', params: { id: paper.id } }"
                                    class="text-decoration-none text-dark stretched-link"
                                >
                                    {{ paper.title }}
                                </router-link>
                            </h5>

                            <p class="card-text text-muted mb-4 line-clamp-2">
                                {{
                                    paper.description?.substring(0, 120) ||
                                    'No description available'
                                }}...
                            </p>

                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-warning me-2">
                                        <i class="bi bi-star-fill"></i>
                                        {{ paper.average_rating?.toFixed(1) || '0.0' }}
                                    </span>
                                    <span class="text-muted small me-3">
                                        <i class="bi bi-download ms-2"></i>
                                        {{ paper.download_count || 0 }}
                                    </span>
                                </div>

                                <div>
                                    <span
                                        v-if="paper.is_free"
                                        class="badge bg-success bg-opacity-10 text-success"
                                    >
                                        Free Access
                                    </span>
                                    <span v-else class="text-primary fw-bold">
                                        ${{ paper.price || '0.00' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="d-flex justify-content-center mt-5">
                <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(currentPage - 1)">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                        </li>

                        <li
                            v-for="page in totalPages"
                            :key="page"
                            class="page-item"
                            :class="{ active: currentPage === page }"
                        >
                            <button class="page-link" @click="changePage(page)">
                                {{ page }}
                            </button>
                        </li>

                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="changePage(currentPage + 1)">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '@/components/home/Navbar.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'UploaderPapers',
    components: { Navbar },
    data() {
        return {
            papers: [],
            categories: [],
            searchQuery: '',
            selectedCategory: '',
            currentPage: 1,
            pageSize: 12,
            totalCount: 0,
            isLoading: false,
            sortKey: '',
            uploaderName: '',
            uploaderId: null,
        };
    },
    computed: {
        ...mapGetters('authentication', ['currentUser']),
        isCurrentUser() {
            return this.currentUser?.id === this.uploaderId;
        },
        totalPages() {
            return Math.ceil(this.totalCount / this.pageSize);
        },
    },
    created() {
        this.uploaderId = parseInt(this.$route.params.authorId);
        this.loadUploaderPapers();
        this.loadCategories();
    },
    methods: {
        ...mapActions('papers', ['fetchPapersByAuthor', 'fetchCategories']),
        async loadUploaderPapers() {
            this.isLoading = true;
            try {
                const response = await this.fetchPapersByAuthor({
                    authorId: this.uploaderId,
                    page: this.currentPage,
                    search: this.searchQuery,
                    ordering: this.sortKey,
                    category: this.selectedCategory,
                });
                this.papers = response.papers;
                this.totalCount = response.count;
                this.uploaderName = response.author_name || 'Unknown Author';
            } catch {
                this.papers = [];
                this.totalCount = 0;
            } finally {
                this.isLoading = false;
            }
        },
        async loadCategories() {
            try {
                const response = await this.fetchCategories();
                this.categories = response.results || response;
            } catch {
                this.categories = [];
            }
        },
        applyFilters() {
            this.currentPage = 1;
            this.loadUploaderPapers();
        },
        resetFilters() {
            this.searchQuery = '';
            this.selectedCategory = '';
            this.sortKey = '';
            this.currentPage = 1;
            this.loadUploaderPapers();
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.loadUploaderPapers();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
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
.hero-section {
    padding: 2rem 0;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 1rem;
    margin-bottom: 2rem;
}

.search-filter-container {
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.paper-card {
    border-radius: 0.75rem;
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100%;
}

.paper-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.hover-lift:hover {
    transform: translateY(-5px);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.empty-state {
    background-color: #f8f9fa;
    border-radius: 0.75rem;
    padding: 3rem;
}

.page-link {
    border: none;
    color: #495057;
    min-width: 40px;
    text-align: center;
    margin: 0 2px;
    border-radius: 0.5rem !important;
}

.page-item.active .page-link {
    background-color: #0d6efd;
    color: white;
}

.page-item:not(.active):not(.disabled) .page-link:hover {
    background-color: #e9ecef;
}

.input-group-text {
    background-color: transparent;
}

.form-control:focus,
.form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
    border-color: #86b7fe;
}

.badge {
    padding: 0.35em 0.65em;
    font-weight: 500;
}

@media (max-width: 768px) {
    .hero-section {
        padding: 1.5rem 0;
    }

    .search-filter-container {
        padding: 1rem !important;
    }

    .page-item {
        display: none;
    }

    .page-item:first-child,
    .page-item:last-child,
    .page-item.active {
        display: block;
    }
}
</style>
