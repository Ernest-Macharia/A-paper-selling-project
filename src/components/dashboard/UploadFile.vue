<template>
  <div class="container py-5">
    <h2 class="mb-4 text-primary-emphasis">Upload a New Paper</h2>

    <form @submit.prevent="handleUpload" class="p-4 shadow-sm bg-white rounded">
      <!-- Title Input -->
      <div class="mb-3">
        <label class="form-label">Title <span class="text-danger">*</span></label>
        <input
          v-model="paper.title"
          type="text"
          class="form-control"
          :class="{'is-invalid': submitted && !paper.title}"
          :disabled="isLoading"
        />
        <div class="invalid-feedback">Title is required.</div>
      </div>

      <!-- Description Input -->
      <div class="mb-3">
        <label class="form-label">Description <span class="text-danger">*</span></label>
        <textarea
          v-model="paper.description"
          class="form-control"
          :class="{'is-invalid': submitted && !paper.description}"
          :disabled="isLoading"
        ></textarea>
        <div class="invalid-feedback">Description is required.</div>
      </div>

      <!-- Price Input -->
      <div class="mb-3">
        <label class="form-label">Price <span class="text-danger">*</span></label>
        <div class="input-group">
          <button
            type="button"
            class="btn btn-outline-danger"
            @click="decreasePrice"
            :disabled="isLoading"
          >
            <i class="bi bi-dash-circle"></i>
          </button>
          <input
            v-model.number="paper.price"
            type="number"
            min="0"
            step="0.5"
            class="form-control text-center"
            :class="{'is-invalid': submitted && (paper.price === '' || paper.price < 0)}"
            :disabled="isLoading"
          />
          <button
            type="button"
            class="btn btn-outline-success"
            @click="increasePrice"
            :disabled="isLoading"
          >
            <i class="bi bi-plus-circle"></i>
          </button>
        </div>
        <div class="invalid-feedback d-block" v-if="submitted && (paper.price === '' || paper.price < 0)">
          Valid price is required.
        </div>
      </div>

      <!-- Category Dropdown -->
      <div class="mb-3">
        <label class="form-label">Category <span class="text-danger">*</span></label>
        <select
          v-model="paper.category"
          class="form-select"
          :class="{'is-invalid': submitted && !paper.category}"
          :disabled="isLoading"
        >
          <option value="" disabled>Select Category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <div class="invalid-feedback">Please select a category.</div>
      </div>

      <!-- Course Dropdown -->
      <div class="mb-3">
        <label class="form-label">Course <span class="text-danger">*</span></label>
        <select
          v-model="paper.course"
          class="form-select"
          :class="{'is-invalid': submitted && !paper.course}"
          :disabled="isLoading"
        >
          <option value="" disabled>Select Course</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.name }}
          </option>
        </select>
        <div class="invalid-feedback">Please select a course.</div>
      </div>

      <!-- School Dropdown -->
      <div class="mb-3">
        <label class="form-label">School<span class="text-danger">*</span></label>
        <select
          v-model="paper.school"
          class="form-select"
          :class="{'is-invalid': submitted && !paper.school}"
          :disabled="isLoading"
        >
          <option value="" disabled>Select University or Colleague</option>
          <option v-for="school in schools" :key="school.id" :value="school.id">
            {{ school.name }}
          </option>
        </select>
        <div class="invalid-feedback">Please select a school.</div>
      </div>

      <!-- File Input with Drag-and-Drop -->
      <div
        class="mb-3"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <label class="form-label">Upload File <span class="text-danger">*</span></label>

        <div
          class="drop-zone text-center p-5 rounded border border-2"
          :class="{
            'border-primary bg-light-blue': isDragging,
            'border-secondary bg-white': !isDragging,
            'is-invalid': submitted && !paper.file
          }"
        >
          <div v-if="!paper.file">
            <p class="fs-5 mb-1">📁 Drag & Drop your file here</p>
            <p class="text-muted">or click below to browse</p>
            <button
              type="button"
              class="btn btn-outline-primary mt-2"
              @click="$refs.fileInput.click()"
              :disabled="isLoading"
            >
              Browse Files
            </button>
          </div>

          <div v-else class="uploaded-file d-flex align-items-center justify-content-center gap-3">
            <div class="file-name text-truncate" style="max-width: 300px;">
              <i :class="`bi ${fileIconClass} me-2`" :title="paper.file.type || 'File'"></i>
              {{ paper.file.name }}
            </div>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="removeFile"
              :disabled="isLoading"
              title="Remove File"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>

          <input
            type="file"
            class="d-none"
            ref="fileInput"
            @change="handleFile"
            :disabled="isLoading"
          />
        </div>

        <div class="invalid-feedback d-block" v-if="submitted && !paper.file">
          Please upload a file.
        </div>
      </div>

      <!-- Submit Button -->
      <div class="d-flex justify-content-center mt-4">
        <button
          type="submit"
          class="btn btn-primary px-4 py-2"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>📤 Upload</span>
        </button>
      </div>
    </form>

    <!-- Success Modal -->
    <UploadSuccessModal
      :visible="successVisible"
      @close="successVisible = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import UploadSuccessModal from '@/components/dashboard/UploadSuccessModal.vue';

export default {
  name: 'UploadPaper',
  components: { UploadSuccessModal },
  data() {
    return {
      paper: {
        title: '',
        description: '',
        price: '',
        file: null,
        category: '',
        course: '',
        school: '',
      },
      categories: [],
      courses: [],
      schools: [],
      isLoading: false,
      successVisible: false,
      submitted: false,
      isDragging: false,
    };
  },

  computed: {
    fileIconClass() {
      if (!this.paper.file) return 'bi-file-earmark-text-fill';

      const name = this.paper.file.name.toLowerCase();
      if (name.endsWith('.pdf')) return 'bi-file-earmark-pdf-fill text-danger';
      if (name.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)) return 'bi-file-image-fill text-success';
      if (name.match(/\.(doc|docx)$/)) return 'bi-file-earmark-word-fill text-primary';
      if (name.match(/\.(xls|xlsx)$/)) return 'bi-file-earmark-excel-fill text-success';
      if (name.match(/\.(ppt|pptx)$/)) return 'bi-file-earmark-ppt-fill text-warning';
      if (name.match(/\.(zip|rar|7z)$/)) return 'bi-file-earmark-zip-fill text-secondary';

      return 'bi-file-earmark-fill text-muted'; // fallback icon
    }
  },

  async created() {
    await this.loadCategories();
    await this.loadCourses();
    await this.loadSchools();
  },

  methods: {
    ...mapActions('papers', ['fetchCategories', 'fetchCourses', 'fetchSchools', 'uploadPaper']),

    handleFile(event) {
      this.paper.file = event.target.files[0];
      this.isDragging = false;
    },

    handleDrop(event) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        this.paper.file = droppedFile;
      }
      this.isDragging = false;
    },

    removeFile() {
      this.paper.file = null;
      this.$refs.fileInput.value = '';
      this.isDragging = false;
    },

    async handleUpload() {
      this.submitted = true;

      if (!this.isValid()) {
        return;
      }

      this.isLoading = true;
      const formData = new FormData();
      formData.append('title', this.paper.title);
      formData.append('description', this.paper.description);
      formData.append('price', this.paper.price);
      formData.append('category', this.paper.category);
      formData.append('course', this.paper.course);
      formData.append('school', this.paper.school);
      if (this.paper.file) formData.append('file', this.paper.file);

      try {
        await this.uploadPaper(formData);
        this.resetForm();
        this.successVisible = true;
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        this.isLoading = false;
      }
    },

    isValid() {
      return (
        this.paper.title &&
        this.paper.description &&
        this.paper.price !== '' && this.paper.price >= 0 &&
        this.paper.category &&
        this.paper.course &&
        this.paper.school &&
        this.paper.file
      );
    },

    resetForm() {
      this.submitted = false;
      this.paper = {
        title: '',
        description: '',
        price: '',
        file: null,
        category: '',
        course: '',
        school: ''
      };
    },

    async loadCategories() {
      try {
        const data = await this.fetchCategories();
        this.categories = data.results;
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    },

    async loadCourses() {
      try {
        const data = await this.fetchCourses();
        this.courses = data.results;
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    },

    async loadSchools() {
      try {
        const data = await this.fetchSchools();
        this.schools = data.results;
      } catch (err) {
        console.error('Error loading schools:', err);
      }
    },

    increasePrice() {
      if (this.paper.price === '' || this.paper.price === null) {
        this.paper.price = 0.5;
      } else {
        this.paper.price = parseFloat((this.paper.price + 0.5).toFixed(2));
      }
    },

    decreasePrice() {
      if (this.paper.price === '' || this.paper.price === null || this.paper.price <= 0) {
        this.paper.price = 0;
      } else {
        this.paper.price = parseFloat((this.paper.price - 0.5).toFixed(2));
      }
    },
  },
};
</script>

<style scoped>
form {
  background: #fdfdfd;
  border: 1px solid #eaeaea;
  border-radius: 8px;
}
h2 {
  color: #343a40;
}
label {
  font-weight: 500;
}
button:disabled {
  opacity: 0.7;
}
.drop-zone {
  transition: all 0.3s ease;
  border-style: dashed;
  background-color: #fdfdfd;
}
.bg-light-blue {
  background-color: #e6f0ff !important;
}

.uploaded-file {
  padding: 1rem;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}
.file-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.input-group .btn {
  min-width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-group .form-control {
  max-width: 100px;
}
</style>
