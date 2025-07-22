<template>
    <div class="profile-container">
        <!-- Profile Card -->
        <div class="card profile-card shadow-sm border-0 overflow-hidden">
            <div class="card-header bg-primary text-white py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="h5 mb-0">
                            <i class="bi bi-person-circle me-2"></i>User Profile
                        </h2>
                        <p class="small mb-0 opacity-75">Manage your personal information</p>
                    </div>
                    <button class="btn btn-light btn-sm" @click="openModal">
                        <i class="bi bi-pencil-square me-1"></i>Edit
                    </button>
                </div>
            </div>

            <div class="card-body">
                <div class="row align-items-center">
                    <!-- Avatar Column -->
                    <div class="col-md-3 text-center mb-4 mb-md-0">
                        <div class="avatar-container position-relative mx-auto">
                            <img
                                :src="userDetails.avatar || defaultAvatar"
                                class="img-thumbnail rounded-circle border-primary"
                                style="width: 150px; height: 150px; object-fit: cover"
                                alt="Profile Avatar"
                            />
                            <div class="online-status bg-success rounded-circle"></div>
                        </div>
                    </div>

                    <!-- Details Column -->
                    <div class="col-md-9">
                        <div class="row gy-3">
                            <template v-for="(field, index) in profileFields" :key="index">
                                <div class="col-md-6" v-if="userDetails[field.key]">
                                    <div class="profile-field">
                                        <label class="text-muted small text-uppercase fw-bold">{{
                                            field.label
                                        }}</label>
                                        <p class="mb-0 fw-semibold">
                                            <template
                                                v-if="
                                                    field.key === 'country' &&
                                                    userDetails.country_code
                                                "
                                            >
                                                <span
                                                    class="country-flag me-2"
                                                    v-html="
                                                        getCountryFlag(userDetails.country_code)
                                                    "
                                                ></span>
                                                {{ userDetails[field.key] || 'Not specified' }}
                                            </template>
                                            <template v-else>
                                                {{ userDetails[field.key] || 'Not specified' }}
                                            </template>
                                        </p>
                                    </div>
                                </div>
                            </template>
                            <div class="col-md-6" v-if="userDetails.school_type">
                                <div class="profile-field">
                                    <label class="text-muted small text-uppercase fw-bold"
                                        >School Type</label
                                    >
                                    <p class="mb-0 fw-semibold">
                                        {{ getSchoolTypeLabel(userDetails.school_type) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div
            class="modal fade"
            :class="{ show: showModal }"
            tabindex="-1"
            :style="{ display: showModal ? 'block' : 'none' }"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-pencil-square me-2"></i>Edit Profile
                        </h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="closeModal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <form @submit.prevent="saveProfileChanges">
                        <div class="modal-body">
                            <!-- Avatar Upload -->
                            <div class="text-center mb-4">
                                <div class="avatar-upload position-relative d-inline-block">
                                    <img
                                        :src="avatarPreview || userDetails.avatar || defaultAvatar"
                                        class="rounded-circle border border-3 border-primary"
                                        style="width: 120px; height: 120px; object-fit: cover"
                                    />
                                    <label
                                        class="avatar-upload-label rounded-circle bg-primary text-white"
                                    >
                                        <i class="bi bi-camera-fill"></i>
                                        <input
                                            type="file"
                                            @change="handleAvatarChange"
                                            class="d-none"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>

                            <!-- Form Fields -->
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label"
                                        >First Name <span class="text-danger">*</span></label
                                    >
                                    <input
                                        v-model="form.first_name"
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': !form.first_name && formSubmitted }"
                                        :disabled="loading"
                                        required
                                    />
                                    <div class="invalid-feedback">First name is required</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"
                                        >Last Name <span class="text-danger">*</span></label
                                    >
                                    <input
                                        v-model="form.last_name"
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': !form.last_name && formSubmitted }"
                                        :disabled="loading"
                                        required
                                    />
                                    <div class="invalid-feedback">Last name is required</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"
                                        >Email <span class="text-danger">*</span></label
                                    >
                                    <input
                                        v-model="form.email"
                                        type="email"
                                        class="form-control"
                                        :class="{
                                            'is-invalid':
                                                (!form.email || !isValidEmail(form.email)) &&
                                                formSubmitted,
                                        }"
                                        :disabled="loading"
                                        required
                                    />
                                    <div class="invalid-feedback">Valid email is required</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">School</label>
                                    <input v-model="form.school" type="text" class="form-control" />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Country</label>
                                    <div class="input-group">
                                        <span
                                            class="input-group-text p-0 border-end-0 overflow-hidden"
                                            style="width: 40px"
                                        >
                                            <span
                                                class="country-flag"
                                                v-if="form.country_code"
                                                v-html="getCountryFlag(form.country_code)"
                                            ></span>
                                        </span>
                                        <select
                                            v-model="form.country_code"
                                            class="form-select"
                                            @change="updateCountryName"
                                        >
                                            <option value="" disabled>Select Country</option>
                                            <option
                                                v-for="country in countries"
                                                :key="country.code"
                                                :value="country.code"
                                            >
                                                {{ country.name }}
                                            </option>
                                        </select>
                                    </div>
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

                                <!-- School Type Selection -->
                                <div class="col-12">
                                    <label class="form-label">School Type</label>
                                    <div class="row g-2">
                                        <div
                                            class="col-md-4"
                                            v-for="(type, index) in schoolTypes"
                                            :key="index"
                                        >
                                            <div
                                                class="card h-100 school-type-card"
                                                :class="{
                                                    'border-primary':
                                                        form.school_type === type.value,
                                                }"
                                                @click="form.school_type = type.value"
                                            >
                                                <div class="card-body text-center">
                                                    <div class="icon-container mb-3">
                                                        <i
                                                            :class="[
                                                                'bi',
                                                                type.icon,
                                                                'text-primary',
                                                            ]"
                                                            style="font-size: 1.75rem"
                                                        ></i>
                                                    </div>
                                                    <h6 class="card-title mb-1">
                                                        {{ type.label }}
                                                    </h6>
                                                    <p class="card-text text-muted small">
                                                        {{ type.description }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer border-top-0">
                            <button
                                type="button"
                                class="btn btn-outline-secondary"
                                @click="closeModal"
                                :disabled="loading"
                            >
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <template v-if="loading">
                                    <span class="spinner-border spinner-border-sm me-1"></span>
                                    Saving...
                                </template>
                                <template v-else>
                                    <i class="bi bi-check-circle me-1"></i>Save Changes
                                </template>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal-backdrop fade" :class="{ show: showModal }" v-if="showModal"></div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';
import countries from '@/data/countries'; // You'll need to create this file
import { getCountryFlag } from '@/utils/countryFlags'; // You'll need to create this utility

export default {
    name: 'ProfilePage',
    data() {
        return {
            showModal: false,
            loading: false,
            formSubmitted: false,
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
                country_code: '',
                course: '',
                gender: '',
                birth_year: '',
                school_type: '',
            },
            profileFields: [
                { key: 'full_name', label: 'Full Name' },
                { key: 'email', label: 'Email' },
                { key: 'school', label: 'School' },
                { key: 'country', label: 'Country' },
                { key: 'course', label: 'Course' },
                { key: 'gender', label: 'Gender' },
                { key: 'birth_year', label: 'Birth Year' },
            ],
            schoolTypes: [
                {
                    value: 'high_school',
                    label: 'High School',
                    description: 'Secondary level education',
                    icon: 'bi-book',
                },
                {
                    value: 'degree',
                    label: 'Degree',
                    description: "Bachelor's, Masters/PhD",
                    icon: 'bi-mortarboard',
                },
                {
                    value: 'post_graduate',
                    label: 'Post-graduate',
                    description: 'Masters, PhD, Training',
                    icon: 'bi-award',
                },
                {
                    value: 'competition',
                    label: 'Competition',
                    description: 'Exams and qualifications',
                    icon: 'bi-clipboard-check',
                },
                {
                    value: 'self_culture',
                    label: 'Self-culture',
                    description: 'Personal study',
                    icon: 'bi-lightbulb',
                },
            ],
            countries: [], // Will be populated from the countries data file
        };
    },
    async created() {
        await this.loadUserDetails();
        this.countries = countries; // Imported from your countries data file
    },
    methods: {
        ...mapActions('authentication', ['fetchCurrentUserDetails', 'updateCurrentUserDetails']),
        getCountryFlag,
        async loadUserDetails() {
            try {
                const user = await this.fetchCurrentUserDetails();
                this.userDetails = user;
                // Ensure country_code is set if country exists
                if (user.country && !user.country_code) {
                    const country = this.countries.find((c) => c.name === user.country);
                    if (country) {
                        this.userDetails.country_code = country.code;
                    }
                }
            } catch {
                toast.error('Error fetching user details.');
            }
        },
        openModal() {
            this.showModal = true;
            this.formSubmitted = false;
            this.avatarFile = null;
            this.avatarPreview = null;
            this.form = {
                first_name: this.userDetails.first_name || '',
                last_name: this.userDetails.last_name || '',
                email: this.userDetails.email || '',
                school: this.userDetails.school || '',
                country: this.userDetails.country || '',
                country_code: this.userDetails.country_code || '',
                course: this.userDetails.course || '',
                gender: this.userDetails.gender || '',
                birth_year: this.userDetails.birth_year || '',
                school_type: this.userDetails.school_type || '',
            };
        },
        updateCountryName() {
            const selectedCountry = this.countries.find((c) => c.code === this.form.country_code);
            if (selectedCountry) {
                this.form.country = selectedCountry.name;
            }
        },
        closeModal() {
            this.showModal = false;
            this.avatarFile = null;
            this.avatarPreview = null;
        },
        handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    toast.error('Image size should be less than 2MB');
                    return;
                }
                this.avatarFile = file;
                this.avatarPreview = URL.createObjectURL(file);
            }
        },
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        getSchoolTypeLabel(value) {
            const match = this.schoolTypes.find((type) => type.value === value);
            return match ? match.label : value;
        },
        async saveProfileChanges() {
            this.formSubmitted = true;
            this.loading = true;

            // Validate required fields
            if (
                !this.form.first_name ||
                !this.form.last_name ||
                !this.form.email ||
                !this.isValidEmail(this.form.email)
            ) {
                this.loading = false;
                return;
            }

            try {
                const formData = new FormData();
                for (const key in this.form) {
                    if (this.form[key] !== null && this.form[key] !== undefined) {
                        formData.append(key, this.form[key]);
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
.profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.profile-card {
    border-radius: 0.75rem;
}

.avatar-container {
    width: 150px;
    height: 150px;
    position: relative;
}

.online-status {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 15px;
    height: 15px;
    border: 2px solid white;
}

.profile-field {
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    height: 100%;
}

.avatar-upload {
    position: relative;
}

.avatar-upload-label {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.school-type-card {
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #dee2e6;
}

.school-type-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.icon-container {
    width: 50px;
    height: 50px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(13, 110, 253, 0.1);
    border-radius: 50%;
}

.modal-content {
    border-radius: 0.75rem;
    overflow: hidden;
}

.modal-backdrop.show {
    opacity: 0.5;
}

.country-flag {
    display: inline-block;
    width: 24px;
    height: 16px;
    vertical-align: middle;
    background-size: cover;
    margin-right: 8px;
}

@media (max-width: 768px) {
    .profile-container {
        padding: 1rem 0.5rem;
    }

    .avatar-container {
        width: 120px;
        height: 120px;
    }
}
</style>
