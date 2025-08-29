<template>
    <Navbar :categories="categories" :papers="papers" />
    <div class="container py-4">
        <!-- Hero Section -->
        <div class="hero-section text-center mb-5">
            <div class="hero-content">
                <h1 class="display-5 fw-bold text-dark mb-3 animate-fade-in">
                    Discover Academic Excellence
                </h1>
                <p class="lead text-muted mb-4 animate-fade-in delay-1">
                    Browse our curated collection of high-quality research papers and academic
                    resources
                </p>
            </div>

            <!-- Search and Filter Bar -->
            <div
                class="search-filter-container bg-white rounded-4 shadow-sm p-4 mx-auto animate-fade-in delay-2"
                style="max-width: 800px"
            >
                <div class="row g-3">
                    <div class="col-md-5">
                        <div class="input-group input-group-lg">
                            <span class="input-group-text bg-transparent border-end-0">
                                <i class="bi bi-search text-muted"></i>
                            </span>
                            <input
                                v-model="searchQuery"
                                @input="filterPapers"
                                type="text"
                                class="form-control border-start-0 ps-0"
                                placeholder="Search papers, topics, or authors..."
                            />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select
                            v-model="selectedCategory"
                            @change="filterPapers"
                            class="form-select form-select-lg"
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
                    <div class="col-md-3">
                        <select
                            v-model="sortKey"
                            @change="toggleSort(sortKey)"
                            class="form-select form-select-lg"
                        >
                            <option value="">Sort by</option>
                            <option value="title">Title</option>
                            <option value="price">Price</option>
                            <option value="upload_date">Date</option>
                            <option value="school.name">School</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Bar -->
        <!-- <div class="stats-bar bg-white rounded-4 shadow-sm p-3 mb-5 animate-fade-in delay-3">
            <div class="row text-center">
                <div class="col-md-3 col-6">
                    <div class="stat-item">
                        <div class="stat-value text-primary fw-bold">
                            {{ filteredPapers.length }}
                        </div>
                        <div class="stat-label text-muted small">Papers Found</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="stat-item">
                        <div class="stat-value text-success fw-bold">{{ categories.length }}</div>
                        <div class="stat-label text-muted small">Categories</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="stat-item">
                        <div class="stat-value text-warning fw-bold">{{ freePapersCount }}</div>
                        <div class="stat-label text-muted small">Free Papers</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="stat-item">
                        <div class="stat-value text-info fw-bold">{{ premiumPapersCount }}</div>
                        <div class="stat-label text-muted small">Premium Papers</div>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5 my-5">
            <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading academic papers...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredPapers.length === 0" class="empty-state text-center py-5 my-5">
            <div class="empty-icon mb-4">
                <i class="bi bi-file-earmark-x display-4 text-muted"></i>
            </div>
            <h4 class="text-dark mb-2">No papers found</h4>
            <p class="text-muted mb-4">Try adjusting your search or filter criteria</p>
            <button class="btn btn-primary mt-3" @click="resetFilters">
                <i class="bi bi-arrow-counterclockwise me-2"></i>Reset Filters
            </button>
        </div>

        <!-- Papers Grid -->
        <div v-else class="papers-grid">
            <!-- Papers Cards - Updated to 3 columns -->
            <div class="row g-4">
                <div
                    v-for="(paper, index) in filteredPapers"
                    :key="paper.id"
                    class="col-lg-4 col-md-6"
                >
                    <div
                        class="paper-card card border-0 shadow-sm h-100 hover-lift"
                        :class="`paper-card-${index % 4}`"
                    >
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span
                                    class="badge rounded-pill bg-primary bg-opacity-10 text-primary fw-medium"
                                >
                                    {{ paper.category?.name || 'General' }}
                                </span>
                                <span class="text-muted small">
                                    <i class="bi bi-calendar me-1"></i
                                    >{{ formatDate(paper.upload_date) }}
                                </span>
                            </div>

                            <h5 class="card-title mb-3 text-dark">
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
                                        class="badge bg-success bg-opacity-10 text-success px-3 py-2"
                                    >
                                        Free Access
                                    </span>
                                    <span v-else class="text-primary fw-bold fs-5">
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
            totalPages: 1,
            isLoading: false,
            sortKey: '',
            sortAsc: true,
            allPapersLoaded: false,
        };
    },
    computed: {
        middlePages() {
            if (this.totalPages <= 7) return [];
            if (this.currentPage <= 3) return [2, 3, 4];
            if (this.currentPage >= this.totalPages - 2)
                return [this.totalPages - 3, this.totalPages - 2, this.totalPages - 1];
            return [this.currentPage - 1, this.currentPage, this.currentPage + 1];
        },
        freePapersCount() {
            return this.filteredPapers.filter((paper) => paper.is_free).length;
        },
        premiumPapersCount() {
            return this.filteredPapers.filter((paper) => !paper.is_free).length;
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
        this.loadPapers();
        this.loadCategories();
    },
    methods: {
        ...mapActions('papers', ['fetchAllPapers', 'fetchCategories']),
        async loadPapers(page = 1) {
            this.isLoading = true;
            try {
                const data = await this.fetchAllPapers({ page });
                this.papers = data.results || data;
                this.filteredPapers = [...this.papers];
                this.totalPages = Math.ceil(data.count / 12);
                this.currentPage = page;
            } catch (error) {
                console.error('Error loading papers:', error);
                this.papers = [];
            } finally {
                this.isLoading = false;
            }
        },

        async loadCategories() {
            try {
                const response = await this.fetchCategories();
                this.categories = response.results || response;
            } catch (err) {
                console.error('Error loading categories:', err);
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
                this.loadPapers(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        sortPapers() {
            if (!this.sortKey) return;

            const key = this.sortKey;
            const asc = this.sortAsc ? 1 : -1;

            this.filteredPapers.sort((a, b) => {
                const getNestedValue = (obj, path) => {
                    return path.split('.').reduce((o, p) => (o ? o[p] : ''), obj);
                };

                const valA = getNestedValue(a, key)?.toString().toLowerCase() || '';
                const valB = getNestedValue(b, key)?.toString().toLowerCase() || '';

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

<style scoped>
.hero-section {
    padding: 2rem 0;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 1rem;
    margin-bottom: 2rem;
}

.hero-content {
    padding: 0 1rem;
}

.search-filter-container {
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.search-filter-container:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stats-bar {
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-item {
    padding: 0.5rem;
}

.stat-value {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.875rem;
}

.paper-card {
    border-radius: 1rem;
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100%;
    border-top: 4px solid transparent;
}

.paper-card-0 {
    border-top-color: #4e54c8;
}

.paper-card-1 {
    border-top-color: #8f94fb;
}

.paper-card-2 {
    border-top-color: #00b4d8;
}

.paper-card-3 {
    border-top-color: #0077b6;
}

.paper-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
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
    border-radius: 1rem;
    padding: 3rem;
}

.empty-icon {
    opacity: 0.7;
}

.page-link {
    border: none;
    color: #495057;
    min-width: 40px;
    text-align: center;
    margin: 0 2px;
    border-radius: 0.5rem !important;
    transition: all 0.2s ease;
}

.page-item.active .page-link {
    background: linear-gradient(135deg, #4e54c8, #8f94fb);
    color: white;
}

.page-item:not(.active):not(.disabled) .page-link:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
}

.input-group-text {
    background-color: transparent;
}

.form-control:focus,
.form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(78, 84, 200, 0.15);
    border-color: #8f94fb;
}

.badge {
    padding: 0.5em 0.75em;
    font-weight: 500;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    opacity: 0;
    animation: fadeIn 0.6s ease forwards;
}

.delay-1 {
    animation-delay: 0.2s;
}
.delay-2 {
    animation-delay: 0.4s;
}
.delay-3 {
    animation-delay: 0.6s;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .hero-section {
        padding: 1.5rem 0;
    }

    .search-filter-container {
        padding: 1rem !important;
    }

    .stats-bar {
        padding: 1rem !important;
    }

    .stat-item {
        margin-bottom: 1rem;
    }

    .page-item {
        display: none;
    }

    .page-item:first-child,
    .page-item:last-child,
    .page-item.active {
        display: block;
    }

    .paper-card {
        margin-bottom: 1rem;
    }
}
</style>
