<template>
    <footer class="site-footer bg-primary text-white pt-5 pb-4">
        <div class="container">
            <div class="row g-4">
                <!-- Brand Column -->
                <div class="col-lg-3 col-md-6">
                    <div class="footer-brand mb-3">
                        <router-link to="/" class="d-flex align-items-center text-decoration-none">
                            <img
                                src="@/assets/images/gradesworld.png"
                                alt="GradesWorld Logo"
                                height="40"
                                class="me-2"
                            />
                            <span class="h5 mb-0 text-white">GradesWorld</span>
                        </router-link>
                    </div>
                    <p class="footer-text">
                        Empower your learning journey. Share knowledge, earn rewards, and access
                        premium study materials.
                    </p>
                    <div class="payment-methods mt-3 d-flex align-items-center flex-wrap gap-2">
                        <!-- Visa Logo -->
                        <div class="payment-logo bg-white p-1 rounded">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                                height="24"
                                alt="Visa"
                            />
                        </div>

                        <!-- Mastercard Logo -->
                        <div class="payment-logo bg-white p-1 rounded">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                height="24"
                                alt="Mastercard"
                            />
                        </div>

                        <!-- PayPal Logo -->
                        <div class="payment-logo bg-white p-1 rounded">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                height="24"
                                alt="PayPal"
                            />
                        </div>

                        <!-- M-Pesa Logo -->
                        <div class="payment-logo bg-white p-1 rounded">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg"
                                height="24"
                                alt="M-Pesa"
                            />
                        </div>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="col-lg-2 col-md-6">
                    <h5 class="footer-heading mb-3">Quick Links</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item mb-2">
                            <router-link to="/about" class="nav-link p-0 text-white-50 hover-white"
                                >About Us</router-link
                            >
                        </li>
                        <li class="nav-item mb-2">
                            <router-link to="/blog" class="nav-link p-0 text-white-50 hover-white"
                                >Blog</router-link
                            >
                        </li>
                        <li class="nav-item mb-2">
                            <router-link
                                to="/contact"
                                class="nav-link p-0 text-white-50 hover-white"
                                >Contact</router-link
                            >
                        </li>
                        <li class="nav-item mb-2">
                            <router-link to="/faq" class="nav-link p-0 text-white-50 hover-white"
                                >FAQs</router-link
                            >
                        </li>
                    </ul>
                </div>

                <!-- Legal -->
                <div class="col-lg-2 col-md-6">
                    <h5 class="footer-heading mb-3">Legal</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item mb-2">
                            <router-link to="/terms" class="nav-link p-0 text-white-50 hover-white"
                                >Terms</router-link
                            >
                        </li>
                        <li class="nav-item mb-2">
                            <router-link
                                to="/privacy"
                                class="nav-link p-0 text-white-50 hover-white"
                                >Privacy</router-link
                            >
                        </li>
                        <li class="nav-item mb-2">
                            <router-link
                                to="/refund-policy"
                                class="nav-link p-0 text-white-50 hover-white"
                                >Refunds</router-link
                            >
                        </li>
                        <li class="nav-item mb-2">
                            <router-link to="/help" class="nav-link p-0 text-white-50 hover-white"
                                >Help Center</router-link
                            >
                        </li>
                    </ul>
                </div>

                <!-- Contact & Social -->
                <div class="col-lg-3 col-md-6">
                    <h5 class="footer-heading mb-3">Connect With Us</h5>
                    <div class="mb-3">
                        <a
                            href="mailto:scholar@gradesworld.com"
                            class="d-flex align-items-center text-white-50 hover-white text-decoration-none mb-2"
                        >
                            <i class="bi bi-envelope me-2"></i> scholar@gradesworld.com
                        </a>
                    </div>

                    <div class="social-links mb-4">
                        <a
                            href="https://x.com"
                            target="_blank"
                            class="social-link text-decoration-none me-3"
                            aria-label="Twitter"
                        >
                            <i class="bi bi-twitter-x"></i>
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            class="social-link text-decoration-none me-3"
                            aria-label="Facebook"
                        >
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            class="social-link text-decoration-none me-3"
                            aria-label="Instagram"
                        >
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            class="social-link text-decoration-none"
                            aria-label="LinkedIn"
                        >
                            <i class="bi bi-linkedin"></i>
                        </a>
                    </div>

                    <div class="newsletter">
                        <h6 class="footer-subheading mb-2">Stay Updated</h6>
                        <div v-if="!isSubscribed" class="input-group">
                            <input
                                type="email"
                                v-model="email"
                                class="form-control form-control-sm"
                                placeholder="Your email"
                                aria-label="Email newsletter"
                                :disabled="isLoading"
                            />
                            <button
                                class="btn btn-light btn-sm"
                                type="button"
                                @click="handleSubscribe"
                                :disabled="isLoading || !isValidEmail"
                            >
                                <span v-if="isLoading">
                                    <span
                                        class="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Subscribing...
                                </span>
                                <span v-else>Subscribe</span>
                            </button>
                        </div>
                        <div v-else class="alert alert-success mt-2 mb-0 py-1 small">
                            Thank you for subscribing!
                        </div>
                        <div v-if="error" class="alert alert-danger mt-2 mb-0 py-1 small">
                            {{ error }}
                        </div>
                    </div>
                </div>
            </div>

            <hr class="border-light border-opacity-25 my-4" />

            <div class="footer-bottom text-center pt-3">
                <p class="mb-0 small">
                    &copy; {{ new Date().getFullYear() }} GradesWorld. All rights reserved.
                    <span class="d-block d-md-inline-block mt-2 mt-md-0">
                        Made with <i class="bi bi-heart-fill text-danger"></i> for students
                        worldwide
                    </span>
                </p>
            </div>
        </div>
    </footer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { toast } from 'vue3-toastify';
export default {
    data() {
        return {
            email: '',
        };
    },
    computed: {
        ...mapGetters('communications', ['isLoading', 'isNewsletterSubscribed', 'newsletterError']),
        isValidEmail() {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(this.email);
        },
        isSubscribed() {
            return this.isNewsletterSubscribed;
        },
        error() {
            return this.newsletterError;
        },
    },
    methods: {
        ...mapActions('communications', ['subscribeToNewsletter']),

        async handleSubscribe() {
            if (!this.isValidEmail) {
                toast.error('Please enter a valid email address');
                return;
            }

            try {
                await this.subscribeToNewsletter(this.email);
                toast.success('You have been subscribed to our newsletter!');
            } catch {
                toast.error('Failed to subscribe to newsletter');
            }
        },
    },
};
</script>

<style scoped>
.site-footer {
    background: linear-gradient(135deg, #6ea8fe, #b28dff);
    position: relative;
    overflow: hidden;
}

.site-footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.15);
}

.footer-brand {
    font-weight: 700;
}

.footer-heading {
    font-weight: 600;
    font-size: 1.1rem;
    position: relative;
    padding-bottom: 0.5rem;
}

.footer-heading::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.5);
}

.footer-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.6;
}

.hover-white {
    transition: color 0.2s ease;
}

.hover-white:hover {
    color: white !important;
}

.payment-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 60px;
}

.payment-logo img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.social-link {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.25rem;
    transition:
        color 0.2s ease,
        transform 0.2s ease;
    display: inline-block;
}

.social-link:hover {
    color: white !important;
    transform: translateY(-2px);
}

.payment-methods img {
    background: white;
    padding: 4px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mpesa-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.footer-subheading {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
    .site-footer {
        text-align: center;
    }

    .footer-heading::after {
        left: 50%;
        transform: translateX(-50%);
    }

    .social-links {
        justify-content: center;
    }

    .payment-methods {
        justify-content: center;
    }
}
</style>
