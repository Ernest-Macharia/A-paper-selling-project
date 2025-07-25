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
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text bg-transparent border-end-0">
                                <i class="bi bi-search text-muted"></i>
                            </span>
                            <input
                                v-model="searchQuery"
                                @input="filterPapers"
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
                            @change="filterPapers"
                            class="form-select"
                        >
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
                    <div class="col-md-6">
                        <select v-model="sortKey" @change="toggleSort(sortKey)" class="form-select">
                            <option value="">Sort by</option>
                            <option value="title">Title</option>
                            <option value="price">Price</option>
                            <option value="upload_date">Date</option>
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
        <div v-else-if="filteredPapers.length === 0" class="empty-state text-center py-5 my-5">
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
            <router-link to="/papers" class="btn btn-outline-primary mt-3 ms-2">
                <i class="bi bi-arrow-left me-2"></i>Browse All Papers
            </router-link>
        </div>

        <!-- Papers Grid -->
        <div v-else class="papers-grid">
            <!-- Papers Cards -->
            <div class="row g-4">
                <div v-for="paper in paginatedPapers" :key="paper.id" class="col-lg-6">
                    <div class="paper-card card border-0 shadow-sm h-100 hover-lift">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span
                                    class="badge rounded-pill bg-primary bg-opacity-10 text-primary"
                                >
                                    {{ paper.category?.name || 'General' }}
                                </span>
                                <span class="text-muted small">
                                    <i class="bi bi-calendar me-1"></i
                                    >{{ formatDate(paper.upload_date) }}
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

                        <template v-if="totalPages <= 7">
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
                        </template>

                        <template v-else>
                            <li :class="{ active: currentPage === 1 }" class="page-item">
                                <button class="page-link" @click="changePage(1)">1</button>
                            </li>

                            <li v-if="currentPage > 3" class="page-item disabled">
                                <span class="page-link">...</span>
                            </li>

                            <li
                                v-for="page in middlePages"
                                :key="page"
                                class="page-item"
                                :class="{ active: currentPage === page }"
                            >
                                <button class="page-link" @click="changePage(page)">
                                    {{ page }}
                                </button>
                            </li>

                            <li v-if="currentPage < totalPages - 2" class="page-item disabled">
                                <span class="page-link">...</span>
                            </li>

                            <li :class="{ active: currentPage === totalPages }" class="page-item">
                                <button class="page-link" @click="changePage(totalPages)">
                                    {{ totalPages }}
                                </button>
                            </li>
                        </template>

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
            filteredPapers: [],
            categories: [],
            searchQuery: '',
            selectedCategory: '',
            currentPage: 1,
            pageSize: 6,
            isLoading: false,
            sortKey: '',
            sortAsc: true,
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
            return Math.ceil(this.filteredPapers.length / this.pageSize);
        },
        paginatedPapers() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredPapers.slice(start, start + this.pageSize);
        },
        middlePages() {
            if (this.totalPages <= 7) return [];
            if (this.currentPage <= 3) return [2, 3, 4];
            if (this.currentPage >= this.totalPages - 2)
                return [this.totalPages - 3, this.totalPages - 2, this.totalPages - 1];
            return [this.currentPage - 1, this.currentPage, this.currentPage + 1];
        },
    },
    watch: {
        searchQuery() {
            this.filterPapers();
        },
        selectedCategory() {
            this.filterPapers();
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
                const response = await this.fetchPapersByAuthor(this.uploaderId);
                this.papers = response.papers;
                this.filteredPapers = response.papers;
                this.uploaderName = response.author_name || 'Unknown Author';
            } catch {
                this.papers = [];
            } finally {
                this.isLoading = false;
            }
        },
        async loadCategories() {
            try {
                const response = await this.fetchCategories();
                this.categories = response.results;
            } catch (err) {
                this.categories = [];
            }
        },
        filterPapers() {
            const query = this.searchQuery.toLowerCase();
            this.filteredPapers = this.papers.filter((paper) => {
                const matchesTitle = paper.title.toLowerCase().includes(query);
                const matchesDesc = paper.description?.toLowerCase().includes(query) || false;
                const matchesCategory =
                    !this.selectedCategory ||
                    paper.category?.name?.toLowerCase?.() === this.selectedCategory;
                return (matchesTitle || matchesDesc) && matchesCategory;
            });
            this.sortPapers();
            this.currentPage = 1;
        },
        resetFilters() {
            this.searchQuery = '';
            this.selectedCategory = '';
            this.sortKey = '';
            this.sortAsc = true;
            this.filteredPapers = [...this.papers];
            this.currentPage = 1;
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        sortPapers() {
            if (!this.sortKey) return;

            const key = this.sortKey;
            const asc = this.sortAsc ? 1 : -1;

            this.filteredPapers.sort((a, b) => {
                const valA = a[key]?.toString().toLowerCase?.() || '';
                const valB = b[key]?.toString().toLowerCase?.() || '';

                if (!isNaN(a[key]) && !isNaN(b[key])) {
                    return (a[key] - b[key]) * asc;
                }
                if (key === 'upload_date') {
                    return (new Date(a[key]) - new Date(b[key])) * asc;
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
