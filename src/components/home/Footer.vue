<template>
    <footer class="footer text-light py-5">
        <div class="container">
            <div class="row g-4">
                <!-- About Section -->
                <div class="col-lg-3 col-md-6">
                    <h5 class="footer-title">📚 GradesWorld</h5>
                    <p class="footer-desc">
                        Earn money by sharing your study materials! Upload your notes, help
                        students, and get paid for your knowledge.
                    </p>
                </div>

                <!-- Quick Links -->
                <div class="col-lg-3 col-md-6">
                    <h5 class="footer-title">🚀 Quick Links</h5>
                    <ul class="list-unstyled footer-list">
                        <li>
                            <router-link to="/about" class="footer-link"> About Us </router-link>
                        </li>
                        <li>
                            <router-link to="/terms" class="footer-link">
                                Terms & Conditions
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/privacy" class="footer-link">
                                Privacy Policy
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/contact" class="footer-link">
                                Contact Us
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/blog" class="footer-link"> Blog </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Support -->
                <div class="col-lg-3 col-md-6">
                    <h5 class="footer-title">🤝 Support</h5>
                    <ul class="list-unstyled footer-list">
                        <li>
                            <router-link to="/faq" class="footer-link"> FAQs </router-link>
                        </li>
                        <li>
                            <router-link to="/help" class="footer-link"> Help Center </router-link>
                        </li>
                        <li>
                            <router-link to="/live-chat" class="footer-link">
                                Live Chat
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/report-issue" class="footer-link">
                                Report an Issue
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Social & Payments -->
                <div class="col-lg-3 col-md-6">
                    <h5 class="footer-title">📲 Connect With Us</h5>
                    <div class="social-icons mb-3">
                        <a href="https://x.com" target="_blank" class="social x" aria-label="X">
                            <i class="fa-brands fa-x-twitter"></i>
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            class="social facebook"
                            aria-label="Facebook"
                        >
                            <i class="fa-brands fa-facebook"></i>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            class="social instagram"
                            aria-label="Instagram"
                        >
                            <i class="fa-brands fa-instagram"></i>
                        </a>
                    </div>

                    <h6 class="footer-subtitle">💳 Secure Payments</h6>
                    <p class="footer-desc">
                        We support fast and secure transactions via Visa, MasterCard, and PayPal and
                        Mpesa.
                    </p>
                </div>
            </div>

            <hr class="border-light my-4" />

            <div class="text-center mt-4">
                <small class="text-primary">
                    &copy; {{ new Date().getFullYear() }} Gradesworld. All rights reserved.
                </small>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
};
</script>

<style scoped>
.footer {
    background-color: #1a1a1a;
    color: #eaeaea;
}

.footer-title {
    font-weight: 600;
    margin-bottom: 1rem;
}

.footer-subtitle {
    font-size: 1rem;
    font-weight: 500;
    margin-top: 1.25rem;
}

.footer-desc {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #ccc;
}

.footer-link {
    display: block;
    color: #bbb;
    text-decoration: none;
    padding: 0.25rem 0;
    transition: color 0.3s;
}
.footer-link:hover {
    color: #ffc107;
}

.social-icons {
    display: flex;
    gap: 12px;
}

.social {
    font-size: 20px;
    transition:
        transform 0.3s ease,
        color 0.3s ease;
}

.social:hover {
    transform: scale(1.15);
}

.x {
    color: #000;
}
.x:hover {
    color: #6c757d;
}

.facebook {
    color: #1877f2;
}
.facebook:hover {
    color: #1254b3;
}

.instagram {
    color: #e1306c;
}
.instagram:hover {
    color: #bc2a6e;
}

.payment-icons {
    margin-top: 0.5rem;
}
.payment-logo {
    width: 40px;
    height: auto;
    filter: brightness(0.95);
}
</style>
