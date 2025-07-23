<template>
    <div class="auth-layout">
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <router-link class="navbar-brand" to="/">
                    <img
                        src="@/assets/images/gradesworld.png"
                        alt="GradesWorld Logo"
                        height="40"
                        class="d-inline-block align-top"
                    />
                </router-link>
            </div>
        </nav>

        <main class="auth-container">
            <div class="auth-card">
                <div class="auth-header text-center mb-4">
                    <h2 class="fw-bold text-primary">Welcome Back</h2>
                    <p class="text-muted">Sign in to access your account</p>
                </div>

                <form @submit.prevent="handleLogin" class="auth-form">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            class="form-control form-control-lg"
                            placeholder="Enter your email"
                            v-model="email"
                            @input="clearEmailError"
                            :class="{ 'is-invalid': emailError }"
                            required
                        />
                        <div class="invalid-feedback" v-if="emailError">{{ emailError }}</div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group">
                            <input
                                id="password"
                                :type="showPassword ? 'text' : 'password'"
                                class="form-control form-control-lg"
                                placeholder="Enter your password"
                                v-model="password"
                                @input="clearPasswordError"
                                :class="{ 'is-invalid': passwordError }"
                                required
                            />
                            <button
                                class="btn btn-outline-secondary"
                                type="button"
                                @click="togglePasswordVisibility"
                            >
                                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                            <div class="invalid-feedback" v-if="passwordError">
                                {{ passwordError }}
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="rememberMe" />
                            <label class="form-check-label small" for="rememberMe"
                                >Remember me</label
                            >
                        </div>
                        <router-link
                            to="/forgot-password"
                            class="small text-primary text-decoration-none"
                        >
                            Forgot Password?
                        </router-link>
                    </div>

                    <button
                        type="submit"
                        class="btn btn-primary btn-lg w-100 mb-3"
                        :disabled="auth0Loading"
                    >
                        <span v-if="!auth0Loading">Sign In</span>
                        <span
                            v-else
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    </button>

                    <div v-if="serverError" class="alert alert-danger text-center mt-3">
                        <i class="bi bi-exclamation-circle me-2"></i>{{ serverError }}
                    </div>
                </form>

                <!-- <div class="auth-divider my-4">
                    <span class="text-muted">OR CONTINUE WITH</span>
                </div>

                <button
                    class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-3"
                    @click="loginWithAuth0"
                    :disabled="auth0Loading"
                >
                    <img
                        src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                        width="20"
                        height="20"
                        alt="Google"
                    />
                    <span>Google</span>
                </button> -->

                <div class="auth-footer text-center mt-4">
                    <p class="text-muted">
                        Don't have an account?
                        <router-link
                            to="/register"
                            class="text-primary text-decoration-none fw-semibold"
                        >
                            Sign up
                        </router-link>
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { useAuth0 } from '@auth0/auth0-vue';
import { toast } from 'vue3-toastify';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            emailError: '',
            passwordError: '',
            serverError: '',
            showPassword: false,
            auth0Loading: false,
        };
    },
    setup() {
        const auth0 = useAuth0();
        return { auth0 };
    },

    async created() {
        if (window.location.search.includes('code=')) {
            this.auth0Loading = true;
            try {
                await this.auth0.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.pathname);

                const success = await this.handleAuth0Callback();
                if (success) {
                    this.redirectAfterLogin();
                }
            } catch (error) {
                toast.error('Auth0 login failed');
                console.error(error);
            } finally {
                this.auth0Loading = false;
            }
        }
    },
    methods: {
        ...mapActions('authentication', ['login', 'handleAuth0Callback']),

        validateEmail() {
            if (!this.email) {
                this.emailError = 'Email is required.';
            } else if (!/\S+@\S+\.\S+/.test(this.email)) {
                this.emailError = 'Enter a valid email address.';
            } else {
                this.emailError = '';
            }
        },

        validatePassword() {
            if (!this.password) {
                this.passwordError = 'Password is required.';
            } else if (this.password.length < 8) {
                this.passwordError = 'Password must be at least 8 characters.';
            } else {
                this.passwordError = '';
            }
        },

        clearEmailError() {
            this.emailError = '';
            this.serverError = '';
        },

        clearPasswordError() {
            this.passwordError = '';
            this.serverError = '';
        },

        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },

        async handleLogin() {
            this.validateEmail();
            this.validatePassword();

            if (this.emailError || this.passwordError) return;

            try {
                await this.login({ email: this.email, password: this.password });
                this.redirectAfterLogin();
            } catch (error) {
                this.serverError = error.response?.data?.detail || 'Invalid email or password.';
            }
        },

        async loginWithAuth0() {
            this.loading = true;
            try {
                localStorage.removeItem('auth0.is.authenticated');

                await this.auth0.loginWithRedirect({
                    authorizationParams: {
                        redirect_uri: window.location.origin,
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        scope: 'openid profile email offline_access',
                        prompt: 'select_account',
                    },
                    appState: {
                        target: this.$route.path,
                    },
                });
            } catch (error) {
                if (error.error !== 'popup_closed') {
                    toast.error('Login failed. Please try again.');
                    console.error('Auth0 error:', error);
                }
            } finally {
                this.loading = false;
            }
        },

        redirectAfterLogin() {
            const redirectTo = this.$route.query.redirect || '/';
            const openPayment = this.$route.query.openPayment;

            this.$router.push(redirectTo).then(() => {
                if (openPayment) {
                    this.$store.commit('payment/SET_SHOW_PAYMENT_MODAL', true);
                }
            });
        },
    },
};
</script>

<style scoped>
.auth-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
}

.navbar {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    padding: 2rem 1rem;
}

.auth-card {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 2.5rem;
}

.auth-header h2 {
    margin-bottom: 0.5rem;
}

.auth-divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: #6c757d;
    font-size: 0.875rem;
}

.auth-divider::before,
.auth-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #dee2e6;
}

.auth-divider::before {
    margin-right: 1rem;
}

.auth-divider::after {
    margin-left: 1rem;
}

.form-control-lg {
    padding: 0.75rem 1rem;
}

.btn-lg {
    padding: 0.75rem 1rem;
    font-weight: 500;
}

@media (max-width: 576px) {
    .auth-card {
        padding: 1.5rem;
        border-radius: 0;
        box-shadow: none;
    }
}
</style>
