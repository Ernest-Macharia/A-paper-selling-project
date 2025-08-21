<template>
    <Navbar />
    <div class="container py-4">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb bg-light p-3 rounded-3">
                <li class="breadcrumb-item">
                    <router-link to="/schools" class="text-decoration-none">
                        <i class="fas fa-chevron-left me-2"></i> All Schools
                    </router-link>
                </li>
                <li class="breadcrumb-item active text-primary" aria-current="page">
                    {{ school.name }}
                </li>
            </ol>
        </nav>

        <!-- Error State -->
        <div v-if="error" class="alert alert-danger">
            Error loading school data: {{ error.message }}
            <button @click="loadSchoolData" class="btn btn-sm btn-outline-danger ms-2">
                Retry
            </button>
        </div>

        <!-- Main Content -->
        <template v-else>
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="fw-bold mb-1">{{ school.name }}</h2>
                    <p class="text-muted mb-0">
                        <span class="badge bg-primary bg-opacity-10 text-primary">
                            {{ school.country }}
                        </span>
                    </p>
                </div>
                <div class="d-flex gap-2">
                    <span class="badge bg-light text-dark">
                        <i class="bi bi-journal-text me-1"></i>
                        {{ school.paper_count }} papers
                    </span>
                    <span class="badge bg-light text-dark">
                        <i class="bi bi-book me-1"></i>
                        {{ school.course_count }} courses
                    </span>
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
                                <option value="course">Sort by Course</option>
                                <option value="downloads">Sort by Downloads</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-grow text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading school papers...</p>
            </div>

            <!-- Empty State -->
            <div
                v-else-if="!filteredPapers.length"
                class="card border-0 shadow-sm text-center py-5"
            >
                <i class="bi bi-file-earmark-text display-5 text-muted mb-3"></i>
                <h5 class="text-muted">No papers found for this school</h5>
                <p class="text-muted mb-0">Try adjusting your search filters</p>
            </div>

            <!-- Papers Grid -->
            <div v-else class="row g-4">
                <div v-for="paper in paginatedPapers" :key="paper.id" class="col-md-6 col-lg-4">
                    <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <router-link
                                    :to="`/papers/${paper.id}`"
                                    class="text-decoration-none"
                                >
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
                                    {{ paper.course?.name }}
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
                        <button
                            class="page-link"
                            @click="changePage(page)"
                            :disabled="page === '...'"
                        >
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

            <!-- Courses Section -->
            <div class="mt-5 pt-4 border-top">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="fw-bold mb-0">Courses at {{ school.name }}</h3>
                    <router-link
                        :to="`/schools/${school.id}/courses`"
                        class="btn btn-sm btn-outline-primary"
                    >
                        View All Courses
                    </router-link>
                </div>

                <div v-if="loadingCourses" class="text-center py-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>

                <div v-else-if="!courses.length" class="text-center py-3">
                    <i class="bi bi-book display-5 text-muted mb-3"></i>
                    <p class="text-muted">No courses found for this school</p>
                </div>

                <div v-else class="row g-4">
                    <div
                        v-for="course in paginatedCourses"
                        :key="course.id"
                        class="col-md-6 col-lg-3"
                    >
                        <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
                            <div class="card-body">
                                <div
                                    class="course-icon bg-primary bg-opacity-10 text-primary rounded-3 mb-3 p-3 d-inline-flex"
                                >
                                    <i class="bi bi-journal-text fs-4"></i>
                                </div>
                                <h5 class="fw-bold mb-2">{{ course.name }}</h5>
                                <p class="text-muted small mb-3">{{ course.paper_count }} papers</p>
                                <router-link
                                    :to="`/courses/${course.id}`"
                                    class="btn btn-sm btn-outline-primary stretched-link"
                                >
                                    View Course
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <nav v-if="coursesTotalPages > 1" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: coursesCurrentPage === 1 }">
                        <button
                            class="page-link"
                            @click="changeCoursesPage(coursesCurrentPage - 1)"
                        >
                            &laquo;
                        </button>
                    </li>

                    <li
                        v-for="page in coursesVisiblePages"
                        :key="page"
                        class="page-item"
                        :class="{ active: coursesCurrentPage === page }"
                    >
                        <button class="page-link" @click="changeCoursesPage(page)">
                            {{ page }}
                        </button>
                    </li>

                    <li
                        class="page-item"
                        :class="{ disabled: coursesCurrentPage === coursesTotalPages }"
                    >
                        <button
                            class="page-link"
                            @click="changeCoursesPage(coursesCurrentPage + 1)"
                        >
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        </template>
    </div>
    <Footer />
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Navbar from '@/components/home/Navbar.vue';
import Footer from '@/components/home/Footer.vue';

export default {
    name: 'SchoolDetailPage',
    components: { Navbar, Footer },
    data() {
        return {
            searchQuery: '',
            sortKey: 'title',
            sortAsc: true,
            currentPage: 1,
            perPage: 9,
            loadingCourses: false,
            coursesCurrentPage: 1,
            coursesPerPage: 8,
            coursesTotalPages: 1,
        };
    },
    computed: {
        ...mapState('papers', ['loading', 'error']),
        ...mapGetters('papers', ['schoolDetails', 'schoolPapers', 'schoolCourses']),

        school() {
            return this.schoolDetails || {};
        },

        courses() {
            return this.schoolCourses || [];
        },

        allPapers() {
            return this.schoolPapers || [];
        },

        filteredPapers() {
            const query = this.searchQuery.toLowerCase();
            let filtered = this.allPapers.filter((paper) =>
                paper.title.toLowerCase().includes(query),
            );

            return filtered.sort((a, b) => {
                if (this.sortKey === 'upload_date') {
                    return this.sortAsc
                        ? new Date(a.upload_date) - new Date(b.upload_date)
                        : new Date(b.upload_date) - new Date(a.upload_date);
                } else if (this.sortKey === 'course') {
                    const aCourse = a.course?.name || '';
                    const bCourse = b.course?.name || '';
                    return this.sortAsc
                        ? aCourse.localeCompare(bCourse)
                        : bCourse.localeCompare(aCourse);
                } else if (this.sortKey === 'downloads') {
                    return this.sortAsc ? a.downloads - b.downloads : b.downloads - a.downloads;
                } else {
                    return this.sortAsc
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                }
            });
        },

        paginatedPapers() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredPapers.slice(start, end);
        },

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

        coursesVisiblePages() {
            const range = 2;
            const pages = [];
            let start = Math.max(1, this.coursesCurrentPage - range);
            let end = Math.min(this.coursesTotalPages, this.coursesCurrentPage + range);

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < this.coursesTotalPages) {
                if (end < this.coursesTotalPages - 1) pages.push('...');
                pages.push(this.coursesTotalPages);
            }

            return pages;
        },
        paginatedCourses() {
            const start = (this.coursesCurrentPage - 1) * this.coursesPerPage;
            const end = start + this.coursesPerPage;
            return this.courses.slice(start, end);
        },
    },
    methods: {
        ...mapActions('papers', [
            'fetchSchoolDetails',
            'fetchSchoolPapers',
            'fetchSchoolCourses',
            'clearSchoolState',
        ]),

        async loadSchoolData() {
            const schoolId = this.$route.params.id;
            try {
                await this.fetchSchoolDetails(schoolId);
                await this.fetchSchoolPapers({
                    schoolId,
                    params: {
                        page_size: 100,
                    },
                });
                await this.loadCourses();
            } catch (error) {
                console.error('Error loading school data:', error);
            }
        },

        async loadCourses() {
            this.loadingCourses = true;
            try {
                const response = await this.fetchSchoolCourses({
                    schoolId: this.$route.params.id,
                    params: {
                        page: this.coursesCurrentPage,
                        page_size: this.coursesPerPage,
                    },
                });

                if (response.pagination.count === 0) {
                    this.coursesTotalPages = 1;
                    this.coursesCurrentPage = 1;
                    return;
                }

                this.coursesTotalPages = Math.ceil(response.pagination.count / this.coursesPerPage);

                // Reset to page 1 if current page exceeds total pages
                if (this.coursesCurrentPage > this.coursesTotalPages) {
                    this.coursesCurrentPage = 1;
                    await this.loadCourses();
                }
            } catch (error) {
                console.error('Error loading courses:', error);
                this.coursesTotalPages = 1;
                this.coursesCurrentPage = 1;
            } finally {
                this.loadingCourses = false;
            }
        },

        applyFilters() {
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
                this.currentPage = page;
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        },

        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
        async changeCoursesPage(page) {
            if (page >= 1 && page <= this.coursesTotalPages) {
                this.coursesCurrentPage = page;
                await this.loadCourses();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        },
    },
    async created() {
        await this.loadSchoolData();
    },
    beforeUnmount() {
        this.clearSchoolState();
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

.course-icon {
    transition: all 0.3s ease;
}

.card:hover .course-icon {
    background-color: #007bff !important;
    color: white !important;
}
</style>
