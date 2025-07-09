<template>
    <nav class="navbar navbar-expand-lg custom-navbar">
        <div class="container">
            <router-link class="navbar-brand d-flex align-items-center" to="/">
                <img
                    src="@/assets/images/gradesworld.png"
                    alt="GradesWorld Logo"
                    height="40"
                    class="me-2"
                />
            </router-link>
            <router-link class="nav-link text-white" to="/dashboard">Dashboard</router-link>

            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#dashboardNavbar"
                aria-controls="dashboardNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="dashboardNavbar">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link class="nav-link text-white" to="/dashboard/profile"
                            >Profile</router-link
                        >
                    </li>

                    <li class="nav-item dropdown text-white">
                        <button
                            class="nav-link dropdown-toggle btn btn-link"
                            id="dashboardMenu"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            📚 Dashboard Menu
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dashboardMenu">
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/upload-file"
                                    >📄 Upload a Paper</router-link
                                >
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/uploads"
                                    >📤 Uploads</router-link
                                >
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/downloads"
                                    >📥 Downloads</router-link
                                >
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/earnings"
                                    >💰 Earnings</router-link
                                >
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/dashboard/reviews"
                                    >⭐ Reviews</router-link
                                >
                            </li>
                            <li><hr class="dropdown-divider" /></li>
                        </ul>
                    </li>
                </ul>
                <button class="btn btn-sm btn-outline-danger" @click="showLogoutModal">
                    Logout
                </button>
            </div>
        </div>
    </nav>
    <div
        class="modal fade"
        id="logoutModal"
        tabindex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="logoutModalLabel">Confirm Logout</h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body text-center">Are you sure you want to log out?</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-danger" @click="confirmLogout">
                        Yes, Logout
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
            const modal = new Modal(document.getElementById('logoutModal'));
            modal.show();
        },

        async confirmLogout() {
            try {
                const modalElement = document.getElementById('logoutModal');
                const modalInstance = Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }

                await this.logout();
                this.$router.push('/');
                toast.success('Logout successful');
            } catch {
                toast.error('Logout failed');
            }
        },
    },
};
</script>

<style scoped>
.custom-navbar {
    position: sticky;
    top: 0;
    z-index: 1030;
    background: linear-gradient(90deg, #6ea8fe, #b28dff);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
    min-width: 220px;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.dropdown-item.text-danger {
    font-weight: 500;
}
</style>
