<template>
    <div class="d-flex flex-column min-vh-100">
        <Navbar />

        <main class="flex-grow-1">
            <section class="page-section py-5 bg-light">
                <div class="container py-lg-5">
                    <div class="text-center mb-5">
                        <h1 class="display-4 fw-bold text-primary mb-3">Contact Us</h1>
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <p class="lead text-secondary">
                                    Have questions or want to discuss partnership opportunities?
                                    We'd love to hear from you!
                                </p>
                                <div class="d-flex justify-content-center gap-3 mt-4">
                                    <a
                                        href="mailto:contact@example.com"
                                        class="btn btn-outline-primary"
                                    >
                                        <i class="bi bi-envelope me-2"></i>Email Us
                                    </a>
                                    <a href="tel:+1234567890" class="btn btn-outline-secondary">
                                        <i class="bi bi-telephone me-2"></i>Call Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-lg-8 col-xl-6">
                            <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
                                <div class="card-body p-4 p-md-5">
                                    <h2 class="h4 text-center mb-4 fw-semibold">
                                        Send us a message
                                    </h2>
                                    <ContactForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Additional Contact Info Section
      <section class="py-5 bg-white">
        <div class="container">
          <div class="row g-4 justify-content-center text-center">
            <div class="col-md-4">
              <div class="p-3 rounded-2 bg-primary bg-opacity-10">
                <i class="bi bi-geo-alt fs-2 text-primary mb-3"></i>
                <h3 class="h5">Our Location</h3>
                <p class="mb-0 text-muted">123 Business Ave, Suite 100<br>City, ST 12345</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-3 rounded-2 bg-primary bg-opacity-10">
                <i class="bi bi-telephone fs-2 text-primary mb-3"></i>
                <h3 class="h5">Phone</h3>
                <p class="mb-0 text-muted">+1 (234) 567-8900<br>Mon-Fri, 9am-5pm</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-3 rounded-2 bg-primary bg-opacity-10">
                <i class="bi bi-envelope fs-2 text-primary mb-3"></i>
                <h3 class="h5">Email</h3>
                <p class="mb-0 text-muted">contact@example.com<br>support@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </section> -->
        </main>

        <Footer />
    </div>
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';
import ContactForm from '@/components/views/ContactForm.vue';

export default {
    name: 'ContactUs',
    components: {
        Footer,
        Navbar,
        ContactForm,
    },
};
</script>

<style scoped>
.page-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}
.min-vh-100 {
    min-height: 100vh;
}
</style>
