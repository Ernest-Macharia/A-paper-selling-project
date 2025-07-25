<template>
    <Navbar />

    <div class="container py-5">
        <!-- Header with Search and Sort -->
        <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        >
            <div>
                <h2 class="fw-bold mb-2">All Schools</h2>
                <p class="text-muted">Browse academic schools with available resources</p>
            </div>

            <div class="d-flex flex-column w-100 gap-3" style="max-width: 500px">
                <div class="input-group">
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
                            class="form-select form-select-sm w-auto"
                        >
                            <option value="name">Name</option>
                            <option value="paper_count">Paper Count</option>
                            <option value="course_count">Course Count</option>
                            <option value="average_rating">Rating</option>
                        </select>
                        <button
                            @click="toggleSortDirection"
                            class="btn btn-sm btn-outline-secondary"
                        >
                            <i :class="sortAsc ? 'bi bi-sort-down' : 'bi bi-sort-up'"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Loading schools...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="schools.length === 0" class="text-center py-5">
            <i class="bi bi-building display-5 text-muted opacity-50 mb-3"></i>
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
                        <h5 class="fw-bold mb-2">{{ school.name }}</h5>
                        <p class="text-muted small mb-3">{{ school.country }}</p>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-primary fw-bold small">
                                {{ school.paper_count || 0 }} Papers
                            </span>
                            <span class="text-primary fw-bold small">
                                {{ school.course_count || 0 }} Courses
                            </span>
                        </div>

                        <div class="d-flex justify-content-between">
                            <span class="text-warning small">
                                <i class="bi bi-star-fill"></i>
                                {{ school.average_rating?.toFixed(1) || 'N/A' }}
                            </span>
                            <span class="text-muted small">
                                <i class="bi bi-download"></i>
                                {{ school.total_downloads || 0 }}
                            </span>
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
            sortKey: 'name',
            sortAsc: true,
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
.school-card {
    transition: all 0.2s ease;
    border-radius: 12px;
    overflow: hidden;
}

.school-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.school-icon {
    transition: all 0.3s ease;
}

.school-card:hover .school-icon {
    background-color: #007bff !important;
    color: white !important;
}

.page-link {
    min-width: 40px;
    text-align: center;
}

.page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #f8f9fa;
}
</style>
