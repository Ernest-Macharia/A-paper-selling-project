<template>
    <Navbar />

    <div class="container py-5">
        <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        >
            <div>
                <h2 class="fw-bold mb-2">All Categories</h2>
                <p class="text-muted">Browse academic resources by subject category</p>
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
                        placeholder="Search categories..."
                    />
                </div>

                <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small">Sort by:</span>
                    <select
                        v-model="sortKey"
                        @change="loadCategories"
                        class="form-select form-select-sm w-auto"
                    >
                        <option value="name">Name</option>
                        <option value="paper_count">Paper Count</option>
                        <option value="average_rating">Rating</option>
                    </select>
                    <button @click="toggleSortDirection" class="btn btn-sm btn-outline-secondary">
                        <i :class="sortAsc ? 'bi bi-sort-down' : 'bi bi-sort-up'"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Loading categories...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="categories.length === 0" class="text-center py-5">
            <i class="bi bi-folder-x display-5 text-muted opacity-50 mb-3"></i>
            <h5 class="fw-semibold">No categories available</h5>
            <p class="text-muted">Try adjusting your search filters</p>
        </div>

        <!-- Categories Grid -->
        <div v-else class="row g-4">
            <div
                v-for="category in categories"
                :key="category.id"
                class="col-md-6 col-lg-4 col-xl-3"
            >
                <div class="category-card card h-100 border-0 shadow-sm transition-all">
                    <div class="card-body p-4">
                        <div
                            class="category-icon bg-primary bg-opacity-10 text-primary rounded-3 mb-3 p-3 d-inline-flex"
                        >
                            <i class="bi bi-collection fs-4"></i>
                        </div>
                        <h5 class="fw-bold mb-2">{{ category.name }}</h5>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-primary fw-bold small">
                                {{ category.paper_count || 0 }} Papers
                            </span>
                            <span v-if="category.average_rating" class="text-warning small">
                                <i class="bi bi-star-fill"></i>
                                {{ category.average_rating.toFixed(1) }}
                            </span>
                        </div>

                        <div class="progress mb-2" style="height: 6px">
                            <div
                                class="progress-bar bg-primary"
                                :style="{
                                    width:
                                        Math.min((category.paper_count / maxPapers) * 100, 100) +
                                        '%',
                                }"
                            ></div>
                        </div>
                    </div>

                    <router-link
                        :to="`/categories/${category.id}`"
                        class="stretched-link"
                    ></router-link>
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
                    <template v-if="totalPages <= 5">
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
                        <!-- Dynamic pagination for many pages -->
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
    name: 'CategoriesPage',
    components: {
        Navbar,
        Footer,
    },

    data() {
        return {
            categories: [],
            searchQuery: '',
            currentPage: 1,
            totalPages: 1,
            maxPapers: 0,
            isLoading: false,
            sortKey: 'paper_count',
            sortAsc: false,
        };
    },

    async created() {
        await this.loadCategories();
    },

    methods: {
        ...mapActions('papers', ['fetchCategories']),

        async loadCategories() {
            this.isLoading = true;
            try {
                const response = await this.fetchCategories({
                    search: this.searchQuery,
                    page: this.currentPage,
                    ordering: this.sortAsc ? this.sortKey : `-${this.sortKey}`,
                });

                this.categories = response.results;
                const pageSize = 12;
                this.totalPages = Math.ceil(response.count / pageSize);

                // Update maxPapers for the progress bar
                this.maxPapers = Math.max(...this.categories.map((c) => c.paper_count || 0));
            } catch (error) {
                console.error('Failed to load categories:', error);
                this.categories = [];
            } finally {
                this.isLoading = false;
            }
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.loadCategories();
            }
        },

        handleSearchInput() {
            this.currentPage = 1;
            this.loadCategories();
        },

        toggleSortDirection() {
            this.sortAsc = !this.sortAsc;
            this.currentPage = 1;
            this.loadCategories();
        },
    },
};
</script>

<style scoped>
.category-card {
    transition: all 0.2s ease;
    border-radius: 12px;
    overflow: hidden;
}

.category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.category-icon {
    transition: all 0.3s ease;
}

.category-card:hover .category-icon {
    background-color: #007bff !important;
    color: white !important;
}

.progress {
    background-color: #f8f9fa;
    border-radius: 3px;
}
select option[disabled] {
    color: #6c757d;
    font-style: italic;
}
</style>
