<template>
    <Navbar />
    <section class="page-section py-5">
        <div class="container text-center">
            <h1 class="fw-bold text-primary mb-4">Help Center</h1>
            <p class="lead text-muted">
                Need help navigating our platform? Our team is here for you 24/7.
            </p>
            <p class="lead text-muted">You can contact us via email at scholar@gradesworld.com</p>
            <router-link to="/contact" class="btn btn-outline-primary mt-3"
                >Contact Support</router-link
            >
        </div>
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
