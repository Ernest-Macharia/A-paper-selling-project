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
                    <h2 class="fw-bold text-primary">Join GradesWorld</h2>
                    <p class="text-muted">Create your account to get started</p>
                </div>

                <form @submit.prevent="handleRegister" class="auth-form">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="firstName" class="form-label">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    class="form-control form-control-lg"
                                    placeholder="Enter first name"
                                    v-model="firstName"
                                    @input="clearFirstNameError"
                                    :class="{ 'is-invalid': firstNameError }"
                                    required
                                />
                                <div class="invalid-feedback" v-if="firstNameError">
                                    {{ firstNameError }}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="lastName" class="form-label">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    class="form-control form-control-lg"
                                    placeholder="Enter last name"
                                    v-model="lastName"
                                    @input="clearLastNameError"
                                    :class="{ 'is-invalid': lastNameError }"
                                    required
                                />
                                <div class="invalid-feedback" v-if="lastNameError">
                                    {{ lastNameError }}
                                </div>
                            </div>
                        </div>
                    </div>

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

                    <div class="mb-4">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group">
                            <input
                                id="password"
                                :type="showPassword ? 'text' : 'password'"
                                class="form-control form-control-lg"
                                placeholder="Create a password"
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
                        <div class="form-text">
                            Use 8 or more characters with a mix of letters, numbers & symbols
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="termsAgreement"
                                required
                            />
                            <label class="form-check-label small" for="termsAgreement">
                                I agree to the
                                <a href="#" class="text-primary text-decoration-none">Terms</a> and
                                <a href="#" class="text-primary text-decoration-none"
                                    >Privacy Policy</a
                                >
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        class="btn btn-primary btn-lg w-100 mb-3"
                        :disabled="loading"
                    >
                        <span v-if="!loading">Create Account</span>
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

                <div class="auth-divider my-4">
                    <span class="text-muted">OR SIGN UP WITH</span>
                </div>

                <button
                    class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-3"
                    @click="signUpWithGoogle"
                    :disabled="loading"
                >
                    <img
                        src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                        width="20"
                        height="20"
                        alt="Google"
                    />
                    <span>Continue with Google</span>
                </button>

                <div class="auth-footer text-center mt-4">
                    <p class="text-muted">
                        Already have an account?
                        <router-link
                            to="/login"
                            class="text-primary text-decoration-none fw-semibold"
                        >
                            Sign in
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
    name: 'Register',
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            firstNameError: '',
            lastNameError: '',
            emailError: '',
            passwordError: '',
            serverError: '',
            showPassword: false,
            loading: false,
        };
    },
    setup() {
        const auth0 = useAuth0();
        return { auth0 };
    },
    methods: {
        ...mapActions('authentication', ['register']),

        validateFirstName() {
            this.firstNameError = this.firstName ? '' : 'First name is required.';
        },
        clearFirstNameError() {
            this.firstNameError = '';
            this.serverError = '';
        },

        validateLastName() {
            this.lastNameError = this.lastName ? '' : 'Last name is required.';
        },
        clearLastNameError() {
            this.lastNameError = '';
            this.serverError = '';
        },

        validateEmail() {
            if (!this.email) {
                this.emailError = 'Email is required.';
            } else if (!/\S+@\S+\.\S+/.test(this.email)) {
                this.emailError = 'Enter a valid email address.';
            } else {
                this.emailError = '';
            }
        },
        clearEmailError() {
            this.emailError = '';
            this.serverError = '';
        },

        validatePassword() {
            if (!this.password) {
                this.passwordError = 'Password is required.';
            } else if (this.password.length < 8) {
                this.passwordError = 'Password must be at least 8 characters long.';
            } else {
                this.passwordError = '';
            }
        },
        clearPasswordError() {
            this.passwordError = '';
            this.serverError = '';
        },

        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },

        async handleRegister() {
            this.validateAllFields();
            if (this.hasErrors()) return;

            this.loading = true;
            try {
                await this.register({
                    first_name: this.firstName,
                    last_name: this.lastName,
                    email: this.email,
                    password: this.password,
                });

                toast.success('Account created! Please check your email to activate.');
                this.$router.push('/activation-sent');
            } catch (error) {
                this.handleRegistrationError(error);
            } finally {
                this.loading = false;
            }
        },

        validateAllFields() {
            this.validateFirstName();
            this.validateLastName();
            this.validateEmail();
            this.validatePassword();
        },

        hasErrors() {
            return !!(
                this.firstNameError ||
                this.lastNameError ||
                this.emailError ||
                this.passwordError
            );
        },

        handleRegistrationError(error) {
            const responseData = error.response?.data;
            this.serverError =
                responseData?.detail ||
                responseData?.email?.[0] ||
                'Registration failed. Please try again.';

            if (responseData?.email) {
                this.emailError = responseData.email[0];
            }

            toast.error(this.serverError);
        },

        async signUpWithGoogle() {
            this.loading = true;
            try {
                localStorage.setItem('auth_flow', 'registration');

                await this.auth0.loginWithRedirect({
                    authorizationParams: {
                        screen_hint: 'signup',
                        redirect_uri: window.location.origin,
                        scope: 'openid profile email',
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        connection: 'google-oauth2',
                    },
                });
            } catch (error) {
                if (error.error === 'cancelled') {
                    // User closed the popup
                    return;
                }
                console.error('Google signup error:', error);
                toast.error('Failed to initiate Google signup');
                localStorage.removeItem('auth_flow');
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
/* Reusing the same styles from login page for consistency */
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
    max-width: 480px;
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
