<template>
    <Navbar />
    <section class="page-section py-5">
        <div class="container text-center">
            <h1 class="fw-bold text-primary mb-4">Our Blog</h1>
            <p class="lead text-muted">Explore updates, academic tips, and platform features.</p>
            <!-- Replace this with a real blog list if needed -->
            <p class="text-secondary">Coming soon... Stay tuned!</p>
        </div>
    </section>
    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'Blog',
    components: {
        Footer,
        Navbar,
    },
};
</script>
