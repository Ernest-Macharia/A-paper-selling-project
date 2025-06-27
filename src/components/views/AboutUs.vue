<template>
    <Navbar />
    <section class="py-5 bg-light">
        <div class="container">
            <h1 class="text-center mb-4">About Us</h1>
            <p class="lead text-center text-muted">
                Learn more about our mission, values, and the team behind our platform.
            </p>
            <hr />
            <div class="row mt-5">
                <div class="col-md-6">
                    <h4>Our Mission</h4>
                    <p>
                        We are dedicated to providing students with easy access to academic papers,
                        study materials, and educational resources to help them succeed.
                    </p>
                </div>
                <div class="col-md-6">
                    <h4>Why Choose Us?</h4>
                    <ul class="list-unstyled">
                        <li>✅ Trusted academic resources</li>
                        <li>✅ Easy access and affordable pricing</li>
                        <li>✅ Community and expert support</li>
                    </ul>
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
    name: 'AboutUs',
    components: {
        Footer,
        Navbar,
    },
};
</script>
