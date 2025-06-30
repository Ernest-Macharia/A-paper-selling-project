<template>
    <Navbar />
    <div class="container py-5">
        <h2 class="mb-4 text-primary-emphasis">Browse by Categories</h2>

        <!-- Search Bar -->
        <div class="mb-4 search-bar">
            <input
                v-model="searchQuery"
                @input="onSearch"
                type="text"
                class="form-control"
                placeholder="Search categories..."
            />
        </div>

        <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="categories.length === 0" class="text-center text-muted mt-5">
            <p>No categories found matching your search.</p>
        </div>

        <!-- Categories Table -->
        <div v-else class="table-responsive rounded-4 shadow-sm">
            <table class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th @click="toggleSort('name')" class="sortable">
                            Category Name
                            <i
                                v-if="sortKey === 'name'"
                                :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                                class="ms-2"
                            ></i>
                            <i v-else class="bi bi-caret-up bi bi-caret-down text-muted ms-2"></i>
                        </th>

                        <th @click="toggleSort('paper_count')" class="sortable">
                            Paper Count
                            <i
                                v-if="sortKey === 'paper_count'"
                                :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                                class="ms-2"
                            ></i>
                            <i v-else class="bi bi-caret-up bi bi-caret-down text-muted ms-2"></i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="category in sortedCategories" :key="category.id">
                        <td>
                            <router-link
                                :to="`/categories/${category.id}`"
                                class="text-decoration-none text-primary fw-semibold"
                            >
                                {{ category.name }}
                            </router-link>
                        </td>
                        <td>
                            <span v-if="category.paper_count > 0">
                                {{ category.paper_count }}
                                {{ category.paper_count === 1 ? 'paper' : 'papers' }}
                            </span>
                            <span v-else>No papers</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">« Prev</button>
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
                    <button class="page-link" @click="changePage(currentPage + 1)">Next »</button>
                </li>
            </ul>
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
.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable i {
    font-size: 0.85rem;
}
.search-bar input {
    max-width: 400px;
}
.pagination .page-link {
    color: #007bff;
    border: none;
    background-color: transparent;
}
.pagination .page-link:hover {
    background-color: #e9f5ff;
}
.pagination .active .page-link {
    background-color: #007bff;
    color: white;
    border-radius: 0.25rem;
}
</style>
