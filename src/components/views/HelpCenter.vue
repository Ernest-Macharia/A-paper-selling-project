<template>
    <Navbar />
    <section class="help-center py-5 bg-light">
        <!-- Hero Section -->
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center">
                    <h1 class="display-4 fw-bold text-primary mb-4">Help Center</h1>
                    <p class="lead text-secondary mb-5">
                        Get instant help with our comprehensive support resources or contact our
                        team directly.
                    </p>
                    <div class="d-flex gap-3 justify-content-center">
                        <router-link to="/contact" class="btn btn-primary btn-lg px-4">
                            <i class="bi bi-headset me-2"></i>Contact Support
                        </router-link>
                        <router-link to="/faq" class="btn btn-outline-secondary btn-lg px-4">
                            <i class="bi bi-question-circle me-2"></i>Browse FAQs
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Support Options -->
        <div class="container py-5">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div
                                class="bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3 mx-auto"
                                style="width: 60px; height: 60px"
                            >
                                <i class="bi bi-envelope fs-4"></i>
                            </div>
                            <h3 class="h5 mb-3">Email Support</h3>
                            <p class="text-muted mb-4">
                                Get detailed help from our support team within 24 hours.
                            </p>
                            <a href="mailto:scholar@gradesworld.com" class="btn btn-outline-primary"
                                >scholar@gradesworld.com</a
                            >
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div
                                class="bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3 mx-auto"
                                style="width: 60px; height: 60px"
                            >
                                <i class="bi bi-chat-left-text fs-4"></i>
                            </div>
                            <h3 class="h5 mb-3">Live Chat</h3>
                            <p class="text-muted mb-4">
                                Chat with our support agents in real-time during business hours.
                            </p>
                            <button class="btn btn-outline-primary">Start Chat</button>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div
                                class="bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3 mx-auto"
                                style="width: 60px; height: 60px"
                            >
                                <i class="bi bi-book fs-4"></i>
                            </div>
                            <h3 class="h5 mb-3">Knowledge Base</h3>
                            <p class="text-muted mb-4">
                                Browse our comprehensive guides and tutorials.
                            </p>
                            <router-link to="/knowledge-base" class="btn btn-outline-primary"
                                >View Resources</router-link
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAQ Section
    <div id="faq" class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h2 class="text-center mb-5">Frequently Asked Questions</h2>
          
          <div class="accordion" id="faqAccordion">
            <div class="accordion-item border-0 mb-3 shadow-sm">
              <h3 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  How do I reset my password?
                </button>
              </h3>
              <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                  You can reset your password by clicking on "Forgot Password" on the login page. We'll send a reset link to your registered email address.
                </div>
              </div>
            </div>
            
            <div class="accordion-item border-0 mb-3 shadow-sm">
              <h3 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  What are your support hours?
                </button>
              </h3>
              <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                  Our live chat support is available Monday to Friday, 9 AM to 6 PM EST. Email support is available 24/7 with responses typically within 24 hours.
                </div>
              </div>
            </div>
            
            <div class="accordion-item border-0 mb-3 shadow-sm">
              <h3 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  How can I update my account information?
                </button>
              </h3>
              <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                  You can update your account information by navigating to your profile settings after logging in. For security reasons, some changes may require verification.
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-5">
            <p class="text-muted">Didn't find what you were looking for?</p>
            <router-link to="/contact" class="btn btn-primary">Contact Our Support Team</router-link>
          </div>
        </div>
      </div>
    </div> -->
    </section>
    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'HelpCenter',
    components: {
        Footer,
        Navbar,
    },
};
</script>

<style scoped>
.help-center {
    min-height: calc(100vh - 120px); /* Adjust based on your header/footer height */
}

.card {
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.accordion-button:not(.collapsed) {
    background-color: rgba(13, 110, 253, 0.05);
    color: var(--bs-primary);
}

.accordion-button:focus {
    box-shadow: none;
    border-color: rgba(13, 110, 253, 0.25);
}
</style>
