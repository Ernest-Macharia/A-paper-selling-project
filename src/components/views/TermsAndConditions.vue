<template>
    <Navbar />
    <section class="py-5 bg-white">
        <div class="container">
            <h1 class="text-center mb-4">Terms & Conditions</h1>
            <p class="text-muted">Last updated: June 2025</p>
            <hr />
            <div class="mt-4">
                <h5>1. Introduction</h5>
                <p>By accessing our website, you agree to these terms...</p>
                <h5>2. User Responsibilities</h5>
                <p>Do not misuse our services or attempt to hack our platform...</p>
            </div>
        </div>
    </section>
    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'TermsAndConditions',
    components: {
        Footer,
        Navbar,
    },
};
</script>
