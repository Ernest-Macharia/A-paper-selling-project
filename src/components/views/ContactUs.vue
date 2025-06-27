<template>
    <Navbar />
    <section class="page-section py-5">
        <div class="container">
            <h1 class="fw-bold text-primary text-center mb-4">Contact Us</h1>
            <p class="lead text-center text-muted">
                Reach out with questions, feedback, or partnership opportunities.
            </p>
            <div class="row justify-content-center mt-4">
                <div class="col-md-8">
                    <!-- Contact Form Section
        <section
            class="contact-form-section d-flex align-items-center justify-content-center py-5"
            data-aos="fade-up"
        >
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-6 col-md-8">
                        <div class="card p-4 shadow-sm rounded-4">
                            <h2 class="text-center text-primary-emphasis mb-4 fw-bold">
                                We would Love to Hear from You
                            </h2>
                            <form @submit.prevent="submitContactForm">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Full Name</label>
                                    <input
                                        v-model="form.name"
                                        type="text"
                                        class="form-control"
                                        @input="clearFormErrors('name')"
                                        id="name"
                                        required
                                    />
                                    <div v-if="formErrors.name" class="text-danger mt-1">
                                        {{ formErrors.name }}
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email Address</label>
                                    <input
                                        v-model="form.email"
                                        type="email"
                                        class="form-control"
                                        @input="clearFormErrors('email')"
                                        id="email"
                                        required
                                    />
                                    <div v-if="formErrors.email" class="text-danger mt-1">
                                        {{ formErrors.email }}
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="message" class="form-label">Message</label>
                                    <textarea
                                        v-model="form.message"
                                        class="form-control"
                                        id="message"
                                        rows="5"
                                        required
                                    >
                                    </textarea>
                                    <div v-if="formErrors.message" class="text-danger mt-1">
                                        {{ formErrors.message }}
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-outline-primary px-5">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section> -->
                </div>
            </div>
        </div>
    </section>
    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'ContactUs',
    components: {
        Footer,
        Navbar,
    },
};
</script>
