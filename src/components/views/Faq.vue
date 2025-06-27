<template>
    <Navbar />
    <section class="page-section py-5">
        <div class="container">
            <h1 class="fw-bold text-primary mb-4 text-center">Frequently Asked Questions</h1>
            <ul class="list-group">
                <li class="list-group-item">
                    <strong>How do I upload a paper?</strong>
                    <p class="text-muted">Click “Upload” in your dashboard and follow the steps.</p>
                </li>
                <li class="list-group-item">
                    <strong>Is my data secure?</strong>
                    <p class="text-muted">Yes, we use encryption and secure servers.</p>
                </li>
            </ul>
        </div>
    </section>
    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'Faq',
    components: {
        Footer,
        Navbar,
    },
};
</script>
