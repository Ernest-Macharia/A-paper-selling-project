<template>
  <Navbar />
  <div class="container py-5">
    <h2 class="mb-4 text-primary">Explore Our Courses</h2>

    <!-- Search Input -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          v-model="searchQuery"
          @input="handleSearchInput"
          type="text"
          class="form-control"
          placeholder="Search courses..."
        />
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="courses.length === 0 && !isLoading" class="text-center text-muted my-5">
      <p>No courses found matching your search.</p>
    </div>

    <!-- Courses Table -->
    <div v-else>
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Course Name</th>
            <th class="text-center">Papers</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="course in courses"
            :key="course.id"
            class="cursor-pointer"
          >
            <td>
            <router-link
              :to="`/courses/${course.id}`"
              class="text-decoration-none text-primary fw-semibold"
            >
                {{ course.name }}
              </router-link>
            </td>
            <td class="text-center">
              <span v-if="course.paper_count > 0">
                {{ course.paper_count }} {{ course.paper_count === 1 ? 'paper' : 'papers' }}
              </span>
              <span v-else class="text-muted">No papers</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">« Prev</button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">Next »</button>
        </li>
      </ul>
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

.pagination .page-link {
  color: #007bff;
  border: none;
  background-color: transparent;
}
.pagination .page-link:hover {
  background-color: #e9f5ff;
}
.pagination .active .page-link {
  background-color: #007bff;
  color: white;
  border-radius: 0.25rem;
}

.table td,
.table th {
  vertical-align: middle;
}
</style>
