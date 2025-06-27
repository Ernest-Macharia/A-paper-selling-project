<template>
    <Navbar />
    <section class="page-section py-5">
        <div class="container">
            <h1 class="fw-bold text-primary mb-4 text-center">Privacy Policy</h1>
            <p class="text-muted">
                We respect your privacy and are committed to protecting your personal data.
            </p>
            <p class="text-secondary">
                We only collect essential data to improve our services. We never sell your
                information. Your data is stored securely and is only used in accordance with this
                policy.
            </p>
        </div>
    </section>
    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'PrivacyPolicy',
    components: {
        Footer,
        Navbar,
    },
};
</script>
