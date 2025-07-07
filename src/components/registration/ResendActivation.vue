<template>
    <div class="container d-flex vh-100 align-items-center justify-content-center">
        <div class="card p-4 shadow-sm" style="width: 22rem">
            <h4 class="text-center text-primary mb-3">Resend Activation Email</h4>

            <form @submit.prevent="handleResend">
                <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input
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
            if (!/\S+@\S+\.\S+/.test(this.email)) {
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
