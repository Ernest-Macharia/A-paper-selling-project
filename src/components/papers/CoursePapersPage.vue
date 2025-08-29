<template>
    <Navbar />
    <div class="container py-4">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
            <ol
                class="breadcrumb p-3 rounded-3"
                style="background-color: rgba(var(--bs-primary-rgb), 0.1)"
            >
                <li class="breadcrumb-item">
                    <router-link to="/courses" class="text-decoration-none text-primary">
                        <i class="fas fa-chevron-left me-2"></i> All Courses
                    </router-link>
                </li>
                <li class="breadcrumb-item active text-primary fw-semibold" aria-current="page">
                    {{ courseName }}
                </li>
            </ol>
        </nav>

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="fw-bold mb-1 text-gradient-primary">Papers in {{ courseName }}</h2>
                <p class="text-muted mb-0" v-if="!isLoading">Showing {{ totalCount }} papers</p>
            </div>
        </div>

        <!-- Filter Bar -->
        <div class="card border-0 mb-4 filter-card">
            <div class="card-body p-4">
                <div class="row g-3 align-items-center">
                    <div class="col-md-8">
                        <div class="input-group input-group-lg">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="bi bi-search text-primary"></i>
                            </span>
                            <input
                                v-model="searchQuery"
                                @input="applyFilters"
                                type="text"
                                class="form-control border-start-0 bg-light py-2"
                                placeholder="Search papers by title..."
                            />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select
                            v-model="sortKey"
                            @change="applyFilters"
                            class="form-select form-select-lg py-2"
                        >
                            <option value="title">Sort by Title</option>
                            <option value="upload_date">Sort by Upload Date</option>
                            <option value="price">Sort by Price</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading papers...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!papers.length" class="card border-0 text-center py-5 empty-state-card">
            <div class="card-body">
                <i class="bi bi-file-earmark-text display-4 text-primary mb-3 opacity-50"></i>
                <h5 class="text-muted mb-2">No papers found</h5>
                <p class="text-muted mb-0">Try adjusting your search filters</p>
            </div>
        </div>

        <!-- Papers Grid -->
        <div v-else class="row g-4">
            <div v-for="paper in papers" :key="paper.id" class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm paper-card">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <router-link :to="`/papers/${paper.id}`" class="text-decoration-none">
                                <h5 class="card-title text-dark fw-bold mb-1 paper-title">
                                    {{ paper.title }}
                                </h5>
                            </router-link>
                            <span class="badge bg-primary bg-opacity-10 text-primary fs-6 py-2">
                                ${{ paper.price }}
                            </span>
                        </div>
                        <p class="text-muted small mb-3">
                            <i class="bi bi-calendar me-1"></i>
                            {{ formatDate(paper.upload_date) }}
                        </p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <router-link
                                :to="`/papers/${paper.id}`"
                                class="btn btn-sm btn-primary rounded-pill px-3"
                            >
                                View Details
                            </router-link>
                            <span class="badge bg-light text-dark small fw-normal">
                                {{ paper.course?.name }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="mt-5">
            <ul class="pagination justify-content-center">
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
                    :class="{
                        active: currentPage === page,
                        disabled: page === '...',
                    }"
                >
                    <button class="page-link" @click="changePage(page)" :disabled="page === '...'">
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
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'CoursePapersPage',
    components: { Navbar },
    data() {
        return {
            papers: [],
            courseName: '',
            searchQuery: '',
            sortKey: 'title',
            sortAsc: true,
            currentPage: 1,
            perPage: 12,
            totalCount: 0,
            isLoading: false,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalCount / this.perPage);
        },
        visiblePages() {
            const range = 2;
            const pages = [];
            let start = Math.max(1, this.currentPage - range);
            let end = Math.min(this.totalPages, this.currentPage + range);

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < this.totalPages) {
                if (end < this.totalPages - 1) pages.push('...');
                pages.push(this.totalPages);
            }

            return pages;
        },
    },
    methods: {
        ...mapActions('papers', ['fetchCoursePapers']),

        async loadCoursePapers() {
            this.isLoading = true;
            const courseId = this.$route.params.courseId;

            try {
                const ordering = this.sortAsc ? this.sortKey : `-${this.sortKey}`;

                const response = await this.fetchCoursePapers({
                    courseId,
                    params: {
                        search: this.searchQuery,
                        ordering,
                        page: this.currentPage,
                        page_size: this.perPage,
                    },
                });

                this.papers = response.results || [];
                this.totalCount = response.count || 0;

                if (this.papers.length) {
                    this.courseName = this.papers[0].course?.name || 'Unknown';
                }
            } catch (error) {
                console.error('Error loading papers:', error);
                this.papers = [];
                this.courseName = '';
                this.totalCount = 0;
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

        applyFilters() {
            this.currentPage = 1;
            this.loadCoursePapers();
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.loadCoursePapers();
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
            this.applyFilters();
        },
    },
    async created() {
        await this.loadCoursePapers();
    },
};
</script>

<style scoped>
/* Text gradient for the header */
.text-gradient-primary {
    background: linear-gradient(135deg, var(--bs-primary) 0%, #4a6cf7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Enhanced card styling */
.paper-card {
    transition: all 0.3s ease;
    border-radius: 12px;
    overflow: hidden;
}

.paper-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.paper-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--bs-primary) 0%, #4a6cf7 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.paper-card:hover::before {
    opacity: 1;
}

.paper-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s ease;
}

.paper-title:hover {
    color: var(--bs-primary) !important;
}

/* Filter card styling */
.filter-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
    border-radius: 12px;
}

/* Empty state card */
.empty-state-card {
    background-color: rgba(var(--bs-primary-rgb), 0.03);
    border-radius: 12px;
}

/* Breadcrumb styling */
.breadcrumb {
    --bs-breadcrumb-divider: '›';
    border-radius: 10px;
}

/* Pagination styling */
.page-link {
    border-radius: 8px !important;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 4px;
    border: 1px solid #dee2e6 !important;
    color: #6c757d;
    font-weight: 500;
}

.page-item.active .page-link {
    background: linear-gradient(135deg, var(--bs-primary) 0%, #4a6cf7 100%);
    border-color: var(--bs-primary);
    box-shadow: 0 4px 10px rgba(var(--bs-primary-rgb), 0.25);
}

.page-item:not(.active) .page-link:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.1);
    color: var(--bs-primary);
    border-color: rgba(var(--bs-primary-rgb), 0.3);
}

/* Form control enhancements */
.form-control:focus,
.form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
    border-color: var(--bs-primary);
}

.input-group-text {
    transition: all 0.2s ease;
}

/* Loading spinner size */
.spinner-grow {
    width: 3rem;
    height: 3rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .filter-card .card-body {
        padding: 1.5rem !important;
    }

    .input-group,
    .form-select {
        margin-bottom: 0.5rem;
    }
}
</style>
