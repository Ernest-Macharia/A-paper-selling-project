<template>
    <Navbar />
    <section class="py-5 bg-light">
        <div class="container">
            <h1 class="text-center text-primary-emphasis mb-4">About Us</h1>
            <p class="lead text-center text-muted">
                Welcome to the platform where knowledge meets opportunity!
            </p>
            <hr />
            <div class="row justify-content-center mt-6">
                <div class="col-md-6 text-center">
                    <p>
                        We are an innovative Ed-Tech platform dedicated to supporting students,
                        streamlining exam preparation, and easing academic orientation. Whether
                        you're a learner searching for reliable resources or a knowledge-holder
                        ready to share your expertise, we've created the space where both can
                        thrive.
                    </p>

                    <p>
                        At the heart of what we do is a simple belief: your know-how has value.
                        That’s why we empower educators, students, and subject matter experts to
                        turn their knowledge into income by sharing quality study materials, notes,
                        guides, and more.
                    </p>

                    <p>
                        Our platform isn’t just about resources—it's about community, connection and
                        unlocking potential. We’re here to bridge the gap between learning and
                        earning by making educational content more accessible and rewarding for
                        everyone involved. Join us in redefining education. Turn your know-how into
                        income, and make an impact while doing it.
                    </p>
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
