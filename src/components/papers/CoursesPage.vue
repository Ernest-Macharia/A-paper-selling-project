<template>
    <Navbar />

    <div class="container py-5">
        <!-- Header with Search and Sort -->
        <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        >
            <div>
                <h2 class="fw-bold mb-2">All Courses</h2>
                <p class="text-muted">Browse academic courses with available resources</p>
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
                        placeholder="Search courses..."
                    />
                </div>

                <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small">Sort by:</span>
                    <select
                        v-model="sortKey"
                        @change="toggleSort"
                        class="form-select form-select-sm w-auto"
                    >
                        <option value="name">Name</option>
                        <option value="paper_count">Paper Count</option>
                    </select>
                    <button @click="sortAsc = !sortAsc" class="btn btn-sm btn-outline-secondary">
                        <i :class="sortAsc ? 'bi bi-sort-down' : 'bi bi-sort-up'"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Loading courses...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="courses.length === 0" class="text-center py-5">
            <i class="bi bi-book display-5 text-muted opacity-50 mb-3"></i>
            <h5 class="fw-semibold">No courses available</h5>
            <p class="text-muted">Try adjusting your search filters</p>
        </div>

        <!-- Courses Grid -->
        <div v-else class="row g-4">
            <div
                v-for="course in sortedCourses"
                :key="course.id"
                class="col-md-6 col-lg-4 col-xl-3"
            >
                <div class="course-card card h-100 border-0 shadow-sm transition-all">
                    <div class="card-body p-4">
                        <div
                            class="course-icon bg-primary bg-opacity-10 text-primary rounded-3 mb-3 p-3 d-inline-flex"
                        >
                            <i class="bi bi-journal-text fs-4"></i>
                        </div>
                        <h5 class="fw-bold mb-2">{{ course.name }}</h5>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span class="badge bg-primary bg-opacity-10 text-primary small">
                                    {{ course.department || 'General' }}
                                </span>
                            </div>
                            <span class="text-primary fw-bold small">
                                {{ course.paper_count || 0 }} Papers
                            </span>
                        </div>

                        <div class="progress mb-2" style="height: 6px">
                            <div
                                class="progress-bar bg-primary"
                                :style="{
                                    width:
                                        Math.min((course.paper_count / maxPapers) * 100, 100) + '%',
                                }"
                            ></div>
                        </div>
                    </div>

                    <router-link :to="`/courses/${course.id}`" class="stretched-link"></router-link>
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
.course-card {
    transition: all 0.2s ease;
    border-radius: 12px;
    overflow: hidden;
}

.course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.course-icon {
    transition: all 0.3s ease;
}

.course-card:hover .course-icon {
    background-color: #007bff !important;
    color: white !important;
}

.progress {
    background-color: #f8f9fa;
    border-radius: 3px;
}
</style>
