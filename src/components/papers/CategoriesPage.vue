<template>
    <Navbar />

    <div class="container py-5">
        <!-- Header with Search -->
        <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        >
            <div>
                <h2 class="fw-bold mb-2">Browse Categories</h2>
                <p class="text-muted">Explore academic resources by subject</p>
            </div>

            <div class="search-bar w-100" style="max-width: 400px">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search text-muted"></i>
                    </span>
                    <input
                        v-model="searchQuery"
                        @input="onSearch"
                        type="text"
                        class="form-control border-start-0"
                        placeholder="Search categories..."
                    />
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Loading categories...</p>
        </div>

        <!-- Empty State -->
        <div
            v-else-if="Array.isArray(categories) && categories.length === 0"
            class="text-center py-5"
        >
            <i class="bi bi-folder-x display-5 text-muted opacity-50 mb-3"></i>
            <h5 class="fw-semibold">No categories found</h5>
            <p class="text-muted">Try adjusting your search or check back later</p>
        </div>

        <!-- Categories Grid -->
        <div v-else class="row g-4">
            <div v-for="category in sortedCategories" :key="category.id" class="col-md-6 col-lg-4">
                <router-link
                    :to="`/categories/${category.id}`"
                    class="category-card card h-100 border-0 shadow-sm text-decoration-none transition-all"
                >
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="fw-bold mb-0 text-primary">{{ category.name }}</h5>
                            <span
                                class="badge rounded-pill"
                                :class="
                                    category.paper_count > 0
                                        ? 'bg-primary bg-opacity-10 text-primary'
                                        : 'bg-light text-muted'
                                "
                            >
                                {{ category.paper_count || 0 }}
                                {{ category.paper_count === 1 ? 'Paper' : 'Papers' }}
                            </span>
                        </div>
                        <p class="text-muted mb-0 small">
                            {{
                                category.description ||
                                'Explore academic resources in this category'
                            }}
                        </p>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 pt-0 pb-3 px-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted small">
                                <i class="bi bi-clock-history me-1"></i> Updated recently
                            </span>
                            <i class="bi bi-arrow-right-short text-primary"></i>
                        </div>
                    </div>
                </router-link>
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
                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
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
            sortKey: 'name',
            sortAsc: true,
            isLoading: false,
        };
    },

    computed: {
        sortedCategories() {
            if (!Array.isArray(this.categories)) return [];

            return [...this.categories].sort((a, b) => {
                const aVal = a[this.sortKey];
                const bVal = b[this.sortKey];

                if (typeof aVal === 'string') {
                    return this.sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                } else {
                    return this.sortAsc ? aVal - bVal : bVal - aVal;
                }
            });
        },
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
                });

                this.categories = response.results;
                this.totalPages = Math.ceil(response.count / 10);
            } catch {
                this.categories = [];
            }
            this.isLoading = false;
        },

        onSearch() {
            this.currentPage = 1;
            this.loadCategories();
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.loadCategories();
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
    },
};
</script>

<style scoped>
.category-card {
    transition: all 0.2s ease;
    border-radius: 12px;
}

.category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.search-bar .form-control:focus {
    box-shadow: none;
    border-color: #dee2e6;
}

.pagination .page-link {
    border: none;
    color: #495057;
    margin: 0 4px;
    border-radius: 8px !important;
}

.pagination .active .page-link {
    background-color: #007bff;
    color: white;
}

.transition-all {
    transition: all 0.3s ease;
}
</style>
