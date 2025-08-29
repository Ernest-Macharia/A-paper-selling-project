<template>
    <Navbar />

    <div class="container py-5">
        <!-- Header with Search and Sort -->
        <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        >
            <div>
                <h2 class="fw-bold mb-2 text-gradient-primary">All Schools</h2>
                <p class="text-muted">Browse academic schools with available resources</p>
            </div>

            <div class="d-flex flex-column w-100 gap-3" style="max-width: 500px">
                <div class="input-group search-container">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search text-muted"></i>
                    </span>
                    <input
                        v-model="searchQuery"
                        @input="handleSearchInput"
                        type="text"
                        class="form-control border-start-0"
                        placeholder="Search schools..."
                    />
                </div>

                <div class="d-flex flex-wrap align-items-center gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <span class="text-muted small">Sort by:</span>
                        <select
                            v-model="sortKey"
                            @change="loadSchools"
                            class="form-select form-select-sm w-auto custom-select"
                        >
                            <option value="name">Name</option>
                            <option value="paper_count">Paper Count</option>
                            <option value="course_count">Course Count</option>
                            <option value="average_rating">Rating</option>
                        </select>
                        <button @click="toggleSortDirection" class="btn btn-sm sort-direction-btn">
                            <i :class="sortAsc ? 'bi bi-sort-down-alt' : 'bi bi-sort-up-alt'"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading schools...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="schools.length === 0" class="text-center py-5">
            <div class="empty-state-icon mb-4">
                <i class="bi bi-building display-4"></i>
            </div>
            <h5 class="fw-semibold">No schools available</h5>
            <p class="text-muted">Try adjusting your search filters</p>
        </div>

        <!-- Schools Grid -->
        <div v-else class="row g-4">
            <div v-for="school in schools" :key="school.id" class="col-md-6 col-lg-4 col-xl-3">
                <div class="school-card card h-100 border-0 shadow-sm transition-all">
                    <div class="card-body p-4">
                        <div
                            class="school-icon bg-primary bg-opacity-10 text-primary rounded-3 mb-3 p-3 d-inline-flex"
                        >
                            <i class="bi bi-building fs-4"></i>
                        </div>
                        <h5 class="fw-bold mb-2 text-truncate">{{ school.name }}</h5>
                        <div class="country-flag mb-3">
                            <span class="badge bg-light text-dark">
                                <i class="bi bi-geo-alt me-1"></i>{{ school.country }}
                            </span>
                        </div>

                        <div class="stats-container mb-3">
                            <div class="stat-item">
                                <div class="stat-icon paper-icon">
                                    <i class="bi bi-file-text"></i>
                                </div>
                                <div>
                                    <div class="stat-value">{{ school.paper_count || 0 }}</div>
                                    <div class="stat-label">Papers</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon course-icon">
                                    <i class="bi bi-journal-bookmark"></i>
                                </div>
                                <div>
                                    <div class="stat-value">{{ school.course_count || 0 }}</div>
                                    <div class="stat-label">Courses</div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="d-flex justify-content-between align-items-center pt-2 border-top"
                        >
                            <div class="rating-badge">
                                <i class="bi bi-star-fill"></i>
                                {{ school.average_rating?.toFixed(1) || 'N/A' }}
                            </div>
                            <div class="download-badge">
                                <i class="bi bi-download"></i>
                                {{ school.total_downloads || 0 }}
                            </div>
                        </div>
                    </div>

                    <router-link :to="`/schools/${school.id}`" class="stretched-link"></router-link>
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
                            <button class="page-link" @click="changePage(page)">{{ page }}</button>
                        </li>
                    </template>
                    <template v-else>
                        <li :class="{ active: currentPage === 1 }" class="page-item">
                            <button class="page-link" @click="changePage(1)">1</button>
                        </li>

                        <li v-if="currentPage > 3" class="page-item disabled">
                            <span class="page-link">...</span>
                        </li>

                        <template v-for="page in middlePages" :key="page">
                            <li :class="{ active: currentPage === page }" class="page-item">
                                <button class="page-link" @click="changePage(page)">
                                    {{ page }}
                                </button>
                            </li>
                        </template>

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

    <Footer />
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/components/home/Navbar.vue';
import Footer from '@/components/home/Footer.vue';

export default {
    name: 'SchoolsPage',
    components: {
        Navbar,
        Footer,
    },

    data() {
        return {
            schools: [],
            searchQuery: '',
            countryFilter: '',
            currentPage: 1,
            totalPages: 1,
            isLoading: false,
            sortKey: 'paper_count',
            sortAsc: false,
            debounceTimer: null,
        };
    },

    computed: {
        middlePages() {
            if (this.totalPages <= 7) return [];

            let start = Math.max(2, this.currentPage - 1);
            let end = Math.min(this.totalPages - 1, this.currentPage + 1);

            // Adjust if we're near the start or end
            if (this.currentPage <= 3) {
                start = 2;
                end = 4;
            } else if (this.currentPage >= this.totalPages - 2) {
                start = this.totalPages - 3;
                end = this.totalPages - 1;
            }

            const pages = [];
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },
    },

    async created() {
        await this.loadSchools();
    },

    methods: {
        ...mapActions('papers', ['fetchSchools']),

        async loadSchools() {
            this.isLoading = true;
            try {
                const params = {
                    search: this.searchQuery,
                    page: this.currentPage,
                    ordering: this.sortAsc ? this.sortKey : `-${this.sortKey}`,
                    country: this.countryFilter || undefined,
                };

                const response = await this.fetchSchools(params);

                this.schools = response.results;
                this.totalPages = Math.ceil(response.count / (response.page_size || 12));
            } catch (error) {
                console.error('Failed to load schools:', error);
                this.schools = [];
                this.totalPages = 1;
            } finally {
                this.isLoading = false;
            }
        },

        handleSearchInput() {
            // Debounce the search input
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.currentPage = 1;
                this.loadSchools();
            }, 500);
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
                this.currentPage = page;
                this.loadSchools();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        toggleSortDirection() {
            this.sortAsc = !this.sortAsc;
            this.currentPage = 1;
            this.loadSchools();
        },
    },
};
</script>

<style scoped>
/* Text gradient for header */
.text-gradient-primary {
    background: linear-gradient(90deg, #007bff, #6610f2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Enhanced search container */
.search-container {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.search-container:focus-within {
    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.15);
    transform: translateY(-2px);
}

/* Custom select styling */
.custom-select {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23007bff' viewBox='0 0 16 16'%3E%3Cpath d='M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 16px 12px;
    padding-right: 2rem;
}

/* Sort direction button */
.sort-direction-btn {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border: 1px solid #dee2e6;
    border-radius: 8px;
    color: #495057;
    transition: all 0.2s ease;
}

.sort-direction-btn:hover {
    background: linear-gradient(135deg, #e9ecef, #dee2e6);
    color: #007bff;
}

/* Enhanced school card */
.school-card {
    transition: all 0.3s ease;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
}

.school-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.school-icon {
    transition: all 0.3s ease;
    background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(102, 16, 242, 0.1)) !important;
}

.school-card:hover .school-icon {
    background: linear-gradient(135deg, #007bff, #6610f2) !important;
    color: white !important;
    transform: scale(1.05);
}

/* Stats container */
.stats-container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.stat-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.paper-icon {
    background: rgba(86, 197, 249, 0.15);
    color: #56c5f9;
}

.course-icon {
    background: rgba(255, 184, 0, 0.15);
    color: #ffb800;
}

.stat-value {
    font-weight: 700;
    font-size: 1.1rem;
    line-height: 1;
    color: #2d3748;
}

.stat-label {
    font-size: 0.75rem;
    color: #718096;
}

/* Rating and download badges */
.rating-badge {
    background: rgba(255, 184, 0, 0.1);
    color: #e9b800;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
}

.download-badge {
    background: rgba(123, 97, 255, 0.1);
    color: #7b61ff;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
}

/* Empty state icon */
.empty-state-icon {
    color: #c5cee0;
    opacity: 0.7;
}

/* Country flag styling */
.country-flag .badge {
    border-radius: 8px;
    font-size: 0.75rem;
    padding: 0.35rem 0.65rem;
}

/* Pagination styling */
.page-link {
    min-width: 40px;
    text-align: center;
    border-radius: 8px;
    margin: 0 2px;
    border: 1px solid #edf2f7;
    color: #4a5568;
}

.page-item.active .page-link {
    background: linear-gradient(135deg, #007bff, #6610f2);
    border-color: #007bff;
}

.page-link:hover {
    background-color: #f7fafc;
    border-color: #e2e8f0;
}

.page-item.disabled .page-link {
    color: #a0aec0;
    background-color: #f7fafc;
}
</style>
