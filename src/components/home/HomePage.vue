<template>
    <Navbar />

    <div class="home-page">
        <!-- Hero Section -->
        <section class="hero-section position-relative overflow-hidden">
            <div class="hero-overlay"></div>
            <div class="container position-relative z-index-1">
                <div class="row min-vh-80 align-items-center py-8">
                    <div class="col-lg-8 mx-auto text-center">
                        <h1 class="display-3 fw-bold text-white mb-4">
                            Elevate Your Academic Journey
                        </h1>
                        <p class="lead text-white-80 mb-5">
                            Access premium academic resources or monetize your work with our global
                            community of scholars and researchers.
                        </p>
                        <div class="d-flex gap-3 justify-content-center">
                            <router-link
                                v-if="!isAuthenticated"
                                to="/register"
                                class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow"
                            >
                                Start Selling Papers
                            </router-link>
                            <router-link
                                v-else
                                to="/dashboard/upload-file"
                                class="btn btn-success btn-lg px-5 py-3 rounded-pill shadow"
                            >
                                Upload New Paper
                            </router-link>
                            <router-link
                                to="/papers"
                                class="btn btn-dark btn-lg px-5 py-3 rounded-pill"
                            >
                                Browse Papers
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-wave">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        fill="currentColor"
                    ></path>
                </svg>
            </div>
        </section>

        <!-- Stats Bar -->
        <div class="stats-bar bg-white shadow-sm py-4">
            <div class="container">
                <div class="row g-4 text-center">
                    <div class="col-md-3">
                        <div class="stat-item">
                            <div class="stat-value display-5 fw-bold text-primary">10,000+</div>
                            <div class="stat-label text-muted">Academic Papers</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item">
                            <div class="stat-value display-5 fw-bold text-success">5,000+</div>
                            <div class="stat-label text-muted">Active Contributors</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item">
                            <div class="stat-value display-5 fw-bold text-warning">$250K+</div>
                            <div class="stat-label text-muted">Earned by Users</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item">
                            <div class="stat-value display-5 fw-bold text-info">100+</div>
                            <div class="stat-label text-muted">Universities</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- How It Works -->
        <section class="how-it-works py-8 bg-light">
            <div class="container">
                <div class="text-center mb-7">
                    <h2 class="display-5 fw-bold mb-3">How GradesWorld Works</h2>
                    <p class="lead text-muted mx-auto" style="max-width: 700px">
                        A simple three-step process to share knowledge and earn rewards
                    </p>
                </div>

                <div class="row g-5">
                    <div class="col-lg-4">
                        <div class="step-card text-center p-5 h-100">
                            <div
                                class="step-number bg-primary bg-opacity-10 text-primary rounded-circle mb-4 mx-auto"
                            >
                                1
                            </div>
                            <div class="step-icon display-3 text-primary mb-4">
                                <i class="bi bi-person-plus"></i>
                            </div>
                            <h3 class="h4 mb-3">Create Your Account</h3>
                            <p class="text-muted mb-0">
                                Sign up in seconds to join our academic community. Start as a
                                contributor or learner.
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="step-card text-center p-5 h-100">
                            <div
                                class="step-number bg-success bg-opacity-10 text-success rounded-circle mb-4 mx-auto"
                            >
                                2
                            </div>
                            <div class="step-icon display-3 text-success mb-4">
                                <i class="bi bi-cloud-arrow-up"></i>
                            </div>
                            <h3 class="h4 mb-3">Upload Your Papers</h3>
                            <p class="text-muted mb-0">
                                Share your academic work with proper categorization. Set your price
                                or offer for free.
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="step-card text-center p-5 h-100">
                            <div
                                class="step-number bg-warning bg-opacity-10 text-warning rounded-circle mb-4 mx-auto"
                            >
                                3
                            </div>
                            <div class="step-icon display-3 text-warning mb-4">
                                <i class="bi bi-cash-coin"></i>
                            </div>
                            <h3 class="h4 mb-3">Earn & Learn</h3>
                            <p class="text-muted mb-0">
                                Get paid when others download your work. Access premium content to
                                boost your studies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Papers -->

        <section class="featured-papers py-8">
            <div class="container">
                <div class="d-flex justify-content-between align-items-end mb-6">
                    <div>
                        <h2 class="display-5 fw-bold mb-2">Featured Academic Papers</h2>
                        <p class="text-muted">Recently added premium resources</p>
                    </div>
                    <router-link to="/papers" class="btn btn-outline-primary">
                        View All Papers <i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                </div>

                <div class="row g-4">
                    <div
                        class="col-md-6 col-lg-4 col-xl-3"
                        v-for="(paper, index) in latestPapers"
                        :key="index"
                    >
                        <div class="paper-card card border-0 shadow-sm h-100 overflow-hidden">
                            <div
                                class="card-img-top position-relative overflow-hidden"
                                style="height: 160px; background-color: #f8f9fa"
                            >
                                <div class="position-absolute w-100" style="top: 20%">
                                    <div
                                        class="bg-white mx-auto"
                                        style="height: 8px; width: 90%"
                                    ></div>
                                    <div
                                        class="bg-white mx-auto mt-2"
                                        style="height: 8px; width: 95%"
                                    ></div>
                                    <div
                                        class="bg-white mx-auto mt-2"
                                        style="height: 8px; width: 85%"
                                    ></div>
                                    <div
                                        class="bg-white mx-auto mt-2"
                                        style="height: 8px; width: 92%"
                                    ></div>
                                </div>
                                <!-- <div class="position-absolute bottom-0 start-0 end-0 text-center pb-2">
                                    <span class="badge bg-primary">PDF</span>
                                </div> -->
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <span
                                        class="badge bg-primary bg-opacity-10 text-primary rounded-pill"
                                    >
                                        {{ paper.course?.name || 'General' }}
                                    </span>
                                    <span class="text-warning small fw-bold">
                                        {{ paper.price > 0 ? `$${paper.price}` : 'FREE' }}
                                    </span>
                                </div>
                                <h5 class="card-title mb-2">{{ paper.title }}</h5>
                                <p class="text-muted small mb-3">
                                    <i class="bi bi-tag me-1"></i>
                                    {{ paper.category?.name || 'Uncategorized' }}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-muted small">
                                        <i class="bi bi-calendar me-1"></i>
                                        {{ formatDate(paper.upload_date) }}
                                    </span>
                                    <span class="text-muted small">
                                        <i class="bi bi-download me-1"></i>
                                        {{ paper.download_count || 0 }}
                                    </span>
                                </div>
                            </div>
                            <router-link
                                :to="{ name: 'paper-details', params: { id: paper.id } }"
                                class="stretched-link"
                            ></router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Popular Courses -->
        <section class="popular-courses py-8 bg-light">
            <div class="container">
                <div class="text-center mb-7">
                    <h2 class="display-5 fw-bold mb-3">Browse by Popular Courses</h2>
                    <p class="lead text-muted mx-auto" style="max-width: 700px">
                        Discover academic resources tailored to your field of study
                    </p>
                </div>

                <div class="row g-4">
                    <div
                        class="col-md-6 col-lg-4 col-xl-3"
                        v-for="(course, index) in popularCourses.slice(0, 8)"
                        :key="index"
                    >
                        <div class="course-card card border-0 shadow-sm h-100 text-center">
                            <div class="card-body p-5">
                                <div
                                    class="course-icon bg-primary bg-opacity-10 text-primary rounded-circle mb-4 mx-auto p-4"
                                >
                                    <i class="bi bi-journal-richtext fs-3"></i>
                                </div>
                                <h5 class="card-title mb-2">{{ course.name }}</h5>
                                <p class="text-muted small mb-3">
                                    {{ course.paper_count || 0 }} papers available
                                </p>
                                <router-link
                                    :to="`/courses/${course.slug || course.id}`"
                                    class="btn btn-sm btn-outline-primary stretched-link"
                                >
                                    View Papers
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-6">
                    <router-link to="/courses" class="btn btn-primary px-5 py-3">
                        Explore All Courses <i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Popular Categories -->
        <section class="popular-categories py-8 bg-white">
            <div class="container">
                <div class="text-center mb-7">
                    <h2 class="display-5 fw-bold mb-3">Browse by Popular Categories</h2>
                    <p class="lead text-muted mx-auto" style="max-width: 700px">
                        Explore academic resources organized by subject categories
                    </p>
                </div>

                <div class="row g-4">
                    <div
                        class="col-md-6 col-lg-4 col-xl-3"
                        v-for="(category, index) in popularCategories.slice(0, 8)"
                        :key="index"
                    >
                        <div class="category-card card border-0 shadow-sm h-100 text-center">
                            <div class="card-body p-5">
                                <div
                                    class="category-icon bg-info bg-opacity-10 text-info rounded-circle mb-4 mx-auto p-4"
                                >
                                    <i class="bi bi-collection fs-3"></i>
                                </div>
                                <h5 class="card-title mb-2">{{ category.name }}</h5>
                                <p class="text-muted small mb-3">
                                    {{ category.paper_count || 0 }} papers available
                                </p>
                                <router-link
                                    :to="`/categories/${category.slug || category.id}`"
                                    class="btn btn-sm btn-outline-info stretched-link"
                                >
                                    View Papers
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-6">
                    <router-link to="/categories" class="btn btn-info px-5 py-3 text-white">
                        Explore All Categories <i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Popular Universities -->
        <section class="popular-universities py-8 bg-light">
            <div class="container">
                <div class="text-center mb-7">
                    <h2 class="display-5 fw-bold mb-3">Browse by Popular Universities</h2>
                    <p class="lead text-muted mx-auto" style="max-width: 700px">
                        Discover academic resources from top institutions worldwide
                    </p>
                </div>

                <div class="row g-4">
                    <div
                        class="col-md-6 col-lg-4 col-xl-3"
                        v-for="(school, index) in popularSchools.slice(0, 8)"
                        :key="index"
                    >
                        <div class="school-card card border-0 shadow-sm h-100 text-center">
                            <div class="card-body p-5">
                                <div
                                    class="school-icon bg-warning bg-opacity-10 text-warning rounded-circle mb-4 mx-auto p-4"
                                >
                                    <i class="bi bi-building fs-3"></i>
                                </div>
                                <h5 class="card-title mb-2">{{ school.name }}</h5>
                                <p class="text-muted small mb-3">
                                    {{ school.paper_count || 0 }} papers available
                                </p>
                                <router-link
                                    :to="`/schools/${school.id}`"
                                    class="btn btn-sm btn-outline-warning stretched-link"
                                >
                                    View Papers
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-6">
                    <router-link to="/schools" class="btn btn-warning px-5 py-3 text-white">
                        Explore All Schools <i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Testimonials -->
        <section class="testimonials py-8 bg-white">
            <div class="container">
                <div class="text-center mb-7">
                    <h2 class="display-5 fw-bold mb-3">Trusted by Academics Worldwide</h2>
                    <p class="lead text-muted mx-auto" style="max-width: 700px">
                        What our community members say about GradesWorld
                    </p>
                </div>

                <div class="row g-4">
                    <div class="col-md-4" v-for="(testimonial, index) in testimonials" :key="index">
                        <div class="testimonial-card card border-0 shadow-sm h-100">
                            <div class="card-body p-5">
                                <div class="d-flex align-items-center mb-4">
                                    <img
                                        :src="`https://i.pravatar.cc/100?img=${index + 3}`"
                                        class="rounded-circle me-3"
                                        width="60"
                                        height="60"
                                        alt="User"
                                    />
                                    <div>
                                        <h6 class="mb-0">{{ testimonial.name }}</h6>
                                        <span class="text-muted small">Academic Contributor</span>
                                    </div>
                                </div>
                                <p class="mb-0">
                                    <i
                                        class="bi bi-quote text-primary opacity-25 fs-1 float-start me-2"
                                    ></i>
                                    {{ testimonial.message }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section py-8 bg-primary text-white">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-8 mb-5 mb-lg-0">
                        <h2 class="display-5 fw-bold mb-3">Ready to Share Your Knowledge?</h2>
                        <p class="lead mb-0 opacity-75">
                            Join thousands of academics who are already earning from their research
                            and study materials.
                        </p>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <router-link
                            v-if="!isAuthenticated"
                            to="/register"
                            class="btn btn-light btn-lg px-5 py-3 rounded-pill shadow"
                        >
                            Get Started Now
                        </router-link>
                        <router-link
                            v-else
                            to="/dashboard/upload-file"
                            class="btn btn-light btn-lg px-5 py-3 rounded-pill shadow"
                        >
                            Upload Your Paper
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="contact-section py-8 bg-white">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="text-center mb-7">
                            <h2 class="display-5 fw-bold mb-3">Get In Touch</h2>
                            <p class="lead text-muted mx-auto" style="max-width: 700px">
                                Have questions or need support? Our team is here to help you with
                                any inquiries.
                            </p>
                        </div>

                        <div class="row g-5 align-items-center">
                            <div class="col-lg-5">
                                <div class="pe-lg-5">
                                    <h3 class="h4 mb-4">Contact Information</h3>
                                    <ul class="list-unstyled">
                                        <!-- <li class="mb-3">
                                            <div class="d-flex">
                                                <div class="me-3 text-primary">
                                                    <i class="bi bi-geo-alt fs-4"></i>
                                                </div>
                                                <div>
                                                    <h5 class="h6 mb-0">Our Location</h5>
                                                    <p class="text-muted small">123 Academic Street, Suite 100<br>Cambridge, MA 02138</p>
                                                </div>
                                            </div>
                                        </li> -->
                                        <li class="mb-3">
                                            <div class="d-flex">
                                                <div class="me-3 text-primary">
                                                    <i class="bi bi-envelope fs-4"></i>
                                                </div>
                                                <div>
                                                    <h5 class="h6 mb-0">Email Us</h5>
                                                    <p class="text-muted small">
                                                        support@gradesworld.com<br />contact@gradesworld.com<br />scholar@gradesworld.com
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <!-- <li class="mb-3">
                                            <div class="d-flex">
                                                <div class="me-3 text-primary">
                                                    <i class="bi bi-telephone fs-4"></i>
                                                </div>
                                                <div>
                                                    <h5 class="h6 mb-0">Call Us</h5>
                                                    <p class="text-muted small">
                                                        +1 (617) 555-0123<br />Mon-Fri, 9am-5pm EST
                                                    </p>
                                                </div>
                                            </div>
                                        </li> -->
                                    </ul>

                                    <div class="mt-5">
                                        <h4 class="h5 mb-3">Follow Us</h4>
                                        <div class="d-flex gap-3">
                                            <a href="#" class="text-primary">
                                                <i class="bi bi-twitter fs-4"></i>
                                            </a>
                                            <a href="#" class="text-primary">
                                                <i class="bi bi-facebook fs-4"></i>
                                            </a>
                                            <a href="#" class="text-primary">
                                                <i class="bi bi-linkedin fs-4"></i>
                                            </a>
                                            <a href="#" class="text-primary">
                                                <i class="bi bi-instagram fs-4"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-7">
                                <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
                                    <div class="card-body p-4 p-md-5">
                                        <ContactForm />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ContactForm from '@/components/views/ContactForm.vue';
import Footer from './Footer.vue';
import Navbar from './Navbar.vue';
import { toast } from 'vue3-toastify';

export default {
    name: 'HomePage',
    components: {
        Footer,
        Navbar,
        ContactForm,
    },
    data() {
        return {
            latestPapers: [],
            popularCourses: [],
            popularCategories: [],
            popularSchools: [],
            subscribeEmail: '',
            subscribeError: '',
            testimonials: [
                {
                    name: 'Dr. Sarah Johnson',
                    message:
                        'GradesWorld has transformed how I share my research. I earn passive income while helping students worldwide.',
                },
                {
                    name: 'Michael Chen',
                    message:
                        'As a graduate student, the quality papers I found here saved me countless hours of research. Worth every penny!',
                },
                {
                    name: 'Prof. David Wilson',
                    message:
                        'Finally a platform that properly values academic work. My papers earn more here than through traditional publishing.',
                },
            ],
        };
    },
    computed: {
        ...mapGetters('authentication', ['isAuthenticated']),
    },
    async created() {
        await this.loadLatestPapers();
        await this.loadPopularCourses();
        await this.loadPopularCategories();
        await this.loadPopularSchools();
    },
    methods: {
        ...mapActions('papers', [
            'fetchLatestPapers',
            'fetchPopularCourses',
            'fetchPopularCategories',
            'fetchPopularSchools',
        ]),
        ...mapActions('communications', ['sendContactMessage', 'subscribeToNewsletter']),

        async loadLatestPapers() {
            try {
                const response = await this.fetchLatestPapers();
                const papers =
                    response.results || response.data?.results || response.data || response || [];

                if (!Array.isArray(papers)) {
                    console.error('Invalid papers data format:', papers);
                    this.latestPapers = [];
                    return;
                }

                // Sort papers by upload date (newest first)
                const sortedPapers = [...papers].sort(
                    (a, b) => new Date(b.upload_date) - new Date(a.upload_date),
                );

                this.latestPapers = sortedPapers.slice(0, 8);
            } catch (error) {
                console.error('Error fetching latest papers:', error);
                this.latestPapers = [];
                toast.error('Failed to load latest papers. Please try again later.');
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

        async loadPopularSchools() {
            try {
                const data = await this.fetchPopularSchools();
                this.popularSchools = data.results;
            } catch (error) {
                console.error('Error fetching popular schools:', error);
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

        validateSubscriptionEmail() {
            this.subscribeError = '';

            if (!this.subscribeEmail.trim()) {
                this.subscribeError = 'Email is required.';
                return false;
            } else if (!/\S+@\S+\.\S+/.test(this.subscribeEmail)) {
                this.subscribeError = 'Enter a valid email address.';
                return false;
            }

            return true;
        },

        async submitSubscription() {
            if (!this.validateSubscriptionEmail()) return;

            try {
                await this.subscribeToNewsletter({ email: this.subscribeEmail });
                toast.success('Subscribed successfully!');
                this.subscribeEmail = '';
            } catch (err) {
                const errors = err.response?.data;
                if (errors?.email) {
                    this.subscribeError = errors.email[0];
                } else {
                    toast.error(errors?.detail || 'Failed to subscribe.');
                }
            }
        },

        clearSubscriptionError() {
            this.subscribeError = '';
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
.home-page {
    overflow-x: hidden;
}

/* Hero Section */
.hero-section {
    position: relative;
    background-image: url('/images/background.jpg');
    color: white;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed; /* Optional: creates parallax effect */
    min-height: 100vh; /* Ensures full viewport height */
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
    z-index: 0;
}

.hero-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    color: white;
}

.hero-wave svg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Stats Bar */
.stats-bar {
    position: relative;
    margin-top: -50px;
    z-index: 10;
    border-radius: 12px;
}

.stat-item {
    padding: 1rem;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-item:last-child {
    border-right: none;
}

/* How It Works */
.step-card {
    background: white;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.step-card:hover {
    transform: translateY(-10px);
    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.step-number {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
}

/* Featured Papers */
.paper-card {
    transition: all 0.3s ease;
    border-radius: 12px;
    overflow: hidden;
}

.paper-card:hover {
    transform: translateY(-5px);
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
/* Popular Courses */
.course-card {
    transition: all 0.3s ease;
    border-radius: 12px;
}

.course-card:hover {
    transform: translateY(-5px);
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.course-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Popular Categories & Universities */
.category-card,
.school-card {
    transition: all 0.3s ease;
    border-radius: 12px;
}

.category-card:hover,
.school-card:hover {
    transform: translateY(-5px);
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.category-icon,
.school-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Testimonials */
.testimonial-card {
    transition: all 0.3s ease;
    border-radius: 12px;
}

.testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* CTA Section */
.cta-section {
    background: linear-gradient(135deg, #4e54c8, #8f94fb);
    position: relative;
    overflow: hidden;
}

.cta-section::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.cta-section::after {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

/* Utility Classes */
.z-index-1 {
    z-index: 1;
}

.min-vh-80 {
    min-height: 80vh;
}

.py-8 {
    padding-top: 6rem;
    padding-bottom: 6rem;
}

.mb-6 {
    margin-bottom: 4rem;
}

.mb-7 {
    margin-bottom: 5rem;
}

.text-white-80 {
    color: rgba(255, 255, 255, 0.8);
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
    .hero-section {
        padding-top: 4rem;
        padding-bottom: 6rem;
    }

    .stat-item {
        border-right: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        padding: 1.5rem 0;
    }

    .stat-item:last-child {
        border-bottom: none;
    }

    .stats-bar {
        margin-top: -30px;
    }

    .display-3 {
        font-size: 2.5rem;
    }

    .py-8 {
        padding-top: 4rem;
        padding-bottom: 4rem;
    }
}
</style>
