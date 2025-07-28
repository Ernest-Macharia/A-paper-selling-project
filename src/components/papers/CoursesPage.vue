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
                        @change="loadCourses"
                        class="form-select form-select-sm w-auto"
                    >
                        <option value="name">Name</option>
                        <option value="paper_count" selected>Paper Count</option>
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
            <div v-for="course in courses" :key="course.id" class="col-md-6 col-lg-4 col-xl-3">
                <div class="course-card card h-100 border-0 shadow-sm transition-all">
                    <div class="card-body p-4">
                        <div
                            class="course-icon bg-primary bg-opacity-10 text-primary rounded-3 mb-3 p-3 d-inline-flex"
                        >
                            <i class="bi bi-journal-text fs-4"></i>
                        </div>
                        <h5 class="fw-bold mb-2">{{ course.name }}</h5>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-primary fw-bold small">
                                {{ course.paper_count || 0 }} Papers
                            </span>
                        </div>
                        <!-- <span class="text-primary fw-bold small">
                            {{ course.school_name }}
                        </span> -->

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

                    <!-- Always show first page -->
                    <li class="page-item" :class="{ active: currentPage === 1 }">
                        <button class="page-link" @click="changePage(1)">1</button>
                    </li>

                    <!-- Show ellipsis if needed -->
                    <li v-if="currentPage > 3" class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>

                    <!-- Show surrounding pages -->
                    <template v-for="page in middlePages">
                        <li class="page-item" :class="{ active: currentPage === page }">
                            <button class="page-link" @click="changePage(page)">{{ page }}</button>
                        </li>
                    </template>

                    <!-- Show ellipsis if needed -->
                    <li v-if="currentPage < totalPages - 2" class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>

                    <!-- Always show last page if different from first -->
                    <li
                        v-if="totalPages > 1"
                        class="page-item"
                        :class="{ active: currentPage === totalPages }"
                    >
                        <button class="page-link" @click="changePage(totalPages)">
                            {{ totalPages }}
                        </button>
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
            maxPapers: 0,
            isLoading: false,
            sortKey: 'paper_count',
            sortAsc: false,
            schoolFilter: '',
        };
    },

    computed: {
        middlePages() {
            const pages = [];
            const start = Math.max(2, this.currentPage - 1);
            const end = Math.min(this.totalPages - 1, this.currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (i > 1 && i < this.totalPages) {
                    pages.push(i);
                }
            }
            return pages;
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
                    ordering: this.sortAsc ? this.sortKey : `-${this.sortKey}`,
                    schoolName: this.schoolFilter || null,
                });

                this.courses = response.results;
                const pageSize = 12;
                this.totalPages = Math.ceil(response.count / pageSize);

                // Update maxPapers for the progress bar
                this.maxPapers = Math.max(...this.courses.map((c) => c.paper_count || 0));
            } catch (error) {
                console.error('Failed to load courses:', error);
                this.courses = [];
            } finally {
                this.isLoading = false;
            }
        },

        filterBySchool(schoolName) {
            this.schoolFilter = schoolName;
            this.currentPage = 1;
            this.loadCourses();
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

        toggleSortDirection() {
            this.sortAsc = !this.sortAsc;
            this.currentPage = 1;
            this.loadCourses();
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
select option[disabled] {
    color: #6c757d;
    font-style: italic;
}
</style>
