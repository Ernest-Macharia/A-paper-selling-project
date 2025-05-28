<template>
  <Navbar />
  <div class="home">
    <!-- Hero Section -->
    <section class="hero text-center text-white d-flex align-items-center" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
      <div class="container">
        <h1 class="fade-in">Share & Discover Academic Papers</h1>
        <p class="lead fade-in">
          Upload, download, and earn from academic content with ease.
        </p>
        <div class="btn-container fade-in">
          <router-link to="/register" class="btn btn-primary btn-lg">Get Started</router-link>
          <router-link to="/login" class="btn btn-outline-light btn-lg ms-2">Login</router-link>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works text-center my-5" data-aos="zoom-in" data-aos-delay="200" data-aos-duration="1000">
      <div class="container">
        <h2>How It Works</h2>
        <div class="row">
          <div class="col-md-3">
            <i class="fas fa-user-graduate step-icon"></i>
            <h4>Sign Up</h4>
            <p>Create an account in seconds.</p>
          </div>
          <div class="col-md-3">
            <i class="fas fa-upload step-icon"></i>
            <h4>Upload Papers</h4>
            <p>Share your knowledge and earn.</p>
          </div>
          <div class="col-md-3">
            <i class="fas fa-download step-icon"></i>
            <h4>Download Papers</h4>
            <p>Access research materials anytime.</p>
          </div>
          <div class="col-md-3">
            <i class="fas fa-money-bill-wave step-icon"></i>
            <h4>Get Paid</h4>
            <p>Earn when others download your work.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Papers Section -->
    <section class="featured-papers bg-light py-5" data-aos="slide-left">
      <div class="container">
        <h2 class="text-center mb-4">Latest Papers</h2>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          <div class="col" v-for="(paper, index) in latestPapers" :key="index">
            <router-link :to="{ name: 'paper-details', params: { id: paper.id } }" class="paper-link card p-3 shadow-sm h-100 text-decoration-none">
              <h6 class="mb-1 text-primary fw-bold">{{ paper.title }}</h6>
              <small class="text-muted d-block">{{ paper.course.name }}</small>
            </router-link>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <router-link to="/papers" class="btn btn-outline-primary btn-sm">View All Papers</router-link>
      </div>
    </section>

    <!-- Popular Courses Section -->
    <section class="popular-courses py-5 bg-white" data-aos="slide-up" >
      <div class="container">
        <h2 class="text-center mb-4">Popular Courses</h2>
        <swiper
          :slides-per-view="3"
          :space-between="20"
          :breakpoints="{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }"
        >
          <swiper-slide v-for="(course, index) in popularCourses" :key="index">
            <div class="card shadow-sm p-3 text-center">
              <h5>{{ course.name }}</h5>
              <p class="text-muted">{{ course.paper_count }} papers</p>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <!-- Top Contributors Section -->
    <section class="top-contributors text-center bg-light py-5" data-aos="zoom-in-up" data-aos-delay="200" data-aos-duration="1000">
      <div class="container">
        <h2>Top Contributors</h2>
        <div class="row">
          <div class="col-md-4" v-for="(user, index) in topContributors" :key="index">
            <div class="card p-3 shadow-sm mb-3">
              <img :src="user.avatar" class="rounded-circle mb-2" width="80" height="80" />
              <h5>{{ user.name }}</h5>
              <p class="text-muted">{{ user.papers }} papers • {{ user.downloads }} downloads</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-us text-center py-5" data-aos="fade-right">
      <div class="container">
        <h2>Why Choose GradesHub?</h2>
        <div class="row">
          <div class="col-md-4">
            <i class="fas fa-bolt fa-2x text-primary mb-2"></i>
            <h5>Instant Access</h5>
            <p>Download papers immediately without complicated steps.</p>
          </div>
          <div class="col-md-4">
            <i class="fas fa-globe fa-2x text-primary mb-2"></i>
            <h5>Global Network</h5>
            <p>Access content from learners and researchers worldwide.</p>
          </div>
          <div class="col-md-4">
            <i class="fas fa-wallet fa-2x text-primary mb-2"></i>
            <h5>Earn & Learn</h5>
            <p>Contributors earn every time their paper is downloaded.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials text-center my-5" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
      <div class="container">
        <h2>What Our Users Say</h2>
        <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
          <div class="carousel-inner">
            <div 
              class="carousel-item active"
              v-if="testimonials.length"
            >
              <blockquote class="blockquote">
                "{{ testimonials[0].message }}"
              </blockquote>
              <p class="fw-bold">— {{ testimonials[0].name }}</p>
            </div>
            <div 
              class="carousel-item" 
              v-for="(testimonial, index) in testimonials.slice(1)" 
              :key="index + 1"
            >
              <blockquote class="blockquote">
                "{{ testimonial.message }}"
              </blockquote>
              <p class="fw-bold">— {{ testimonial.name }}</p>
            </div>
          </div>

          <button class="carousel-control-prev "  type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon "></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="newsletter text-center text-white py-5" data-aos="zoom-in">
      <div class="container">
        <h2>Stay Updated</h2>
        <p class="lead">Get notified about new papers, features, and opportunities.</p>
        <form class="row justify-content-center">
          <div class="col-md-6">
            <input type="email" class="form-control form-control-lg" placeholder="Enter your email" />
          </div>
          <div class="col-md-2 mt-2 mt-md-0">
            <button class="btn btn-primary btn-lg w-100">Subscribe</button>
          </div>
        </form>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta text-center bg-primary text-white py-5" data-aos="slide-up">
      <h2>Start Your Journey Today!</h2>
      <router-link to="/register" class="btn btn-light btn-lg">Sign Up</router-link>
    </section>

    <!-- Get in touch -->
    <section class="contact-form-section d-flex align-items-center justify-content-center" style="min-height: 100vh;" data-aos="fade-in-up">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <h2 class="text-center mb-4">Get in Touch</h2>
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input v-model="form.name" type="text" class="form-control" id="name" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" id="email" required />
              </div>
              <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea v-model="form.message" class="form-control" id="message" rows="4" required></textarea>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary px-4">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>

<script>
import Footer from "./Footer.vue";
import Navbar from "./Navbar.vue";
import { mapActions } from 'vuex';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

export default {
  name: "HomePage",
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
      testimonials: [
        { name: "Alice", message: "This platform helped me earn while sharing knowledge!" },
        { name: "Bob", message: "A must-have for students and researchers." },
        { name: "Carlos", message: "Finally, a place to get quality research materials easily!" },
      ],
      categories: [
        { name: "Mathematics", count: 48 },
        { name: "Physics", count: 35 },
        { name: "History", count: 29 },
        { name: "Economics", count: 18 },
      ],
      topContributors: [
        { name: "Dr. Emily Rose", avatar: "https://i.pravatar.cc/100?img=10", papers: 23, downloads: 940 },
        { name: "Prof. Alan Green", avatar: "https://i.pravatar.cc/100?img=7", papers: 15, downloads: 870 },
        { name: "Jane Student", avatar: "https://i.pravatar.cc/100?img=5", papers: 30, downloads: 790 },
      ],
      form: {
        name: '',
        email: '',
        message: ''
      }
    };
  },

  async created() {
    await this.loadLatestPapers();
    await this.loadPopularCourses();
  },

  methods: {
    ...mapActions('papers', ['fetchAllPapers', 'fetchPopularCourses']),
    async loadLatestPapers() {
      try {
        const data = await this.fetchAllPapers();
        const sortedPapers = data.results.sort(
          (a, b) => new Date(b.upload_date) - new Date(a.upload_date)
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
    }
  },
};
</script>

<style scoped>
/* Hero Section */
.hero {
  background-color: #e3f2fd;
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px 20px;
}

.hero h1, .hero p {
  color: #0d47a1;
  text-shadow: none;
}

.btn-primary {
  background-color: #4e54c8;
  border-color: #4e54c8;
}

.btn-outline-light {
  border-color: #ff6b6b;
  color: #ff6b6b;
}
.btn-outline-light:hover {
  background-color: #ff6b6b;
  color: #fff;
}

/* Steps Icons */
.step-icon {
  font-size: 40px;
  color: #4e54c8;
}

/* Featured Paper Links */
.paper-link {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.paper-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(78, 84, 200, 0.2);
}

/* Badges */
.badge.bg-secondary {
  background-color: #ff6b6b !important;
}

/* Cards General */
.card {
  border-radius: 12px;
  border: none;
}

/* Popular Courses Carousel */
.swiper-slide .card {
  background: #f4f6fc;
  border-radius: 12px;
  transition: transform 0.3s ease;
}
.swiper-slide .card:hover {
  transform: translateY(-5px);
}

/* Top Contributors */
.top-contributors .card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
}

/* Why Us Icons */
.why-us i {
  color: #4e54c8;
}

/* Testimonials */
.testimonials blockquote {
  font-style: italic;
  color: #4e54c8;
}
.testimonials .carousel-item.active blockquote {
  transform: scale(1.05);
  transition: transform 0.5s ease;
}

.carousel-inner {
  min-height: 200px;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: black;
  border-radius: 50%;
}


/* Newsletter Section */
.newsletter {
  background-color: #4e54c8;
}
.newsletter input {
  border-radius: 30px;
}
.newsletter .btn-primary {
  background: #ff6b6b;
  border: none;
}

/* CTA Section */
.cta {
  background: linear-gradient(45deg, #4e54c8, #8f94fb);
}

/* Contact Form */
.contact-form-section {
  background-color: #f4f6fc;
}
.contact-form-section .form-control {
  border-radius: 8px;
}
.contact-form-section .btn-primary {
  background-color: #4e54c8;
  border: none;
}


@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
