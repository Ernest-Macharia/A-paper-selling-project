<template>
    <div>
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
            </div>
        </nav>

        <div class="vh-100 d-flex justify-content-center align-items-center">
            <div class="card p-4 shadow-lg" style="width: 22rem">
                <h3 class="text-center mb-1 text-primary">Forgot Password</h3>
                <p class="text-center mb-3 text-muted">Enter your email to reset your password</p>

                <form @submit.prevent="submitForgotPassword">
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input
                            type="email"
                            class="form-control"
                            placeholder="Enter your email"
                            v-model="email"
                            @input="clearEmailError"
                            required
                        />
                        <small class="text-danger" v-if="emailError">{{ emailError }}</small>
                    </div>

                    <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                        {{ loading ? 'Sending...' : 'Send Reset Link' }}
                    </button>
                </form>

                <p class="mt-3 text-center text-muted">
                    Remembered your password?
                    <router-link to="/login" class="text-primary">Login</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'ForgotPassword',
    data() {
        return {
            email: '',
            emailError: '',
            loading: false,
        };
    },
    methods: {
        ...mapActions('authentication', ['requestPasswordReset']),

        validateEmail() {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!this.email) {
                this.emailError = 'Email is required.';
                return false;
            } else if (!pattern.test(this.email)) {
                this.emailError = 'Enter a valid email address.';
                return false;
            } else {
                this.emailError = '';
                return true;
            }
        },

        async submitForgotPassword() {
            if (!this.validateEmail()) return;

            this.loading = true;
            try {
                await this.requestPasswordReset(this.email);
                toast.success('✅ Reset link sent! Please check your email.');
                this.email = '';
            } catch (err) {
                const msg =
                    err.response?.data?.detail ||
                    err.response?.data?.email?.[0] ||
                    '❌ Failed to send reset link.';
                toast.error(msg);
            } finally {
                this.loading = false;
            }
        },

        clearEmailError() {
            this.emailError = '';
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

.navbar-brand {
    font-weight: bold;
    font-size: 1.4rem;
    color: #fff !important;
}
</style>
