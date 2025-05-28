<template>
  <Navbar />
  <div class="container py-5">
    <h2 class="mb-4 text-primary">Explore Our Courses</h2>

    <!-- Search Input -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        @input="handleSearchInput"
        type="text"
        class="form-control"
        placeholder="Search courses..."
      />
    </div>

    <!-- Empty state -->
    <div v-if="courses.length === 0 && !isLoading" class="text-center text-muted my-5">
      <p>No courses found matching your search.</p>
    </div>

    <!-- Courses Grid -->
    <div class="row g-4" v-else>
      <div 
        v-for="course in courses" 
        :key="course.id" 
        class="col-md-4"
      >
        <div
          class="card h-100 shadow-sm border-0 rounded-4 cursor-pointer"
          @click="goToCoursePapers(course.id)"
        >
          <div class="card-body">
            <h5 class="card-title text-dark">{{ course.name }}</h5>
            <p v-if="course.paper_count > 0" class="card-text text-muted">
              {{ course.paper_count }} {{ course.paper_count === 1 ? 'paper' : 'papers' }}
            </p>
            <p v-else class="card-text text-muted">No papers available.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div 
      v-if="totalPages > 1"
      class="d-flex justify-content-center align-items-center gap-3 mt-4"
    >
      
      <button
        class="btn btn-outline-primary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <span class="fw-semibold text-primary">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="btn btn-outline-primary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/components/home/Navbar.vue';

export default {
  name: 'CoursesPage',
  components: { Navbar },

  data() {
    return {
      courses: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
    };
  },

  async created() {
    await this.loadCourses();
  },

  methods: {
    ...mapActions('papers', ['fetchCourses']),

    async loadCourses() {
      this.isLoading = true;
      try {
        const response = await this.fetchCourses({
          search: this.searchQuery,
          page: this.currentPage,
        });
        this.courses = response.results;
        const pageSize = 10;
        this.totalPages = Math.ceil(response.count / pageSize);
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        this.isLoading = false;
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadCourses();
      }
    },

    goToCoursePapers(courseId) {
      this.$router.push({ name: 'CoursePapers', params: { courseId } });
    },

    handleSearchInput() {
      this.currentPage = 1;
      this.loadCourses();
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
