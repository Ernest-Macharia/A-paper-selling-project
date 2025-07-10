<template>
    <div class="container my-5">
        <div class="card shadow-lg">
            <div class="card-body bg-light">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="card-title text-primary">User Profile</h2>
                        <p class="text-muted mb-0">Manage your personal information</p>
                    </div>
                    <button class="btn btn-primary" @click="openModal">
                        <i class="bi bi-pencil-square me-2"></i>Edit Profile
                    </button>
                </div>

                <div class="row gy-3">
                    <div class="col-md-3 text-center">
                        <img
                            :src="userDetails.avatar || defaultAvatar"
                            class="img-thumbnail rounded-circle"
                            style="width: 150px; height: 150px; object-fit: cover"
                            alt="Avatar"
                        />
                    </div>
                    <div class="col-md-9 row gy-3">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Full Name</label>
                            <p class="form-control-plaintext">{{ userDetails.full_name }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Email</label>
                            <p class="form-control-plaintext">{{ userDetails.email }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">School</label>
                            <p class="form-control-plaintext">{{ userDetails.school }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Country</label>
                            <p class="form-control-plaintext">{{ userDetails.country }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Course</label>
                            <p class="form-control-plaintext">{{ userDetails.course }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Gender</label>
                            <p class="form-control-plaintext text-capitalize">
                                {{ userDetails.gender }}
                            </p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Birth Year</label>
                            <p class="form-control-plaintext">{{ userDetails.birth_year }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">School Type</label>
                            <p class="form-control-plaintext">
                                {{ getSchoolTypeLabel(userDetails.school_type) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div class="modal fade show d-block" v-if="showModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content shadow">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Edit Profile</h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="closeModal"
                        ></button>
                    </div>
                    <form @submit.prevent="saveProfileChanges">
                        <div class="modal-body row g-3">
                            <div class="col-12 text-center">
                                <img
                                    :src="avatarPreview || userDetails.avatar || defaultAvatar"
                                    class="rounded-circle mb-3"
                                    style="width: 120px; height: 120px; object-fit: cover"
                                />
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">First Name</label>
                                <input
                                    v-model="form.first_name"
                                    type="text"
                                    class="form-control"
                                    :disabled="loading"
                                />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Last Name</label>
                                <input
                                    v-model="form.last_name"
                                    type="text"
                                    class="form-control"
                                    :disabled="loading"
                                />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    class="form-control"
                                    :disabled="loading"
                                />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">School</label>
                                <input v-model="form.school" type="text" class="form-control" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Country</label>
                                <input v-model="form.country" type="text" class="form-control" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Course</label>
                                <input v-model="form.course" type="text" class="form-control" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Gender</label>
                                <select v-model="form.gender" class="form-select">
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Birth Year</label>
                                <input
                                    v-model="form.birth_year"
                                    type="number"
                                    min="1900"
                                    max="2100"
                                    class="form-control"
                                />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Avatar</label>
                                <input
                                    type="file"
                                    @change="handleAvatarChange"
                                    class="form-control"
                                    accept="image/*"
                                />
                            </div>

                            <div class="col-12">
                                <label class="form-label">School Type</label>
                                <div class="list-group">
                                    <label
                                        v-for="(type, index) in schoolTypes"
                                        :key="index"
                                        class="list-group-item list-group-item-action d-flex align-items-center"
                                        :class="{ active: form.school_type === type.value }"
                                        @click="form.school_type = type.value"
                                        style="cursor: pointer"
                                    >
                                        <i
                                            :class="['me-3', type.icon]"
                                            style="font-size: 1.5rem"
                                        ></i>
                                        <div>
                                            <div class="fw-semibold">{{ type.label }}</div>
                                            <div class="text-muted small">
                                                {{ type.description }}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-success" :disabled="loading">
                                <span v-if="loading">
                                    <span class="spinner-border spinner-border-sm me-1"></span>
                                    Saving...
                                </span>
                                <span v-else>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal-backdrop fade show" v-if="showModal"></div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'Profile',
    data() {
        return {
            showModal: false,
            loading: false,
            avatarFile: null,
            avatarPreview: null,
            defaultAvatar: '/images/avatar.png',
            userDetails: {},
            form: {
                first_name: '',
                last_name: '',
                email: '',
                school: '',
                country: '',
                course: '',
                gender: '',
                birth_year: '',
                school_type: '',
            },
            schoolTypes: [
                {
                    value: 'high_school',
                    label: 'High school diploma',
                    description: 'Secondary level education',
                    icon: 'icon-diploma',
                },
                {
                    value: 'degree',
                    label: 'Degree',
                    description: "Bachelor's, Masters/PhD",
                    icon: 'icon-laurea',
                },
                {
                    value: 'post_graduate',
                    label: 'Post-graduate course',
                    description: 'Masters, PhD, Training Courses',
                    icon: 'icon-corso-post',
                },
                {
                    value: 'competition',
                    label: 'Competition, State Examination',
                    description: 'Prep for exams and qualifications',
                    icon: 'icon-concorso',
                },
                {
                    value: 'self_culture',
                    label: 'Self-culture',
                    description: 'Autonomous learning and personal study',
                    icon: 'icon-cultura',
                },
            ],
        };
    },
    async created() {
        await this.loadUserDetails();
    },
    methods: {
        ...mapActions('authentication', ['fetchCurrentUserDetails', 'updateCurrentUserDetails']),
        async loadUserDetails() {
            try {
                const user = await this.fetchCurrentUserDetails();
                this.userDetails = user;
            } catch {
                toast.error('Error fetching user details.');
            }
        },
        openModal() {
            this.showModal = true;
            this.avatarFile = null;
            this.avatarPreview = null;
            this.form = {
                first_name: this.userDetails.first_name || '',
                last_name: this.userDetails.last_name || '',
                email: this.userDetails.email || '',
                school: this.userDetails.school || '',
                country: this.userDetails.country || '',
                course: this.userDetails.course || '',
                gender: this.userDetails.gender || '',
                birth_year: this.userDetails.birth_year || '',
                school_type: this.userDetails.school_type || '',
            };
        },
        closeModal() {
            this.showModal = false;
            this.avatarFile = null;
            this.avatarPreview = null;
        },
        handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.avatarFile = file;
                this.avatarPreview = URL.createObjectURL(file);
            }
        },
        getSchoolTypeLabel(value) {
            const match = this.schoolTypes.find((type) => type.value === value);
            return match ? match.label : value;
        },
        async saveProfileChanges() {
            this.loading = true;

            const data = { ...this.form };
            if (!data.first_name || !data.last_name || !data.email) {
                toast.error('First name, last name, and email are required.');
                this.loading = false;
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                toast.error('Enter a valid email address.');
                this.loading = false;
                return;
            }

            try {
                const formData = new FormData();
                for (const key in data) {
                    if (data[key] !== null && data[key] !== undefined) {
                        formData.append(key, data[key]);
                    }
                }
                if (this.avatarFile) {
                    formData.append('avatar', this.avatarFile);
                }

                await this.updateCurrentUserDetails(formData);
                toast.success('Profile updated successfully!');
                await this.loadUserDetails();
                this.closeModal();
            } catch {
                toast.error('Failed to update profile.');
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.modal {
    display: block;
}
</style>
