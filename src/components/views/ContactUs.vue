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
                    <ContactForm />
                </div>
            </div>
        </div>
    </section>
    <Footer />
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
