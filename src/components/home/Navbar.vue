<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div class="container-fluid px-3 px-lg-4">
            <!-- Brand Logo -->
            <router-link class="navbar-brand d-flex align-items-center" to="/">
                <img
                    src="@/assets/images/gradesworld.png"
                    alt="GradesWorld Logo"
                    height="40"
                    class="me-2"
                />
            </router-link>

            <!-- Mobile Toggle -->
            <button
                class="navbar-toggler border-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-controls="navbarContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <i class="bi bi-list" style="font-size: 1.5rem"></i>
            </button>

            <!-- Navbar Content -->
            <div class="collapse navbar-collapse" id="navbarContent">
                <!-- Main Navigation -->
                <ul class="navbar-nav me-auto mb-3 mb-lg-0">
                    <li class="nav-item">
                        <router-link
                            class="nav-link d-flex align-items-center"
                            active-class="active"
                            to="/courses"
                        >
                            <i class="bi bi-journal-bookmark me-1"></i> Courses
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            class="nav-link d-flex align-items-center"
                            active-class="active"
                            to="/categories"
                        >
                            <i class="bi bi-tags me-1"></i> Categories
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            class="nav-link d-flex align-items-center"
                            active-class="active"
                            to="/schools"
                        >
                            <i class="bi bi-building me-1"></i> Schools
                        </router-link>
                    </li>
                </ul>

                <!-- Search Box -->
                <div
                    class="d-flex position-relative mx-lg-3 my-2 my-lg-0 flex-grow-1 flex-lg-grow-0"
                >
                    <div class="input-group search-box w-100">
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control border-end-0"
                            placeholder="Search courses..."
                            @input="filterCourses"
                            @keydown.enter="searchCourses"
                            @keydown.down="navigateDropdown(1)"
                            @keydown.up="navigateDropdown(-1)"
                            @keydown.esc="clearSearch"
                            aria-label="Search courses"
                            aria-haspopup="true"
                            :aria-expanded="searchQuery && filteredCourses.length > 0"
                        />
                        <span class="input-group-text bg-white border-start-0">
                            <i class="bi bi-search text-muted"></i>
                        </span>
                    </div>

                    <!-- Search Dropdown -->
                    <transition name="fade-slide">
                        <div
                            v-if="searchQuery && searchQuery.length >= minSearchLength"
                            class="search-dropdown position-absolute top-100 start-0 end-0 mt-1 bg-white rounded shadow-lg z-3 overflow-hidden"
                            role="listbox"
                        >
                            <!-- Course Results -->
                            <div
                                v-for="(course, index) in filteredCourses"
                                :key="course.id"
                                class="dropdown-item p-3 border-bottom d-flex align-items-center"
                                :class="{ 'bg-light': highlightedIndex === index }"
                                @click="goToCourse(course.id)"
                                @mouseenter="highlightedIndex = index"
                                role="option"
                                :aria-selected="highlightedIndex === index"
                            >
                                <i class="bi bi-journal-bookmark me-2 text-primary"></i>
                                <div class="d-flex flex-column flex-grow-1 overflow-hidden">
                                    <span class="fw-semibold text-truncate">{{ course.name }}</span>
                                    <small class="text-muted text-truncate" v-if="course.code">
                                        {{ course.code }}
                                    </small>
                                </div>
                                <span
                                    class="badge bg-primary-light text-primary ms-2"
                                    v-if="course.paper_count"
                                >
                                    {{ course.paper_count }} papers
                                </span>
                            </div>

                            <!-- Loading State -->
                            <div v-if="isLoading" class="p-3 text-center">
                                <div
                                    class="spinner-border spinner-border-sm text-primary"
                                    role="status"
                                >
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <p class="small text-muted mt-2 mb-0">Searching courses...</p>
                            </div>

                            <!-- Empty State -->
                            <div
                                v-if="
                                    filteredCourses.length === 0 &&
                                    !isLoading &&
                                    searchQuery.length >= minSearchLength
                                "
                                class="p-3 text-center"
                            >
                                <i class="bi bi-search display-6 text-muted mb-2"></i>
                                <p class="text-muted mb-1">
                                    No courses found for "{{ searchQuery }}"
                                </p>
                                <button
                                    v-if="courses.length > 0"
                                    class="btn btn-sm btn-outline-primary mt-2"
                                    @click="clearSearch"
                                >
                                    Clear search
                                </button>
                            </div>

                            <!-- View All Results (if many matches) -->
                            <div
                                v-if="filteredCourses.length > 5"
                                class="p-2 border-top text-center bg-light"
                            >
                                <a
                                    href="#"
                                    class="text-primary small fw-semibold"
                                    @click.prevent="viewAllResults"
                                >
                                    View all {{ filteredCourses.length }} results
                                    <i class="bi bi-chevron-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </transition>
                </div>

                <!-- Auth Buttons -->
                <div class="d-flex ms-lg-2 mt-2 mt-lg-0">
                    <template v-if="!isAuthenticated">
                        <router-link
                            class="btn btn-outline-light mx-1 d-flex align-items-center justify-content-center"
                            to="/login"
                        >
                            <i class="bi bi-box-arrow-in-right me-1"></i> Login
                        </router-link>
                        <router-link
                            class="btn btn-success mx-1 d-flex align-items-center justify-content-center"
                            to="/register"
                        >
                            <i class="bi bi-upload me-1"></i> Sell Papers
                        </router-link>
                    </template>
                    <template v-else>
                        <div class="dropdown w-100">
                            <button
                                class="btn btn-outline-light dropdown-toggle d-flex align-items-center w-100"
                                type="button"
                                id="userDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i class="bi bi-person-circle me-1"></i>
                                <span class="text-truncate">{{ user?.username || 'Account' }}</span>
                            </button>
                            <ul
                                class="dropdown-menu dropdown-menu-end w-100"
                                aria-labelledby="userDropdown"
                            >
                                <li>
                                    <router-link class="dropdown-item" to="/dashboard">
                                        <i class="bi bi-speedometer2 me-2"></i> Dashboard
                                    </router-link>
                                </li>
                                <li>
                                    <router-link class="dropdown-item" to="/dashboard/profile">
                                        <i class="bi bi-person me-2"></i> Profile
                                    </router-link>
                                </li>
                                <li><hr class="dropdown-divider" /></li>
                                <li>
                                    <button
                                        class="dropdown-item text-danger"
                                        @click="showLogoutModal"
                                    >
                                        <i class="bi bi-box-arrow-right me-2"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </nav>

    <!-- Logout Modal -->
    <div
        class="modal fade"
        id="logoutModal"
        tabindex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-0">
                    <h5 class="modal-title fw-bold" id="logoutModalLabel">Confirm Logout</h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body py-4 text-center">
                    <i class="bi bi-question-circle display-5 text-primary mb-3"></i>
                    <p>Are you sure you want to log out?</p>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-danger" @click="confirmLogout">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { Modal } from 'bootstrap';
import { toast } from 'vue3-toastify';
import { debounce } from 'lodash';

export default {
    name: 'Navbar',
    data() {
        return {
            courses: [],
            filteredCourses: [],
            searchQuery: '',
            isLoading: false,
            minSearchLength: 2,
            debouncedSearch: null,
            highlightedIndex: -1,
        };
    },
    computed: {
        ...mapGetters('authentication', ['isAuthenticated']),
        ...mapState('authentication', ['user']),
    },
    created() {
        this.debouncedSearch = debounce(this.searchCourses, 300);

        // Load initial courses
        this.loadInitialCourses();
    },
    methods: {
        ...mapActions('papers', ['fetchCourses']),
        ...mapActions('authentication', ['logout']),

        async loadInitialCourses() {
            this.isLoading = true;
            try {
                const response = await this.fetchCourses({ all: true });

                // Handle different response structures
                if (Array.isArray(response)) {
                    this.courses = response;
                } else if (response?.results) {
                    this.courses = response.results;
                } else {
                    this.courses = [];
                    console.warn('Unexpected API response structure', response);
                }
            } catch (error) {
                console.error('Initial load error:', error);
                toast.error('Failed to load courses');
            } finally {
                this.isLoading = false;
            }
        },

        filterCourses() {
            if (!this.searchQuery || this.searchQuery.length < this.minSearchLength) {
                this.filteredCourses = [];
                return;
            }

            // First try local filtering
            this.filterLocally();

            // If no local results, try API search
            if (this.filteredCourses.length === 0) {
                this.debouncedSearch();
            }
        },

        filterLocally() {
            const query = this.searchQuery.toLowerCase();
            this.filteredCourses = this.courses.filter(
                (course) =>
                    course?.name?.toLowerCase().includes(query) ||
                    course?.code?.toLowerCase().includes(query),
            );
        },

        async searchCourses() {
            if (this.isLoading) return;

            this.isLoading = true;
            try {
                const response = await this.fetchCourses({
                    search: this.searchQuery,
                });

                // Update filtered courses with API results
                this.filteredCourses = Array.isArray(response) ? response : response?.results || [];
            } catch (error) {
                console.error('Search error:', error);
                toast.error('Search failed');
            } finally {
                this.isLoading = false;
            }
        },

        goToCourse(courseId) {
            this.searchQuery = '';
            this.filteredCourses = [];
            this.$router.push(`/courses/${courseId}`);
        },
        navigateDropdown(direction) {
            const newIndex = this.highlightedIndex + direction;
            if (newIndex >= -1 && newIndex < this.filteredCourses.length) {
                this.highlightedIndex = newIndex;
                // Scroll into view if needed
                this.$nextTick(() => {
                    const el = this.$el.querySelector('.dropdown-item.bg-light');
                    if (el) el.scrollIntoView({ block: 'nearest' });
                });
            }
        },

        clearSearch() {
            this.searchQuery = '';
            this.filteredCourses = [];
            this.highlightedIndex = -1;
        },

        viewAllResults() {
            this.$router.push({
                path: '/courses',
                query: { search: this.searchQuery },
            });
            this.clearSearch();
        },
        showLogoutModal() {
            new Modal(document.getElementById('logoutModal')).show();
        },

        async confirmLogout() {
            try {
                const modal = Modal.getInstance(document.getElementById('logoutModal'));
                if (modal) modal.hide();
                await this.logout();
                this.$router.push('/');
                toast.success('Logged out successfully');
            } catch (error) {
                toast.error('Logout failed');
                console.error('Logout error:', error);
            }
        },
    },
};
</script>

<style scoped>
.navbar {
    background: linear-gradient(135deg, #0d6efd, #6610f2);
    padding: 0.75rem 0;
}

.navbar-brand {
    font-family: 'Poppins', sans-serif;
}

.nav-link {
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
    background-color: rgba(255, 255, 255, 0.15);
}

.search-box {
    border-radius: 2rem;
    overflow: hidden;
    border: 1px solid #dee2e6;
    transition: all 0.3s ease;
    max-width: 400px;
}

.search-box:focus-within {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.search-dropdown {
    max-height: 60vh;
    overflow-y: auto;
    width: 100%;
}

.dropdown-item {
    transition: background-color 0.2s ease;
    cursor: pointer;
    white-space: normal;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.btn-outline-light {
    border-color: rgba(255, 255, 255, 0.5);
}

.btn-outline-light:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.search-dropdown {
    max-height: min(60vh, 500px);
    overflow-y: auto;
    scroll-behavior: smooth;
}

.bg-primary-light {
    background-color: rgba(13, 110, 253, 0.1);
}

@media (max-width: 991.98px) {
    .navbar-collapse {
        padding: 1rem;
        background-color: rgba(13, 110, 253, 0.98);
        border-radius: 0.5rem;
        margin-top: 0.5rem;
    }

    .search-box {
        margin: 0.5rem 0;
        max-width: 100%;
    }

    .search-dropdown {
        left: 0 !important;
        right: 0 !important;
        width: calc(100vw - 2rem) !important;
        max-width: 100%;
    }

    .dropdown-menu {
        width: 100% !important;
    }

    .btn {
        width: 100%;
        margin: 0.25rem 0 !important;
        text-align: center;
        justify-content: center;
    }
}

@media (max-width: 575.98px) {
    .container-fluid {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
</style>
