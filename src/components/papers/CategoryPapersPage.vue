<template>
    <Navbar />
    <div class="container py-5">
        <!-- Breadcrumb Navigation -->
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/categories">All Categories</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ categoryName }}</li>
            </ol>
        </nav>

        <h2 class="mb-4 text-primary-emphasis">Papers in {{ categoryName }}</h2>

        <div class="row mb-4">
            <div class="col-md-6">
                <input
                    v-model="searchQuery"
                    @input="applyFilters"
                    type="text"
                    class="form-control"
                    placeholder="Search papers..."
                />
            </div>
            <div class="col-md-6">
                <select v-model="sortKey" @change="applyFilters" class="form-select">
                    <option value="title">Sort by Title</option>
                    <option value="upload_date">Sort by Upload Date</option>
                </select>
            </div>
        </div>

        <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="filteredPapers.length" class="table-responsive rounded-4 shadow-sm">
            <table class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th @click="toggleSort('title')" class="sortable">
                            Title
                            <i
                                v-if="sortKey === 'title'"
                                :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                                class="ms-2"
                            ></i>
                        </th>
                        <th>Price</th>
                        <th @click="toggleSort('upload_date')" class="sortable">
                            Upload Date
                            <i
                                v-if="sortKey === 'upload_date'"
                                :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                                class="ms-2"
                            ></i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="paper in paginatedPapers" :key="paper.id">
                        <td class="text-primary fw-semibold">
                            <router-link
                                :to="`/papers/${paper.id}`"
                                class="text-decoration-none text-primary"
                            >
                                {{ paper.title }}
                            </router-link>
                        </td>
                        <td class="fw-bold text-success">${{ paper.price }}</td>
                        <td>{{ formatDate(paper.upload_date) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="text-center text-muted mt-5">
            <p>No papers found for this category.</p>
        </div>

        <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
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
        </nav>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'CategoryPapersPage',
    components: {
        Navbar,
    },
    data() {
        return {
            filteredPapers: [],
            paginatedPapers: [],
            categoryName: '',
            searchQuery: '',
            sortKey: 'title',
            sortAsc: true,
            currentPage: 1,
            perPage: 5,
            isLoading: false,
        };
    },
    computed: {
        ...mapState('papers', ['allPapers']),
        totalPages() {
            return Math.ceil(this.filteredPapers.length / this.perPage);
        },
    },
    async created() {
        await this.loadCategoryPapers();
    },
    methods: {
        ...mapActions('papers', ['fetchCategoryPapers']),

        async loadCategoryPapers() {
            this.isLoading = true;
            const categoryId = this.$route.params.categoryId;
            try {
                const papers = await this.fetchCategoryPapers(categoryId);
                if (papers.length) {
                    this.categoryName = papers[0].category?.name || 'Unknown';
                }
                this.applyFilters();
            } catch {
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
            const query = this.searchQuery.toLowerCase();
            let filtered = this.allPapers.filter((p) => p.title.toLowerCase().includes(query));

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
};
</script>

<style scoped>
.breadcrumb {
    background: none;
    padding: 0;
}

.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable i {
    font-size: 0.85rem;
}

.pagination .page-link {
    color: #0d6efd;
    border: none;
    background-color: transparent;
}
.pagination .page-link:hover {
    background-color: #e9f5ff;
}
.pagination .active .page-link {
    background-color: #0d6efd;
    color: white;
    border-radius: 0.25rem;
}
</style>
