<template>
    <Navbar />
  
    <div class="container py-5">
      <h2 class="mb-4 text-success">
        Papers for Course: {{ courseName || '...' }}
      </h2>
  
      <!-- Search Input -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          @input="fetchCoursePapers"
          type="text"
          class="form-control"
          placeholder="Search papers..."
        />
      </div>
  
      <!-- Papers List -->
      <div class="row g-4">
        <div
          v-for="paper in papers"
          :key="paper.id"
          class="col-md-6"
        >
          <div class="card shadow-sm border-0 rounded-4 h-100">
            <div class="card-body">
              <h5 class="card-title">{{ paper.title }}</h5>
              <p class="card-text text-muted">{{ paper.description }}</p>
              <p class="card-text">
                <small class="text-muted">Price: ₱{{ paper.price }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- No results -->
      <div v-if="papers.length === 0" class="text-center mt-5">
        <p class="text-muted">No papers found for this course.</p>
      </div>
  
      <!-- Pagination -->
      <nav class="mt-5" v-if="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">
              Previous
            </button>
          </li>
          <li class="page-item disabled">
            <span class="page-link">Page {{ currentPage }} of {{ totalPages }}</span>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/home/Navbar.vue';
  import api from '@/api'; // assuming you use axios instance here
  
  export default {
    name: 'CoursePapers',
    components: { Navbar },
  
    data() {
      return {
        papers: [],
        courseName: '',
        searchQuery: '',
        currentPage: 1,
        totalPages: 1,
      };
    },
  
    async created() {
      await this.fetchCourseInfo();
      await this.fetchCoursePapers();
    },
  
    methods: {
      async fetchCourseInfo() {
        const courseId = this.$route.params.courseId;
        try {
          const res = await api.get(`/exampapers/courses/${courseId}/`);
          this.courseName = res.data.name;
        } catch (error) {
          console.error('Failed to fetch course info:', error);
        }
      },
  
      async fetchCoursePapers() {
        const courseId = this.$route.params.courseId;
        try {
          const res = await api.get('/exampapers/papers/', {
            params: {
              course: courseId,
              search: this.searchQuery,
              page: this.currentPage,
            },
          });
          this.papers = res.data.results;
          this.totalPages = Math.ceil(res.data.count / 10); // assuming 10 per page
        } catch (err) {
          console.error('Failed to load papers:', err);
        }
      },
  
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.fetchCoursePapers();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .card {
    cursor: default;
  }
  </style>
  