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
    <div class="activation-page">
        <div v-if="loading" class="text-center py-10">
            <p>Activating your account...</p>
        </div>

        <div v-else class="text-center py-10">
            <h1 class="text-2xl font-bold mb-4 text-primary-emphasis">
                {{ success ? 'Account Activated!' : 'Activation Failed' }}
            </h1>
            <p class="mb-4">
                {{
                    success
                        ? 'Your account has been successfully activated. You can now log in.'
                        : 'The activation link is invalid or has expired. Please request a new one.'
                }}
            </p>
            <router-link :to="success ? '/login' : '/resend-activation'">
                <button class="btn btn-outline-primary">
                    {{ success ? 'Go to Login' : 'Resend Activation Email' }}
                </button>
            </router-link>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'ActivateAccountPage',
    props: {
        uid: String,
        token: String,
    },
    data() {
        return {
            loading: true,
            success: false,
        };
    },

    mounted() {
        this.handleActivation();
    },

    methods: {
        ...mapActions('authentication', ['activateAccount']),

        async handleActivation() {
            const { uid, token } = this.$route.params;

            try {
                await this.activateAccount({ uid, token });
                this.success = true;
                toast.success('Account activated successfully!');
            } catch {
                this.success = false;
                toast.error('Failed to activate account.');
            } finally {
                this.loading = false;
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
.navbar-brand {
    font-weight: bold;
    font-size: 1.4rem;
    color: #fff !important;
}
.activation-page {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
}
.btn {
    padding: 0.75rem 1.5rem;
}
</style>
