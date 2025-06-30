<template>
    <Navbar />
    <div class="container py-5">
        <h2 class="mb-4 text-primary-emphasis fw-bold">Explore Our Courses</h2>

        <!-- Search Input -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input
                    v-model="searchQuery"
                    @input="handleSearchInput"
                    type="text"
                    class="form-control"
                    placeholder="Search courses..."
                />
            </div>
        </div>

        <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="courses.length === 0" class="text-center text-muted my-5">
            <p>No courses found matching your search.</p>
        </div>

        <!-- Courses Table -->
        <div v-else class="table-responsive rounded-4 shadow-sm">
            <table class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th @click="toggleSort('name')" class="sortable">
                            Course Name
                            <i
                                v-if="sortKey === 'name'"
                                :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                                class="ms-2"
                            >
                            </i>
                            <i v-else class="bi bi-caret-up bi bi-caret-down text-muted ms-2"> </i>
                        </th>

                        <th @click="toggleSort('paper_count')" class="sortable">
                            Paper Count
                            <i
                                v-if="sortKey === 'paper_count'"
                                :class="sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"
                                class="ms-2"
                            >
                            </i>
                            <i v-else class="bi bi-caret-up bi bi-caret-down text-muted ms-2"> </i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="course in sortedCourses" :key="course.id" class="cursor-pointer">
                        <td>
                            <router-link
                                :to="`/courses/${course.id}`"
                                class="text-decoration-none text-primary fw-semibold"
                            >
                                {{ course.name }}
                            </router-link>
                        </td>
                        <td class="text-center">
                            <span v-if="course.paper_count > 0">
                                {{ course.paper_count }}
                                {{ course.paper_count === 1 ? 'paper' : 'papers' }}
                            </span>
                            <span v-else class="text-muted"> No papers </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
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
                    <button class="page-link" @click="changePage(page)">
                        {{ page }}
                    </button>
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
    name: 'CoursesPage',
    components: {
        Navbar,
        Footer,
    },

    data() {
        return {
            courses: [],
            searchQuery: '',
            currentPage: 1,
            totalPages: 1,
            isLoading: false,
            sortKey: 'name',
            sortAsc: true,
        };
    },

    computed: {
        sortedCourses() {
            return [...this.courses].sort((a, b) => {
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
        await this.loadCourses();
    },

    methods: {
        ...mapActions('papers', ['fetchCourses']),

        async loadCourses() {
            this.isLoading = true;
            try {
                const response = await this.fetchCourses({
                    search: this.searchQuery,
                    page: this.currentPage,
                });
                this.courses = response.results;
                const pageSize = 10;
                this.totalPages = Math.ceil(response.count / pageSize);
            } catch {
                this.courses = [];
            } finally {
                this.isLoading = false;
            }
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.loadCourses();
            }
        },

        goToCoursePapers(courseId) {
            this.$router.push({ name: 'CoursePapers', params: { courseId } });
        },

        handleSearchInput() {
            this.currentPage = 1;
            this.loadCourses();
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
.cursor-pointer {
    cursor: pointer;
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

.table td,
.table th {
    vertical-align: middle;
}
</style>
