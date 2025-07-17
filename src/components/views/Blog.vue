<template>
    <Navbar />
    <main class="blog-page">
        <!-- Hero Section -->
        <section class="blog-hero bg-primary bg-gradient py-5">
            <div class="container py-4 py-lg-5">
                <div class="row justify-content-center">
                    <div class="col-lg-8 text-center text-white">
                        <h1 class="display-4 fw-bold mb-3">Our Blog</h1>
                        <p class="lead mb-4">
                            Discover valuable insights, academic tips, and platform updates to
                            enhance your learning experience.
                        </p>
                        <div class="d-flex gap-2 justify-content-center">
                            <button class="btn btn-light btn-lg px-4 rounded-pill">Featured</button>
                            <button class="btn btn-outline-light btn-lg px-4 rounded-pill">
                                Latest
                            </button>
                            <button class="btn btn-outline-light btn-lg px-4 rounded-pill">
                                Popular
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Blog Content -->
        <section class="py-5">
            <div class="container">
                <!-- Coming Soon Placeholder -->
                <div class="row justify-content-center">
                    <div class="col-lg-8 text-center py-5">
                        <div class="coming-soon-placeholder bg-light p-5 rounded-4 shadow-sm">
                            <i class="bi bi-newspaper display-1 text-primary mb-4"></i>
                            <h2 class="h3 fw-bold mb-3">Exciting Content Coming Soon!</h2>
                            <p class="text-muted mb-4">
                                We're working hard to bring you valuable articles and resources.
                                Check back later or subscribe to get notified.
                            </p>
                            <div class="subscribe-form mx-auto" style="max-width: 400px">
                                <div class="input-group mb-3">
                                    <input
                                        type="email"
                                        class="form-control form-control-lg"
                                        placeholder="Your email address"
                                    />
                                    <button class="btn btn-primary" type="button">Subscribe</button>
                                </div>
                                <small class="text-muted"
                                    >We'll never share your email with anyone else.</small
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sample Blog Posts (commented out for now) -->
                <!--
                <div class="row g-4">
                    <div class="col-md-6 col-lg-4" v-for="post in blogPosts" :key="post.id">
                        <div class="card h-100 border-0 shadow-sm hover-effect">
                            <img :src="post.image" class="card-img-top" :alt="post.title">
                            <div class="card-body">
                                <div class="d-flex gap-2 mb-2">
                                    <span class="badge bg-primary bg-opacity-10 text-primary">{{ post.category }}</span>
                                    <span class="text-muted small">{{ post.date }}</span>
                                </div>
                                <h3 class="h5 card-title fw-bold">{{ post.title }}</h3>
                                <p class="card-text text-muted">{{ post.excerpt }}</p>
                            </div>
                            <div class="card-footer bg-transparent border-0">
                                <a href="#" class="btn btn-link text-primary text-decoration-none p-0">Read more <i class="bi bi-arrow-right ms-1"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                -->
            </div>
        </section>
    </main>
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
    data() {
        return {
            // Sample data structure for when you add real blog posts
            blogPosts: [
                {
                    id: 1,
                    title: '10 Tips for Academic Success',
                    excerpt:
                        'Discover proven strategies to improve your study habits and academic performance.',
                    category: 'Academics',
                    date: 'May 15, 2023',
                    image: 'https://via.placeholder.com/400x225',
                },
                {
                    id: 2,
                    title: 'New Platform Features Released',
                    excerpt:
                        'Learn about the exciting new tools weve added to enhance your learning experience.',
                    category: 'Updates',
                    date: 'June 2, 2023',
                    image: 'https://via.placeholder.com/400x225',
                },
                {
                    id: 3,
                    title: 'Time Management for Students',
                    excerpt:
                        'Effective techniques to balance coursework, extracurriculars, and personal life.',
                    category: 'Productivity',
                    date: 'June 10, 2023',
                    image: 'https://via.placeholder.com/400x225',
                },
            ],
        };
    },
};
</script>

<style scoped>
.blog-hero {
    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
    position: relative;
    overflow: hidden;
}

.blog-hero::after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: white;
    transform: skewY(-2deg);
    z-index: 1;
}

.coming-soon-placeholder {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.hover-effect {
    transition: all 0.3s ease;
}

.hover-effect:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.subscribe-form .form-control {
    border-right: 0;
}

.subscribe-form .btn {
    border-left: 0;
}

@media (max-width: 768px) {
    .blog-hero {
        padding-top: 3rem;
        padding-bottom: 3rem;
    }

    .blog-hero h1 {
        font-size: 2.5rem;
    }
}
</style>
