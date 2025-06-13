<template>
    <Navbar />
    <div class="home">
        <!-- How It Works Section -->
        <section
            class="how-it-works-section py-5 bg-light"
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
        >
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="fw-bold text-primary-emphasis">Share & Discover Academic Papers</h2>
                    <p class="lead text-muted">
                        Upload, explore, and earn from top-quality academic content — made easy.
                    </p>
                    <h3 class="text-primary-emphasis fw-semibold mt-4">How It Works</h3>
                </div>

                <div class="row text-center gy-4">
                    <div class="col-md-3">
                        <div class="step-card shadow-sm bg-white p-4 rounded-4 h-100">
                            <div class="step-icon bg-primary text-white mb-3 mx-auto">
                                <i class="fas fa-user-graduate fa-lg"></i>
                            </div>
                            <h5 class="fw-semibold text-dark">1. Sign Up</h5>
                            <p class="text-muted small">
                                Create your account in just a few clicks.
                            </p>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="step-card shadow-sm bg-white p-4 rounded-4 h-100">
                            <div class="step-icon bg-success text-white mb-3 mx-auto">
                                <i class="fas fa-upload fa-lg"></i>
                            </div>
                            <h5 class="fw-semibold text-dark">2. Upload Papers</h5>
                            <p class="text-muted small">
                                Share your work and contribute knowledge.
                            </p>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="step-card shadow-sm bg-white p-4 rounded-4 h-100">
                            <div class="step-icon bg-info text-white mb-3 mx-auto">
                                <i class="fas fa-download fa-lg"></i>
                            </div>
                            <h5 class="fw-semibold text-dark">3. Download Papers</h5>
                            <p class="text-muted small">
                                Access quality academic resources anytime.
                            </p>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="step-card shadow-sm bg-white p-4 rounded-4 h-100">
                            <div class="step-icon bg-warning text-white mb-3 mx-auto">
                                <i class="fas fa-money-bill-wave fa-lg"></i>
                            </div>
                            <h5 class="fw-semibold text-dark">4. Get Paid</h5>
                            <p class="text-muted small">Earn each time your work is downloaded.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Papers Section -->
        <section class="featured-papers bg-gradient py-5" data-aos="fade-up">
            <div class="container">
                <h2 class="text-center mb-5 fw-bold text-primary-emphasis">
                    Latest Academic Papers
                </h2>
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <div class="col" v-for="(paper, index) in latestPapers" :key="index">
                        <router-link
                            :to="{ name: 'paper-details', params: { id: paper.id } }"
                            class="paper-card card h-100 text-decoration-none"
                        >
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 class="card-title text-secondary mb-2 fw-semibold">
                                        {{ paper.title }}
                                    </h5>
                                    <p class="mb-1 text-muted small">
                                        <i class="bi bi-book"></i> {{ paper.course?.name }}
                                    </p>
                                    <p class="mb-1 text-muted small">
                                        <i class="bi bi-tags"></i> {{ paper.category?.name }}
                                    </p>
                                    <p class="mb-3 text-muted small">
                                        <i class="bi bi-calendar-check"></i>
                                        {{ formatDate(paper.upload_date) }}
                                    </p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div class="text-center mt-5">
                    <router-link to="/papers" class="btn btn-outline-primary">
                        Browse All Papers
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Popular Courses Section -->
        <section class="popular-courses-section py-5" data-aos="fade-up">
            <div class="container">
                <h2 class="text-center fw-bold text-primary-emphasis mb-5">Popular Courses</h2>

                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <div
                        class="col"
                        v-for="(course, index) in popularCourses.slice(0, 6)"
                        :key="index"
                    >
                        <div class="course-card card text-center h-100 border-0 shadow-sm p-4">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <div class="icon-circle mb-3 mx-auto">
                                        <i class="bi bi-journal-richtext fs-3 text-white"></i>
                                    </div>
                                    <h5 class="card-title text-dark fw-semibold">
                                        {{ course.name }}
                                    </h5>
                                </div>
                                <p class="text-muted mt-3 mb-0 small">
                                    <span class="badge bg-primary text-light py-1 px-2">
                                        <i class="bi bi-book"></i> {{ course.paper_count }} papers
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <router-link to="/courses" class="btn btn-outline-primary"
                        >Explore All Courses</router-link
                    >
                </div>
            </div>
        </section>

        <!-- Popular Categories Section -->
        <section class="popular-categories-section py-5 bg-light" data-aos="fade-up">
            <div class="container">
                <h2 class="text-center fw-bold text-primary-emphasis mb-5">Popular Categories</h2>

                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <div
                        class="col"
                        v-for="(category, index) in popularCategories.slice(0, 6)"
                        :key="index"
                    >
                        <div class="category-card card h-100 shadow-sm p-4 border-0 text-center">
                            <div class="icon-circle bg-secondary mb-3 mx-auto">
                                <i class="bi bi-tags fs-4 text-white"></i>
                            </div>
                            <h5 class="mb-2 text-dark fw-semibold">{{ category.name }}</h5>
                            <p class="text-muted mb-0 small">
                                <span class="badge bg-primary text-light py-1 px-2">
                                    <i class="bi bi-book"></i> {{ category.paper_count }} papers
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <router-link to="/categories" class="btn btn-outline-primary">
                        Explore All Categories
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Top Contributors Section -->
        <section class="top-contributors text-center bg-light py-5" data-aos="fade-up">
            <div class="container">
                <h2 class="text-center fw-bold text-primary-emphasis mb-5">Top Contributors</h2>
                <div class="row">
                    <div class="col-md-4" v-for="(user, index) in topContributors" :key="index">
                        <div class="card p-3 shadow-sm mb-3">
                            <img
                                :src="user.avatar"
                                class="rounded-circle mb-2"
                                width="80"
                                height="80"
                            />
                            <h5>{{ user.name }}</h5>
                            <p class="text-muted">
                                {{ user.papers }} papers • {{ user.downloads }} downloads
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Why Choose GradesWorld -->
        <section class="why-us-section py-5 bg-white" data-aos="fade-up">
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="text-center fw-bold text-primary-emphasis mb-5">
                        Why Choose GradesWorld?
                    </h2>
                    <p class="lead text-muted">
                        Experience academic access like never before fast, global, and rewarding.
                    </p>
                </div>

                <div class="row text-center gy-4">
                    <div class="col-md-4">
                        <div class="why-us-card bg-light p-4 rounded-4 shadow-sm h-100">
                            <div class="icon-circle bg-primary text-white mb-3 mx-auto">
                                <i class="fas fa-bolt fa-lg"></i>
                            </div>
                            <h5 class="fw-semibold text-dark">Instant Access</h5>
                            <p class="text-muted small">
                                Download academic papers instantly without unnecessary steps or
                                friction.
                            </p>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="why-us-card bg-light p-4 rounded-4 shadow-sm h-100">
                            <div class="icon-circle bg-success text-white mb-3 mx-auto">
                                <i class="fas fa-globe fa-lg"></i>
                            </div>
                            <h5 class="fw-semibold text-dark">Global Network</h5>
                            <p class="text-muted small">
                                Connect with learners and researchers across the world, sharing
                                knowledge globally.
                            </p>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="why-us-card bg-light p-4 rounded-4 shadow-sm h-100">
                            <div class="icon-circle bg-warning text-white mb-3 mx-auto">
                                <i class="fas fa-wallet fa-lg"></i>
                            </div>
                            <h5 class="fw-semibold text-dark">Earn & Learn</h5>
                            <p class="text-muted small">
                                Earn every time someone downloads your paper, turn your work into
                                income.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="testimonials-section py-5" data-aos="fade-up">
            <div class="container">
                <h2 class="text-center text-primary-emphasis fw-bold mb-5">What Our Users Say</h2>
                <div
                    id="testimonialCarousel"
                    class="carousel slide"
                    data-bs-ride="carousel"
                    data-bs-interval="2000"
                >
                    <div class="carousel-inner">
                        <div class="carousel-item active" v-if="testimonials.length">
                            <div class="testimonial-item mx-auto text-center px-3 px-md-5">
                                <blockquote class="blockquote fs-5 fst-italic">
                                    "{{ testimonials[0].message }}"
                                </blockquote>
                                <p class="fw-semibold mt-3">— {{ testimonials[0].name }}</p>
                            </div>
                        </div>
                        <div
                            class="carousel-item"
                            v-for="(testimonial, index) in testimonials.slice(1)"
                            :key="index + 1"
                        >
                            <div class="testimonial-item mx-auto text-center px-3 px-md-5">
                                <blockquote class="blockquote fs-5 fst-italic">
                                    "{{ testimonial.message }}"
                                </blockquote>
                                <p class="fw-semibold mt-3">— {{ testimonial.name }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Carousel Controls -->
                    <button
                        class="carousel-control-prev"
                        type="button"
                        data-bs-target="#testimonialCarousel"
                        data-bs-slide="prev"
                    >
                        <span class="carousel-control-prev-icon"></span>
                    </button>
                    <button
                        class="carousel-control-next"
                        type="button"
                        data-bs-target="#testimonialCarousel"
                        data-bs-slide="next"
                    >
                        <span class="carousel-control-next-icon"></span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Newsletter CTA -->
        <section class="newsletter text-center py-5" data-aos="zoom-in">
            <div class="container">
                <h2 class="fw-bold text-primary-emphasis mb-3">Stay in the Loop</h2>
                <p class="lead text-muted">
                    Subscribe for updates on new papers, features, and academic opportunities.
                </p>
                <form class="row justify-content-center mt-4">
                    <div class="col-md-6 mb-2 mb-md-0">
                        <input
                            type="email"
                            class="form-control form-control-lg newsletter-input"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-outline-primary">Subscribe</button>
                    </div>
                </form>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="cta-section text-center py-5" data-aos="slide-up">
            <div class="container">
                <h2 class="fw-bold text-primary-emphasis mb-3">
                    Start Your Journey with GradesHub
                </h2>
                <p class="text-muted mb-4">
                    Join a thriving academic community of contributors and learners.
                </p>
                <router-link to="/register" class="btn btn-outline-primary btn-lg px-4"
                    >Get Started</router-link
                >
            </div>
        </section>

        <!-- Get in Touch -->
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
                            <form @submit.prevent="submitForm">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Full Name</label>
                                    <input
                                        v-model="form.name"
                                        type="text"
                                        class="form-control"
                                        id="name"
                                        required
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email Address</label>
                                    <input
                                        v-model="form.email"
                                        type="email"
                                        class="form-control"
                                        id="email"
                                        required
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="message" class="form-label">Message</label>
                                    <textarea
                                        v-model="form.message"
                                        class="form-control"
                                        id="message"
                                        rows="5"
                                        required
                                    ></textarea>
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
        </section>
    </div>
    <Footer />
</template>

<script>
import Footer from './Footer.vue';
import Navbar from './Navbar.vue';
import { mapActions } from 'vuex';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

export default {
    name: 'HomePage',
    components: {
        Footer,
        Navbar,
        Swiper,
        SwiperSlide,
    },
    data() {
        return {
            latestPapers: [],
            popularCourses: [],
            popularCategories: [],
            testimonials: [
                { name: 'Alice', message: 'This platform helped me earn while sharing knowledge!' },
                { name: 'Bob', message: 'A must-have for students and researchers.' },
                {
                    name: 'Carlos',
                    message: 'Finally, a place to get quality research materials easily!',
                },
            ],
            topContributors: [
                {
                    name: 'Dr. Emily Rose',
                    avatar: 'https://i.pravatar.cc/100?img=10',
                    papers: 23,
                    downloads: 940,
                },
                {
                    name: 'Prof. Alan Green',
                    avatar: 'https://i.pravatar.cc/100?img=7',
                    papers: 15,
                    downloads: 870,
                },
                {
                    name: 'Jane Student',
                    avatar: 'https://i.pravatar.cc/100?img=5',
                    papers: 30,
                    downloads: 790,
                },
            ],
            form: {
                name: '',
                email: '',
                message: '',
            },
        };
    },

    async created() {
        await this.loadLatestPapers();
        await this.loadPopularCourses();
        await this.loadPopularCategories();
    },

    methods: {
        ...mapActions('papers', [
            'fetchAllPapers',
            'fetchPopularCourses',
            'fetchPopularCategories',
        ]),
        async loadLatestPapers() {
            try {
                const data = await this.fetchAllPapers();
                const sortedPapers = data.results.sort(
                    (a, b) => new Date(b.upload_date) - new Date(a.upload_date),
                );
                this.latestPapers = sortedPapers.slice(0, 6);
            } catch (error) {
                console.error('Error fetching latest papers:', error);
            }
        },

        async loadPopularCourses() {
            try {
                const data = await this.fetchPopularCourses();
                this.popularCourses = data.results;
            } catch (error) {
                console.error('Error fetching popular courses:', error);
            }
        },

        async loadPopularCategories() {
            try {
                const data = await this.fetchPopularCategories();
                this.popularCategories = data.results;
            } catch (error) {
                console.error('Error fetching popular courses:', error);
            }
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
    },
};
</script>

<style scoped>
/* How it works section*/
.step-card {
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}
.step-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.step-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Featured Paper Links */
.featured-papers {
    background: linear-gradient(to right, #ffffff, #f0f4ff);
}

.paper-card {
    border: none;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transition:
        transform 0.25s ease-in-out,
        box-shadow 0.25s ease-in-out;
}

.paper-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(33, 37, 41, 0.1);
}

/* Badges */
.badge.bg-primary {
    background-color: #ff6b6b !important;
}

/* Cards General */
.card {
    border-radius: 12px;
    border: none;
}

/* Popular Courses Carousel */
.popular-courses-section {
    background: linear-gradient(to right, #ffffff, #f0f4ff);
}

.course-card {
    border-radius: 16px;
    background: #ffffff;
    transition:
        transform 0.3s ease-in-out,
        box-shadow 0.3s ease-in-out;
}

.course-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.icon-circle {
    width: 60px;
    height: 60px;
    background-color: #0d6efd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Popular Categories Carousel */
.popular-categories-section {
    background: linear-gradient(to right, #f8f9fa, #eef1f7);
}

.category-card {
    border-radius: 16px;
    background: #ffffff;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}

.category-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.icon-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Top Contributors */
.top-contributors .card {
    background: linear-gradient(to right, #f8f9fa, #eef1f7);
    border: 1px solid #ddd;
    border-radius: 12px;
}

/* Why Us*/
.why-us-card {
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}
.why-us-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.icon-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Testimonials */
.testimonials-section {
    background-color: #f9fafc;
}

.testimonial-item {
    max-width: 720px;
}

.testimonial-item .avatar img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 3px solid #dee2e6;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.blockquote {
    color: #343a40;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: #4e54c8;
    border-radius: 50%;
    padding: 10px;
}

/* Newsletter Section */
.newsletter {
    background: linear-gradient(to right, #f8f9fa, #eef1f7);
}
.newsletter-input {
    border-radius: 30px;
    padding: 0.75rem 1.5rem;
    border: 1px solid #ced4da;
}

/* Call to Action */
.cta-section {
    background: linear-gradient(to right, #f8f9fa, #eef1f7);
}

/* Contact Form Section */
.contact-form-section {
    background-color: #f4f6fc;
}
.contact-form-section .card {
    border: none;
    background-color: #fff;
    border-radius: 16px;
}
.contact-form-section .form-control {
    border-radius: 12px;
    padding: 0.75rem 1rem;
}
.contact-form-section .btn-accent {
    color: #fff;
    border-radius: 30px;
}
.contact-form-section .btn-accent:hover {
    background-color: #3e44b1;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
