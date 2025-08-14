<template>
    <Navbar />
    <div class="container py-4">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb bg-light p-3 rounded-3">
                <li class="breadcrumb-item">
                    <router-link to="/categories" class="text-decoration-none">
                        <i class="fas fa-chevron-left me-2"></i> All Categories
                    </router-link>
                </li>
                <li class="breadcrumb-item active text-primary" aria-current="page">
                    {{ categoryName }}
                </li>
            </ol>
        </nav>

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="fw-bold mb-1">Papers in {{ categoryName }}</h2>
                <p class="text-muted mb-0" v-if="!isLoading">
                    Showing {{ filteredPapers.length }} papers
                </p>
            </div>
        </div>

        <!-- Filter Bar -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-3">
                <div class="row g-3">
                    <div class="col-md-8">
                        <div class="input-group">
                            <span class="input-group-text bg-transparent border-end-0">
                                <i class="bi bi-search"></i>
                            </span>
                            <input
                                v-model="searchQuery"
                                @input="applyFilters"
                                type="text"
                                class="form-control border-start-0"
                                placeholder="Search papers by title..."
                            />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select v-model="sortKey" @change="applyFilters" class="form-select">
                            <option value="title">Sort by Title</option>
                            <option value="upload_date">Sort by Upload Date</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading papers...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredPapers.length" class="card border-0 shadow-sm text-center py-5">
            <i class="bi bi-file-earmark-text display-5 text-muted mb-3"></i>
            <h5 class="text-muted">No papers found</h5>
            <p class="text-muted mb-0">Try adjusting your search filters</p>
        </div>

        <!-- Papers Grid -->
        <div v-else class="row g-4">
            <div v-for="paper in paginatedPapers" :key="paper.id" class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <router-link :to="`/papers/${paper.id}`" class="text-decoration-none">
                                <h5 class="card-title text-primary fw-bold mb-1">
                                    {{ paper.title }}
                                </h5>
                            </router-link>
                            <span class="badge bg-success bg-opacity-10 text-success">
                                ${{ paper.price }}
                            </span>
                        </div>
                        <p class="text-muted small mb-3">
                            <i class="bi bi-calendar me-1"></i>
                            {{ formatDate(paper.upload_date) }}
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <router-link
                                :to="`/papers/${paper.id}`"
                                class="btn btn-sm btn-outline-primary"
                            >
                                View Details
                            </router-link>
                            <span class="badge bg-light text-muted small">
                                {{ paper.category?.name }}
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
    name: 'CategoryPapersPage',
    components: { Navbar },
    data() {
        return {
            allPapers: [],
            filteredPapers: [],
            paginatedPapers: [],
            categoryName: '',
            searchQuery: '',
            sortKey: 'title',
            sortAsc: true,
            currentPage: 1,
            perPage: 12,
            isLoading: false,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredPapers.length / this.perPage);
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
        ...mapActions('papers', ['fetchCategoryPapers']),

        async loadCategoryPapers() {
            this.isLoading = true;
            const categoryId = this.$route.params.categoryId;
            try {
                const papers = await this.fetchCategoryPapers(categoryId);
                this.allPapers = Array.isArray(papers) ? papers : [];
                if (this.allPapers.length) {
                    this.categoryName = this.allPapers[0].category?.name || 'Unknown';
                }
                this.applyFilters();
            } catch (error) {
                console.error('Error loading papers:', error);
                this.allPapers = [];
                this.categoryName = '';
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
            const papersArray = Array.isArray(this.allPapers) ? this.allPapers : [];
            const query = this.searchQuery.toLowerCase();

            let filtered = papersArray.filter(
                (p) => p && p.title && p.title.toLowerCase().includes(query),
            );

            filtered.sort((a, b) => {
                const aVal = this.sortKey === 'upload_date' ? new Date(a.upload_date) : a.title;
                const bVal = this.sortKey === 'upload_date' ? new Date(b.upload_date) : b.title;
                return this.sortAsc ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
            });

            this.filteredPapers = filtered;
            this.changePage(1);
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                const start = (page - 1) * this.perPage;
                const end = start + this.perPage;
                this.paginatedPapers = this.filteredPapers.slice(start, end);
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
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
        await this.loadCategoryPapers();
    },
};
</script>

<style scoped>
.hover-shadow {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}
.hover-shadow:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
}

.breadcrumb {
    --bs-breadcrumb-divider: '›';
}

.page-link {
    border-radius: 50% !important;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 4px;
    border: none !important;
}

.page-item.active .page-link {
    box-shadow: 0 4px 8px rgba(var(--bs-primary-rgb), 0.2);
}

.page-item:not(.active) .page-link:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.1);
}

.input-group-text {
    transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.1);
    border-color: var(--bs-primary);
}

.card-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
