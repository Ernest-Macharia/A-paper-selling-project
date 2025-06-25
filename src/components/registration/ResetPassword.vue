<template>
    <div class="vh-100 d-flex justify-content-center align-items-center">
        <div class="card p-4 shadow-lg" style="width: 24rem">
            <h3 class="text-center text-primary mb-3">Reset Password</h3>
            <form @submit.prevent="submitReset">
                <div class="mb-3">
                    <label>New Password</label>
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        class="form-control"
                        placeholder="Enter new password"
                        @input="clearPasswordError"
                        required
                    />
                    <small class="text-danger" v-if="passwordError">{{ passwordError }}</small>
                    <span
                        @click="togglePasswordVisibility"
                        class="position-absolute"
                        style="right: 10px; top: 35px; cursor: pointer"
                    >
                        {{ showPassword ? '🙈' : '👁️' }}
                    </span>
                </div>

                <div class="mb-3">
                    <label>Confirm Password</label>
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="confirmPassword"
                        class="form-control"
                        placeholder="Confirm new password"
                        @input="clearPasswordError"
                        required
                    />
                    <small class="text-danger" v-if="confirmError">{{ confirmError }}</small>
                </div>

                <button type="submit" class="btn btn-primary w-100">Reset Password</button>
            </form>
        </div>
        <ResetSuccessModal :visible="successVisible" @close="successVisible = false" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';
import ResetSuccessModal from './ResetSuccessModal.vue';

export default {
    name: 'ResetPassword',

    components: {
        ResetSuccessModal,
    },
    data() {
        return {
            password: '',
            confirmPassword: '',
            passwordError: '',
            confirmError: '',
            showPassword: false,
            successVisible: false,
        };
    },
    methods: {
        ...mapActions('authentication', ['resetPassword']),

        async submitReset() {
            this.passwordError = '';
            this.confirmError = '';

            const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            if (!strongPassword.test(this.password)) {
                this.passwordError =
                    'Must be at least 8 characters, with uppercase, number, and special character.';
                return;
            }

            if (this.password !== this.confirmPassword) {
                this.confirmError = 'Passwords do not match.';
                return;
            }

            const { uid, token } = this.$route.params;
            try {
                await this.resetPassword({
                    uid,
                    token,
                    new_password: this.password,
                });

                toast.success('Password reset successfully! Please login.');
                this.successVisible = true;
            } catch (err) {
                const detail = err.response?.data?.detail;
                if (detail) {
                    this.passwordError = detail;
                } else {
                    toast.error('Reset failed. Try requesting a new link.');
                }
                this.$router.push('/forgot-password');
            }
        },

        clearPasswordError() {
            this.passwordError = '';
            this.confirmError = '';
        },

        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
    },
};
</script>
