<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div class="container">
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
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" active-class="active" to="/courses">
                            <i class="bi bi-journal-bookmark me-1"></i> Courses
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" active-class="active" to="/categories">
                            <i class="bi bi-tags me-1"></i> Categories
                        </router-link>
                    </li>
                </ul>

                <!-- Search Box -->
                <div
                    class="d-flex position-relative mx-lg-3 my-2 my-lg-0 flex-grow-1 flex-lg-grow-0"
                >
                    <div class="input-group search-box">
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control border-end-0"
                            placeholder="Search papers..."
                            @input="filterPapers"
                        />
                        <span class="input-group-text bg-white border-start-0">
                            <i class="bi bi-search text-muted"></i>
                        </span>
                    </div>

                    <!-- Search Dropdown -->
                    <div
                        v-if="searchQuery"
                        class="search-dropdown position-absolute top-100 start-0 end-0 mt-1 bg-white rounded shadow-lg z-3"
                    >
                        <div
                            v-for="paper in filteredPapers"
                            :key="paper.id"
                            class="dropdown-item p-3 border-bottom"
                            @click="goToPaper(paper.id)"
                        >
                            <div class="d-flex justify-content-between">
                                <span class="fw-semibold">{{ paper.title }}</span>
                                <span class="text-success small">${{ paper.price }}</span>
                            </div>
                            <div class="text-muted small">
                                {{ paper.course?.name || paper.category?.name }}
                            </div>
                        </div>
                        <div
                            v-if="filteredPapers.length === 0 && !isLoading"
                            class="p-3 text-muted text-center"
                        >
                            No papers found
                        </div>
                        <div v-if="isLoading" class="p-3 text-center">
                            <div
                                class="spinner-border spinner-border-sm text-primary"
                                role="status"
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Auth Buttons -->
                <div class="d-flex ms-lg-2">
                    <template v-if="!isAuthenticated">
                        <router-link
                            class="btn btn-outline-light mx-1 d-flex align-items-center"
                            to="/login"
                        >
                            <i class="bi bi-box-arrow-in-right me-1"></i> Login
                        </router-link>
                        <router-link
                            class="btn btn-success mx-1 d-flex align-items-center"
                            to="/register"
                        >
                            <i class="bi bi-upload me-1"></i> Sell Papers
                        </router-link>
                    </template>
                    <template v-else>
                        <div class="dropdown">
                            <button
                                class="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                                type="button"
                                id="userDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i class="bi bi-person-circle me-1"></i>
                                {{ user?.first_name || 'Account' }}
                            </button>
                            <ul
                                class="dropdown-menu dropdown-menu-end"
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

export default {
    name: 'Navbar',
    data() {
        return {
            papers: [],
            filteredPapers: [],
            searchQuery: '',
            isLoading: false,
        };
    },
    computed: {
        ...mapGetters('authentication', ['isAuthenticated']),
        ...mapState('authentication', ['user']),
    },
    created() {
        this.loadPapers();
    },
    methods: {
        ...mapActions('papers', ['fetchAllPapers']),
        ...mapActions('authentication', ['logout']),

        async loadPapers() {
            this.isLoading = true;
            try {
                const data = await this.fetchAllPapers();
                this.papers = Array.isArray(data?.results) ? data.results : [];
            } catch (error) {
                console.error('Error fetching papers:', error);
                toast.error('Failed to load search data');
            } finally {
                this.isLoading = false;
            }
        },

        filterPapers() {
            if (!this.searchQuery) {
                this.filteredPapers = [];
                return;
            }
            const query = this.searchQuery.toLowerCase();
            this.filteredPapers = this.papers.filter((paper) =>
                paper?.title?.toLowerCase().includes(query),
            );
        },

        goToPaper(paperId) {
            this.searchQuery = '';
            this.filteredPapers = [];
            this.$router.push(`/papers/${paperId}`);
        },

        showLogoutModal() {
            new Modal(document.getElementById('logoutModal')).show();
        },

        async confirmLogout() {
            try {
                const modal = Modal.getInstance(document.getElementById('logoutModal'));
                if (modal) modal.hide();

                // if (this.$auth0 && this.$auth0.isAuthenticated) {
                //     await this.$auth0.logout({
                //         logoutParams: { returnTo: window.location.origin }
                //     });
                // }

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
}

.dropdown-item {
    transition: background-color 0.2s ease;
    cursor: pointer;
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

@media (max-width: 991.98px) {
    .search-box {
        margin-left: 0;
        margin-right: 0;
        width: 100%;
    }

    .navbar-collapse {
        padding: 1rem;
        background-color: rgba(13, 110, 253, 0.98);
        border-radius: 0.5rem;
        margin-top: 0.5rem;
    }
}
</style>
