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

            <!-- 📱 Toggler button for mobile -->
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-controls="navbarContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- 🌐 Navbar content collapsible on mobile -->
            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav me-auto ms-3 mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link text-white" to="/courses">
                            Courses
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link text-white" to="/categories">
                            Categories
                        </router-link>
                    </li>
                </ul>

                <!-- 🔍 Search box with dropdown -->
                <div
                    class="d-flex mx-auto my-2 my-lg-0 position-relative"
                    style="width: 100%; max-width: 400px"
                >
                    <div class="input-group search-box w-100">
                        <span class="input-group-text bg-white border-end-0">
                            <i class="bi bi-search text-primary"></i>
                        </span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control border-start-0"
                            placeholder="Search papers..."
                            @input="filterPapers"
                        />
                    </div>

                    <!-- Dropdown for suggestions -->
                    <ul
                        v-if="searchQuery"
                        class="search-dropdown list-group position-absolute w-100"
                    >
                        <li
                            v-for="(paper, index) in filteredPapers"
                            :key="index"
                            class="list-group-item list-group-item-action"
                            @click="goToPaper(paper.id)"
                        >
                            {{ paper.title }}
                        </li>

                        <!-- Empty state -->
                        <li
                            v-if="filteredPapers.length === 0"
                            class="list-group-item text-muted text-center"
                            style="cursor: default"
                        >
                            No papers found.
                        </li>
                    </ul>
                </div>

                <!-- 👤 Auth buttons -->
                <div class="d-flex ms-auto mt-2 mt-lg-0" v-if="!isAuthenticated">
                    <router-link class="btn btn-outline-primary mx-2" to="/login">
                        Login
                    </router-link>
                    <router-link class="btn btn-outline-success mx-2" to="/register">
                        <i class="fas fa-upload fa-lg"></i>Sell
                    </router-link>
                </div>

                <div class="d-flex ms-auto mt-2 mt-lg-0" v-else>
                    <span class="nav-link text-white mx-2 d-flex align-items-center">
                        👋 {{ user?.first_name || 'User' }}
                    </span>
                    <router-link class="btn btn-outline-secondary mx-2" to="/dashboard">
                        Dashboard
                    </router-link>
                    <button class="btn btn-sm btn-outline-danger" @click="showLogoutModal">
                        Logout
                    </button>
                </div>
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
                this.papers = data.results;
            } catch (error) {
                console.error('Error fetching papers:', error);
            } finally {
                this.isLoading = false;
            }
        },

        filterPapers() {
            const query = this.searchQuery.toLowerCase();
            this.filteredPapers = this.papers.filter((paper) =>
                paper.title.toLowerCase().includes(query),
            );
        },

        goToPaper(paperId) {
            this.searchQuery = '';
            this.filteredPapers = [];
            this.$router.push(`/papers/${paperId}`);
        },

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

.navbar-brand img {
    max-height: 40px;
}

.navbar-toggler {
    border: none;
}

.navbar-brand:hover {
    text-decoration: none;
    opacity: 0.85;
}

.search-box {
    max-width: 400px;
    width: 100%;
}

.input-group-text {
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 20px 0 0 20px;
}

.form-control {
    border: none;
    border-radius: 0 20px 20px 0;
    color: #333;
}

.input-group-text i {
    color: #0d6efd;
}

.search-dropdown {
    top: 100%;
    z-index: 1050;
    max-height: 300px;
    overflow-y: auto;
    border-top: none;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
