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
        </div>
    </nav>
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
        <div class="card shadow p-4 w-100" style="max-width: 400px">
            <h4 class="text-center text-primary mb-4">Resend Activation Email</h4>

            <form @submit.prevent="handleResend">
                <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        v-model="email"
                        class="form-control"
                        placeholder="Enter your email"
                        required
                    />
                    <small class="text-danger" v-if="emailError">{{ emailError }}</small>
                </div>

                <button class="btn btn-primary w-100" type="submit" :disabled="loading">
                    {{ loading ? 'Sending...' : 'Resend Activation' }}
                </button>

                <div v-if="serverError" class="alert alert-danger mt-3 text-center">
                    {{ serverError }}
                </div>
            </form>
        </div>

        <ResetSuccessModal
            v-if="showModal"
            @close="showModal = false"
            title="Activation Sent"
            message="Check your email to activate your account."
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import ResetSuccessModal from './ResetSuccessModal.vue';

export default {
    name: 'ResendActivation',
    components: { ResetSuccessModal },
    data() {
        return {
            email: '',
            loading: false,
            emailError: '',
            serverError: '',
            showModal: false,
        };
    },
    methods: {
        ...mapActions('authentication', ['resendActivation']),

        async handleResend() {
            this.emailError = '';
            this.serverError = '';

            const validEmail = /\S+@\S+\.\S+/;
            if (!validEmail.test(this.email)) {
                this.emailError = 'Please enter a valid email.';
                return;
            }

            this.loading = true;

            try {
                await this.resendActivation(this.email);
                this.showModal = true;
                this.email = '';
            } catch (error) {
                this.serverError =
                    error.response?.data?.error ||
                    error.response?.data?.detail ||
                    'An error occurred. Please try again.';
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.card {
    border-radius: 0.75rem;
}
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
