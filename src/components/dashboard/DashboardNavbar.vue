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
                data-bs-target="#dashboardNavbar"
                aria-controls="dashboardNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <i class="bi bi-list" style="font-size: 1.5rem"></i>
            </button>

            <!-- Navbar Content -->
            <div class="collapse navbar-collapse" id="dashboardNavbar">
                <!-- Main Navigation -->
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <router-link
                            class="nav-link d-flex align-items-center"
                            active-class="active"
                            to="/dashboard"
                        >
                            <i class="bi bi-speedometer2 me-1"></i> Dashboard
                        </router-link>
                    </li>
                </ul>

                <!-- User Menu -->
                <div class="d-flex align-items-center ms-auto">
                    <div class="dropdown">
                        <button
                            class="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                            type="button"
                            id="dashboardMenu"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="bi bi-journal-bookmark me-1"></i> My Content
                        </button>
                        <ul
                            class="dropdown-menu dropdown-menu-end shadow"
                            aria-labelledby="dashboardMenu"
                        >
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/upload-file">
                                    <i class="bi bi-upload me-2"></i> Upload Paper
                                </router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/uploads">
                                    <i class="bi bi-folder me-2"></i> My Uploads
                                </router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/downloads">
                                    <i class="bi bi-download me-2"></i> Downloads
                                </router-link>
                            </li>
                            <li><hr class="dropdown-divider" /></li>
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/earnings">
                                    <i class="bi bi-cash-stack me-2"></i> Earnings
                                </router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/reviews">
                                    <i class="bi bi-star me-2"></i> Reviews
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <div class="dropdown ms-2">
                        <button
                            class="btn btn-light dropdown-toggle d-flex align-items-center"
                            type="button"
                            id="userMenu"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="bi bi-person-circle me-1"></i>
                            <span class="d-none d-lg-inline">Account</span>
                        </button>
                        <ul
                            class="dropdown-menu dropdown-menu-end shadow"
                            aria-labelledby="userMenu"
                        >
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/profile">
                                    <i class="bi bi-person me-2"></i> Profile
                                </router-link>
                            </li>
                            <!-- <li>
                                <router-link class="dropdown-item" to="/dashboard/settings">
                                    <i class="bi bi-gear me-2"></i> Settings
                                </router-link>
                            </li> -->
                            <li><hr class="dropdown-divider" /></li>
                            <li>
                                <button class="dropdown-item text-danger" @click="showLogoutModal">
                                    <i class="bi bi-box-arrow-right me-2"></i> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
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
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';
import { toast } from 'vue3-toastify';

export default {
    name: 'DashboardNavbar',
    methods: {
        ...mapActions('authentication', ['logout']),
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

.dropdown-menu {
    min-width: 240px;
    border: none;
}

.dropdown-item {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
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
    .navbar-collapse {
        padding-top: 1rem;
    }

    .dropdown {
        margin-top: 0.5rem;
    }
}
</style>
