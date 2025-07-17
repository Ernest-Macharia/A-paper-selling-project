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
    <div class="vh-100 d-flex justify-content-center align-items-center">
        <div class="card p-4 shadow-lg" style="width: 22rem">
            <h3 class="text-center mb-1 text-primary">Welcome to GradesWorld</h3>
            <p class="text-center mb-3 text-muted">Sign in to your account</p>
            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input
                        type="email"
                        class="form-control"
                        placeholder="Enter email"
                        v-model="email"
                        @input="clearEmailError"
                        required
                    />
                    <span class="text-danger" v-if="emailError">{{ emailError }}</span>
                </div>
                <div class="mb-3 position-relative">
                    <label class="form-label">Password</label>
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        placeholder="Enter password"
                        v-model="password"
                        @input="clearPasswordError"
                        required
                    />
                    <span class="text-danger" v-if="passwordError">{{ passwordError }}</span>

                    <!-- Eye Icon -->
                    <span
                        @click="togglePasswordVisibility"
                        class="position-absolute"
                        style="right: 10px; top: 35px; cursor: pointer"
                    >
                        {{ showPassword ? '🙈' : '👁️' }}
                    </span>
                </div>

                <div class="d-flex justify-content-left mb-3">
                    <router-link to="/forgot-password" class="small text-primary">
                        Forgot Password?
                    </router-link>
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
                <div v-if="serverError" class="alert alert-danger mt-3 text-center">
                    {{ serverError }}
                </div>
            </form>

            <div class="my-3 text-center text-muted">OR</div>

            <button
                class="btn google-official-btn w-100 d-flex align-items-center justify-content-center gap-3 py-2"
                @click="loginWithAuth0"
            >
                <img
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    width="20"
                    height="20"
                    alt="Google"
                />
                <span>Continue with Google</span>
            </button>

            <p class="mt-3 text-center text-muted">
                Don't have an account?
                <router-link to="/register" class="text-primary">Register</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { useAuth0 } from '@auth0/auth0-vue';

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
        // Handle Auth0 callback if returning from redirect
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

                // const redirectTo = this.$route.query.redirect || '/';
                // const openPayment = this.$route.query.openPayment;
                this.redirectAfterLogin();

                // this.$router.push(redirectTo).then(() => {
                //     if (openPayment) {
                //         this.$store.commit('payment/SET_SHOW_PAYMENT_MODAL', true);
                //     }
                // });
            } catch (error) {
                this.serverError = error.response?.data?.detail || 'Invalid email or password.';
            }
        },

        async loginWithAuth0() {
            this.auth0Loading = true;
            try {
                localStorage.setItem('returnTo', this.$route.query.redirect || '/dashboard');
                await this.auth0.loginWithRedirect({
                    authorizationParams: {
                        redirect_uri: window.location.origin,
                        scope: 'openid profile email',
                    },
                });
            } catch (error) {
                toast.error('Auth0 login failed');
                console.error(error);
                localStorage.removeItem('returnTo');
            } finally {
                this.auth0Loading = false;
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

.google-official-btn {
    background: white;
    border: 1px solid #dadce0;
    border-radius: 4px;
    color: #3c4043;
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    padding: 0 24px;
    transition:
        background-color 0.218s,
        border-color 0.218s,
        box-shadow 0.218s;
}

.google-official-btn:hover {
    background: #f7f8f8;
    box-shadow:
        0 1px 3px 1px rgba(66, 64, 67, 0.15),
        0 1px 2px 0 rgba(60, 64, 67, 0.3);
}

.google-official-btn:active {
    background: #e8eaed;
}
</style>
