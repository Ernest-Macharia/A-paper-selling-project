<template>
    <div class="settings-page">
        <div class="container py-5">
            <div class="row">
                <!-- Sidebar Navigation -->
                <div class="col-lg-3 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-white border-bottom">
                            <h5 class="mb-0 fw-bold">Settings</h5>
                        </div>
                        <div class="list-group list-group-flush">
                            <button
                                v-for="tab in tabs"
                                :key="tab.id"
                                @click="activeTab = tab.id"
                                :class="[
                                    'list-group-item list-group-item-action d-flex align-items-center',
                                    { active: activeTab === tab.id },
                                ]"
                            >
                                <i :class="['me-2', tab.icon]"></i>
                                {{ tab.name }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="col-lg-9">
                    <div class="card shadow-sm">
                        <!-- Profile Settings -->
                        <div v-if="activeTab === 'profile'" class="card-body">
                            <h4 class="card-title mb-4 fw-bold">
                                <i class="bi bi-person me-2"></i>Profile Settings
                            </h4>

                            <form @submit.prevent="saveProfile">
                                <div class="row mb-4">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">First Name</label>
                                        <input
                                            v-model="profile.firstName"
                                            type="text"
                                            class="form-control"
                                        />
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Last Name</label>
                                        <input
                                            v-model="profile.lastName"
                                            type="text"
                                            class="form-control"
                                        />
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">Email</label>
                                    <input
                                        v-model="profile.email"
                                        type="email"
                                        class="form-control"
                                    />
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">Profile Picture</label>
                                    <div class="d-flex align-items-center">
                                        <img
                                            :src="
                                                profile.avatar || 'https://via.placeholder.com/100'
                                            "
                                            class="rounded-circle me-3"
                                            width="80"
                                            height="80"
                                        />
                                        <div>
                                            <input
                                                type="file"
                                                class="form-control"
                                                @change="handleFileUpload"
                                                accept="image/*"
                                            />
                                            <small class="text-muted"
                                                >JPG, GIF or PNG. Max size 2MB</small
                                            >
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">Bio</label>
                                    <textarea
                                        v-model="profile.bio"
                                        class="form-control"
                                        rows="3"
                                    ></textarea>
                                </div>

                                <button type="submit" class="btn btn-primary px-4">
                                    Save Changes
                                </button>
                            </form>
                        </div>

                        <!-- Account Security -->
                        <div v-if="activeTab === 'security'" class="card-body">
                            <h4 class="card-title mb-4 fw-bold">
                                <i class="bi bi-shield-lock me-2"></i>Account Security
                            </h4>

                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">Password</h5>
                                <div class="card bg-light border-0 p-3 mb-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i class="bi bi-key me-2"></i>
                                            <span>Last changed 3 months ago</span>
                                        </div>
                                        <button
                                            class="btn btn-outline-primary"
                                            @click="showPasswordModal = true"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">Two-Factor Authentication</h5>
                                <div class="card bg-light border-0 p-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i class="bi bi-phone me-2"></i>
                                            <span>2FA is currently disabled</span>
                                        </div>
                                        <button class="btn btn-outline-primary">Enable 2FA</button>
                                    </div>
                                </div>
                            </div>

                            <div class="alert alert-warning mt-4">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                For security reasons, some changes may require you to re-login.
                            </div>
                        </div>

                        <!-- Notification Preferences -->
                        <div v-if="activeTab === 'notifications'" class="card-body">
                            <h4 class="card-title mb-4 fw-bold">
                                <i class="bi bi-bell me-2"></i>Notification Preferences
                            </h4>

                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">Email Notifications</h5>
                                <div class="form-check form-switch mb-3">
                                    <input
                                        v-model="notifications.email.newsletter"
                                        class="form-check-input"
                                        type="checkbox"
                                        id="newsletter"
                                    />
                                    <label class="form-check-label" for="newsletter"
                                        >Receive newsletter</label
                                    >
                                </div>
                                <div class="form-check form-switch mb-3">
                                    <input
                                        v-model="notifications.email.updates"
                                        class="form-check-input"
                                        type="checkbox"
                                        id="updates"
                                    />
                                    <label class="form-check-label" for="updates"
                                        >Product updates</label
                                    >
                                </div>
                                <div class="form-check form-switch">
                                    <input
                                        v-model="notifications.email.promotions"
                                        class="form-check-input"
                                        type="checkbox"
                                        id="promotions"
                                    />
                                    <label class="form-check-label" for="promotions"
                                        >Promotional offers</label
                                    >
                                </div>
                            </div>

                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">Push Notifications</h5>
                                <div class="form-check form-switch mb-3">
                                    <input
                                        v-model="notifications.push.messages"
                                        class="form-check-input"
                                        type="checkbox"
                                        id="pushMessages"
                                    />
                                    <label class="form-check-label" for="pushMessages"
                                        >New messages</label
                                    >
                                </div>
                                <div class="form-check form-switch">
                                    <input
                                        v-model="notifications.push.reminders"
                                        class="form-check-input"
                                        type="checkbox"
                                        id="pushReminders"
                                    />
                                    <label class="form-check-label" for="pushReminders"
                                        >Reminders</label
                                    >
                                </div>
                            </div>

                            <button @click="saveNotificationSettings" class="btn btn-primary px-4">
                                Save Preferences
                            </button>
                        </div>

                        <!-- System Preferences -->
                        <div v-if="activeTab === 'system'" class="card-body">
                            <h4 class="card-title mb-4 fw-bold">
                                <i class="bi bi-gear me-2"></i>System Preferences
                            </h4>

                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">Appearance</h5>
                                <div class="d-flex gap-3 mb-4">
                                    <div class="form-check">
                                        <input
                                            v-model="system.theme"
                                            value="light"
                                            class="form-check-input"
                                            type="radio"
                                            id="themeLight"
                                        />
                                        <label class="form-check-label" for="themeLight">
                                            <i class="bi bi-sun-fill me-1"></i> Light Mode
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input
                                            v-model="system.theme"
                                            value="dark"
                                            class="form-check-input"
                                            type="radio"
                                            id="themeDark"
                                        />
                                        <label class="form-check-label" for="themeDark">
                                            <i class="bi bi-moon-fill me-1"></i> Dark Mode
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input
                                            v-model="system.theme"
                                            value="system"
                                            class="form-check-input"
                                            type="radio"
                                            id="themeSystem"
                                        />
                                        <label class="form-check-label" for="themeSystem">
                                            <i class="bi bi-laptop me-1"></i> System Default
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">Language & Region</h5>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Language</label>
                                        <select v-model="system.language" class="form-select">
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Timezone</label>
                                        <select v-model="system.timezone" class="form-select">
                                            <option value="UTC-5">Eastern Time (UTC-5)</option>
                                            <option value="UTC-6">Central Time (UTC-6)</option>
                                            <option value="UTC-7">Mountain Time (UTC-7)</option>
                                            <option value="UTC-8">Pacific Time (UTC-8)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">Data & Privacy</h5>
                                <div class="form-check form-switch mb-3">
                                    <input
                                        v-model="system.analytics"
                                        class="form-check-input"
                                        type="checkbox"
                                        id="analytics"
                                    />
                                    <label class="form-check-label" for="analytics">
                                        Share usage analytics to help improve our services
                                    </label>
                                </div>
                                <div class="form-check form-switch">
                                    <input
                                        v-model="system.personalizedAds"
                                        class="form-check-input"
                                        type="checkbox"
                                        id="personalizedAds"
                                    />
                                    <label class="form-check-label" for="personalizedAds">
                                        Allow personalized advertisements
                                    </label>
                                </div>
                            </div>

                            <button @click="saveSystemPreferences" class="btn btn-primary px-4">
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal fade" id="passwordModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Change Password</h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="changePassword">
                        <div class="mb-3">
                            <label class="form-label">Current Password</label>
                            <input
                                v-model="password.current"
                                type="password"
                                class="form-control"
                                required
                            />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">New Password</label>
                            <input
                                v-model="password.new"
                                type="password"
                                class="form-control"
                                required
                            />
                            <small class="text-muted"
                                >Minimum 8 characters with at least 1 number and 1 special
                                character</small
                            >
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Confirm New Password</label>
                            <input
                                v-model="password.confirm"
                                type="password"
                                class="form-control"
                                required
                            />
                        </div>
                        <div class="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                class="btn btn-outline-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import { Modal } from 'bootstrap';

export default {
    name: 'SettingsPage',
    components: {
        Footer,
    },
    data() {
        return {
            activeTab: 'profile',
            tabs: [
                { id: 'profile', name: 'Profile', icon: 'bi bi-person' },
                { id: 'security', name: 'Security', icon: 'bi bi-shield-lock' },
                { id: 'notifications', name: 'Notifications', icon: 'bi bi-bell' },
                { id: 'system', name: 'System', icon: 'bi bi-gear' },
            ],
            profile: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                avatar: '',
                bio: 'Software developer and tech enthusiast.',
            },
            notifications: {
                email: {
                    newsletter: true,
                    updates: true,
                    promotions: false,
                },
                push: {
                    messages: true,
                    reminders: false,
                },
            },
            system: {
                theme: 'system',
                language: 'en',
                timezone: 'UTC-5',
                analytics: true,
                personalizedAds: false,
            },
            password: {
                current: '',
                new: '',
                confirm: '',
            },
            passwordModal: null,
            showPasswordModal: false,
        };
    },
    methods: {
        saveProfile() {
            this.showToast('Profile updated successfully');
        },
        saveNotificationSettings() {
            this.showToast('Notification preferences updated');
        },
        saveSystemPreferences() {
            this.showToast('System preferences updated');
        },
        changePassword() {
            if (this.password.new !== this.password.confirm) {
                this.showToast('Passwords do not match', 'error');
                return;
            }
            this.showToast('Password changed successfully');
            this.passwordModal.hide();
            this.password = { current: '', new: '', confirm: '' };
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.profile.avatar = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        showToast(message, type = 'success') {
            // Implement toast notification
            console.log(`${type}: ${message}`);
        },
    },
    mounted() {
        this.passwordModal = new Modal(document.getElementById('passwordModal'));

        // Watch for changes to show/hide modal
        this.$watch('showPasswordModal', (newVal) => {
            if (newVal) {
                this.passwordModal.show();
            } else {
                this.passwordModal.hide();
            }
        });

        // Handle modal hidden event
        document.getElementById('passwordModal').addEventListener('hidden.bs.modal', () => {
            this.showPasswordModal = false;
        });
    },
};
</script>

<style scoped>
.settings-page {
    min-height: calc(100vh - 120px);
}

.list-group-item.active {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.card {
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.card-header {
    border-radius: 0.5rem 0.5rem 0 0 !important;
}

.form-switch .form-check-input {
    width: 2.5em;
    height: 1.5em;
}

.modal-content {
    border-radius: 0.5rem;
}
</style>
