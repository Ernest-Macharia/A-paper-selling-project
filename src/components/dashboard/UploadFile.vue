<template>
    <div class="container py-4 py-lg-5">
        <div class="row justify-content-center">
            <div class="col-lg-10 col-xl-8">
                <!-- Header with progress indicator -->
                <div class="text-center mb-4">
                    <h2 class="fw-bold text-gradient-primary mb-3">Upload Academic Paper</h2>
                    <p class="text-muted">Share your knowledge and help other students</p>
                    <div class="progress mt-3" style="height: 6px">
                        <div
                            class="progress-bar bg-primary"
                            role="progressbar"
                            style="width: 0%"
                        ></div>
                    </div>
                </div>

                <!-- Main Form Card -->
                <div class="card border-0 shadow-sm overflow-hidden">
                    <div class="card-body p-4 p-md-5">
                        <form @submit.prevent="handleUpload">
                            <!-- Title Input -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold"
                                    >Title <span class="text-danger">*</span></label
                                >
                                <input
                                    v-model="paper.title"
                                    type="text"
                                    class="form-control form-control-lg"
                                    placeholder="e.g., Advanced Calculus Final Exam Solutions"
                                    :class="{ 'is-invalid': submitted && !paper.title }"
                                    :disabled="isLoading"
                                />
                                <div class="invalid-feedback">
                                    Please provide a title for your paper
                                </div>
                            </div>

                            <!-- Description Input -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold"
                                    >Description <span class="text-danger">*</span></label
                                >
                                <textarea
                                    v-model="paper.description"
                                    class="form-control"
                                    rows="4"
                                    placeholder="Briefly describe the contents of your paper..."
                                    :class="{ 'is-invalid': submitted && !paper.description }"
                                    :disabled="isLoading"
                                ></textarea>
                                <div class="invalid-feedback">Please provide a description</div>
                                <small class="text-muted">Minimum 50 characters</small>
                            </div>

                            <!-- Price Input -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold"
                                    >Price (USD) <span class="text-danger">*</span></label
                                >
                                <div class="d-flex align-items-center gap-3">
                                    <button
                                        type="button"
                                        class="btn btn-outline-secondary rounded-circle p-2"
                                        @click="decreasePrice"
                                        :disabled="isLoading || paper.price <= 0"
                                    >
                                        <i class="bi bi-dash-lg"></i>
                                    </button>
                                    <div class="input-group flex-grow-1">
                                        <span class="input-group-text">$</span>
                                        <input
                                            v-model.number="paper.price"
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            class="form-control text-center"
                                            :class="{
                                                'is-invalid':
                                                    submitted &&
                                                    (paper.price === '' || paper.price < 0),
                                            }"
                                            :disabled="isLoading"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        class="btn btn-outline-secondary rounded-circle p-2"
                                        @click="increasePrice"
                                        :disabled="isLoading"
                                    >
                                        <i class="bi bi-plus-lg"></i>
                                    </button>
                                </div>
                                <div
                                    class="invalid-feedback d-block"
                                    v-if="submitted && (paper.price === '' || paper.price < 0)"
                                >
                                    Please set a valid price
                                </div>
                            </div>

                            <!-- Category, Course, School in responsive grid -->
                            <div class="row g-3 mb-4">
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold"
                                        >Category <span class="text-danger">*</span></label
                                    >
                                    <div class="dropdown-search">
                                        <input
                                            type="text"
                                            v-model="categorySearch"
                                            @focus="showCategoryDropdown = true"
                                            @blur="onBlur('category')"
                                            placeholder="Search categories..."
                                            class="form-control"
                                            :class="{ 'is-invalid': submitted && !paper.category }"
                                        />
                                        <div
                                            class="dropdown-menu w-100 show"
                                            v-if="showCategoryDropdown"
                                        >
                                            <div class="dropdown-search-list">
                                                <div
                                                    v-for="cat in filteredCategories"
                                                    :key="cat.id"
                                                    class="dropdown-item"
                                                    @mousedown.prevent="selectCategory(cat)"
                                                >
                                                    {{ cat.name }}
                                                </div>
                                                <div
                                                    v-if="filteredCategories.length === 0"
                                                    class="dropdown-item text-muted"
                                                >
                                                    No categories found
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="invalid-feedback">Please select a category</div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold"
                                        >Course <span class="text-danger">*</span></label
                                    >
                                    <div class="dropdown-search">
                                        <input
                                            type="text"
                                            v-model="courseSearch"
                                            @focus="showCourseDropdown = true"
                                            @blur="onBlur('course')"
                                            placeholder="Search courses..."
                                            class="form-control"
                                            :class="{ 'is-invalid': submitted && !paper.course }"
                                        />
                                        <div
                                            class="dropdown-menu w-100 show"
                                            v-if="showCourseDropdown"
                                        >
                                            <div class="dropdown-search-list">
                                                <div
                                                    v-for="course in filteredCourses"
                                                    :key="course.id"
                                                    class="dropdown-item"
                                                    @mousedown.prevent="selectCourse(course)"
                                                >
                                                    {{ course.name }}
                                                    <small class="text-muted ms-2">{{
                                                        course.category
                                                    }}</small>
                                                </div>
                                                <div
                                                    v-if="filteredCourses.length === 0"
                                                    class="dropdown-item text-muted"
                                                >
                                                    No courses found
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="invalid-feedback">Please select a course</div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold"
                                        >Institution <span class="text-danger">*</span></label
                                    >
                                    <div class="dropdown-search">
                                        <input
                                            type="text"
                                            v-model="schoolSearch"
                                            @focus="showSchoolDropdown = true"
                                            @blur="onBlur('school')"
                                            placeholder="Search universities..."
                                            class="form-control"
                                            :class="{ 'is-invalid': submitted && !paper.school }"
                                        />
                                        <div
                                            class="dropdown-menu w-100 show"
                                            v-if="showSchoolDropdown"
                                        >
                                            <div class="dropdown-search-list">
                                                <div
                                                    v-for="school in filteredSchools"
                                                    :key="school.id"
                                                    class="dropdown-item"
                                                    @mousedown.prevent="selectSchool(school)"
                                                >
                                                    {{ school.name }}
                                                </div>
                                                <div
                                                    v-if="filteredSchools.length === 0"
                                                    class="dropdown-item text-muted"
                                                >
                                                    No institutions found
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="invalid-feedback">Please select an institution</div>
                                </div>
                            </div>

                            <!-- Selected values display (optional) -->
                            <div
                                class="row g-3 mb-4"
                                v-if="selectedCategory || selectedCourse || selectedSchool"
                            >
                                <div class="col-md-4" v-if="selectedCategory">
                                    <div class="selected-value">
                                        <strong>Selected Category:</strong>
                                        {{ selectedCategory.name }}
                                    </div>
                                </div>
                                <div class="col-md-4" v-if="selectedCourse">
                                    <div class="selected-value">
                                        <strong>Selected Course:</strong> {{ selectedCourse.name }}
                                    </div>
                                </div>
                                <div class="col-md-4" v-if="selectedSchool">
                                    <div class="selected-value">
                                        <strong>Selected Institution:</strong>
                                        {{ selectedSchool.name }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-semibold"
                                    >Academic Year <span class="text-danger">*</span></label
                                >
                                <select
                                    v-model="paper.year"
                                    class="form-select"
                                    :disabled="isLoading"
                                >
                                    <option value="" disabled selected>Select academic year</option>
                                    <option v-for="year in academicYears" :value="year" :key="year">
                                        {{ year }}
                                    </option>
                                    <option value="other">Other (specify)</option>
                                </select>

                                <!-- Additional input for custom year if "Other" is selected -->
                                <div v-if="paper.year === 'other'" class="mt-2">
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="bi bi-calendar"></i>
                                        </span>
                                        <input
                                            v-model="customYear"
                                            type="text"
                                            class="form-control"
                                            placeholder="Enter custom year (YYYY/YYYY)"
                                            pattern="\d{4}/\d{4}"
                                            title="Please use format: YYYY/YYYY"
                                            :disabled="isLoading"
                                            @blur="validateCustomYear"
                                        />
                                    </div>
                                    <small class="text-muted"
                                        >Format: YYYY/YYYY (e.g., 2023/2024)</small
                                    >
                                </div>
                            </div>

                            <!-- File Upload with Enhanced Dropzone -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold"
                                    >Paper File <span class="text-danger">*</span></label
                                >
                                <div
                                    class="drop-zone rounded-3 p-4 text-center"
                                    :class="{
                                        'border-primary bg-primary bg-opacity-10': isDragging,
                                        'border-dashed border-2 border-secondary':
                                            !paper.file && !isDragging,
                                        'border-success bg-success bg-opacity-10':
                                            paper.file && !isDragging,
                                        'is-invalid': submitted && !paper.file,
                                    }"
                                    @dragover.prevent="isDragging = true"
                                    @dragleave.prevent="isDragging = false"
                                    @drop.prevent="handleDrop"
                                >
                                    <div v-if="!paper.file" class="py-4">
                                        <div class="mb-3">
                                            <i
                                                class="bi bi-cloud-arrow-up display-5 text-muted"
                                            ></i>
                                        </div>
                                        <h5 class="mb-2">Drag & drop your file here</h5>
                                        <p class="text-muted mb-3">or</p>
                                        <button
                                            type="button"
                                            class="btn btn-primary px-4"
                                            @click="$refs.fileInput.click()"
                                            :disabled="isLoading"
                                        >
                                            <i class="bi bi-folder2-open me-2"></i>Browse Files
                                        </button>
                                        <p class="small text-muted mt-2 mb-0">Max 50MB per file</p>
                                    </div>

                                    <div
                                        v-else
                                        class="d-flex align-items-center justify-content-between bg-white p-3 rounded-2"
                                    >
                                        <div class="d-flex align-items-center gap-3">
                                            <div class="bg-light rounded-2 p-2">
                                                <i :class="`bi ${fileIconClass} fs-3`"></i>
                                            </div>
                                            <div>
                                                <h6
                                                    class="mb-0 text-truncate"
                                                    style="max-width: 300px"
                                                >
                                                    {{ paper.file.name }}
                                                </h6>
                                                <small class="text-muted">{{
                                                    formatFileSize(paper.file.size)
                                                }}</small>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-danger rounded-circle"
                                            @click="removeFile"
                                            :disabled="isLoading"
                                        >
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    class="d-none"
                                    ref="fileInput"
                                    @change="handleFile"
                                    :disabled="isLoading"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                />
                                <div
                                    class="invalid-feedback d-block"
                                    v-if="submitted && !paper.file"
                                >
                                    Please upload your paper file
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="d-grid mt-5">
                                <button
                                    type="submit"
                                    class="btn btn-primary btn-lg py-3 fw-semibold"
                                    :disabled="isLoading"
                                >
                                    <template v-if="isLoading">
                                        <span
                                            class="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Uploading...
                                    </template>
                                    <template v-else>
                                        <i class="bi bi-cloud-arrow-up-fill me-2"></i>Submit Paper
                                    </template>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <UploadSuccessModal :visible="successVisible" @close="successVisible = false" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import UploadSuccessModal from '@/components/dashboard/UploadSuccessModal.vue';
import { toast } from 'vue3-toastify';

export default {
    name: 'UploadPaper',
    components: { UploadSuccessModal },
    data() {
        return {
            paper: {
                title: '',
                description: '',
                price: 5.0,
                file: null,
                preview_url: null,
                year: '',
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

            // Search and dropdown state
            categorySearch: '',
            courseSearch: '',
            schoolSearch: '',
            academicYears: this.generateAcademicYears(10),
            customYear: '',
            showCategoryDropdown: false,
            showCourseDropdown: false,
            showSchoolDropdown: false,
            selectedCategory: null,
            selectedCourse: null,
            selectedSchool: null,
        };
    },

    computed: {
        fileIconClass() {
            if (!this.paper.file) return 'bi-file-earmark-text';

            const name = this.paper.file.name.toLowerCase();
            if (name.endsWith('.pdf')) return 'bi-filetype-pdf text-danger';
            if (name.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)) return 'bi-file-image text-success';
            if (name.match(/\.(doc|docx)$/)) return 'bi-filetype-docx text-primary';
            if (name.match(/\.(xls|xlsx)$/)) return 'bi-filetype-xlsx text-success';
            if (name.match(/\.(ppt|pptx)$/)) return 'bi-filetype-pptx text-warning';
            if (name.match(/\.(zip|rar|7z)$/)) return 'bi-file-zip text-secondary';

            return 'bi-file-earmark-text text-muted';
        },

        filteredCategories() {
            if (!this.categorySearch) return this.categories;
            const searchTerm = this.categorySearch.toLowerCase();
            return this.categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm));
        },

        filteredCourses() {
            if (!this.courseSearch) return this.courses;
            const searchTerm = this.courseSearch.toLowerCase();
            return this.courses.filter(
                (course) =>
                    course.name.toLowerCase().includes(searchTerm) ||
                    (course.category && course.category.toLowerCase().includes(searchTerm)),
            );
        },

        filteredSchools() {
            if (!this.schoolSearch) return this.schools;
            const searchTerm = this.schoolSearch.toLowerCase();
            return this.schools.filter((school) => school.name.toLowerCase().includes(searchTerm));
        },
    },

    async created() {
        await this.loadCategories();
        await this.loadCourses();
        await this.loadSchools();
    },

    methods: {
        ...mapActions('papers', ['fetchCategories', 'fetchCourses', 'fetchSchools', 'uploadPaper']),

        handleFile(event) {
            const file = event.target.files[0];
            if (file && this.validateFile(file)) {
                this.paper.file = file;
            }
            this.isDragging = false;
        },

        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file && this.validateFile(file)) {
                this.paper.file = file;
            }
            this.isDragging = false;
        },

        validateFile(file) {
            const validTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            const maxSize = 50 * 1024 * 1024; // 50MB

            if (!validTypes.some((type) => file.type.includes(type))) {
                toast.error('Please upload a valid PDF or DOCX file');
                return false;
            }

            if (file.size > maxSize) {
                toast.error('File size exceeds 50MB limit');
                return false;
            }

            return true;
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        removeFile() {
            this.paper.file = null;
            this.$refs.fileInput.value = '';
            this.isDragging = false;
        },

        async handleUpload() {
            this.submitted = true;

            if (!this.isValid()) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            this.isLoading = true;
            const formData = new FormData();
            formData.append('title', this.paper.title);
            formData.append('description', this.paper.description);
            formData.append('price', this.paper.price);
            formData.append('year', this.paper.year);
            formData.append('category_id', this.paper.category);
            formData.append('course_id', this.paper.course);
            formData.append('school_id', this.paper.school);
            formData.append('preview_url', this.paper.preview_url);
            if (this.paper.file) formData.append('file', this.paper.file);

            try {
                await this.uploadPaper(formData);
                this.resetForm();
                toast.success('Paper uploaded successfully!');
                this.successVisible = true;
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error uploading paper');
            } finally {
                this.isLoading = false;
            }
        },

        isValid() {
            return (
                this.paper.title &&
                this.paper.description &&
                this.paper.price !== '' &&
                this.paper.year !== '' &&
                this.paper.price >= 0 &&
                this.paper?.category &&
                this.paper?.course &&
                this.paper?.school &&
                this.paper.file
            );
        },

        resetForm() {
            this.submitted = false;
            this.paper = {
                title: '',
                description: '',
                price: 5.0,
                file: null,
                category: '',
                course: '',
                school: '',
                year: '',
            };
            this.categorySearch = '';
            this.courseSearch = '';
            this.schoolSearch = '';
            this.customYear = '';
            this.selectedCategory = null;
            this.selectedCourse = null;
            this.selectedSchool = null;
        },

        generateAcademicYears(range) {
            const years = [];
            const currentYear = new Date().getFullYear();

            // Generate years from currentYear-range to currentYear+range
            for (let i = -range; i <= range; i++) {
                const startYear = currentYear + i;
                const endYear = startYear + 1;
                years.push(`${startYear}/${endYear}`);
            }

            return years;
        },

        validateCustomYear() {
            if (this.customYear && !/^\d{4}\/\d{4}$/.test(this.customYear)) {
                toast.error('Please use format: YYYY/YYYY');
                this.customYear = '';
            } else if (this.customYear) {
                this.paper.year = this.customYear;
            }
        },

        async loadCategories() {
            try {
                const data = await this.fetchCategories();
                this.categories = data.results || data;
            } catch {
                this.categories = [];
            }
        },

        async loadCourses() {
            try {
                const data = await this.fetchCourses();
                this.courses = data.results || data;
            } catch {
                this.courses = [];
            }
        },

        async loadSchools() {
            try {
                const data = await this.fetchSchools();
                this.schools = data.results || data;
            } catch {
                this.schools = [];
            }
        },

        increasePrice() {
            if (this.paper.price === '' || this.paper.price === null) {
                this.paper.price = 5.0;
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

        // Dropdown selection methods
        selectCategory(category) {
            this.paper.category = category.id;
            this.selectedCategory = category;
            this.categorySearch = category.name;
            this.showCategoryDropdown = false;
        },

        selectCourse(course) {
            this.paper.course = course.id;
            this.selectedCourse = course;
            this.courseSearch = course.name;
            this.showCourseDropdown = false;
        },

        selectSchool(school) {
            this.paper.school = school.id;
            this.selectedSchool = school;
            this.schoolSearch = school.name;
            this.showSchoolDropdown = false;
        },

        onBlur(type) {
            // Small timeout to allow click events to fire before hiding
            setTimeout(() => {
                if (type === 'category') {
                    this.showCategoryDropdown = false;
                    if (this.selectedCategory) {
                        this.categorySearch = this.selectedCategory.name;
                    }
                } else if (type === 'course') {
                    this.showCourseDropdown = false;
                    if (this.selectedCourse) {
                        this.courseSearch = this.selectedCourse.name;
                    }
                } else if (type === 'school') {
                    this.showSchoolDropdown = false;
                    if (this.selectedSchool) {
                        this.schoolSearch = this.selectedSchool.name;
                    }
                }
            }, 200);
        },
    },
};
</script>

<style scoped>
.text-gradient-primary {
    background: linear-gradient(90deg, #3b71fe 0%, #8e54e9 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.drop-zone {
    transition: all 0.3s ease;
    cursor: pointer;
}

.card {
    border-radius: 12px;
    overflow: hidden;
}

.form-control-lg,
.form-select,
.btn-lg {
    border-radius: 8px !important;
}

.input-group-text {
    background-color: #f8f9fa;
    border-radius: 8px 0 0 8px !important;
}

.rounded-3 {
    border-radius: 12px !important;
}

.btn-outline-secondary {
    border-width: 2px;
}

.progress {
    border-radius: 100px;
    background-color: #f0f2f5;
}

.progress-bar {
    transition: width 0.6s ease;
}

/* Dropdown search styles */
.dropdown-search {
    position: relative;
}

.dropdown-menu {
    display: block;
    max-height: 300px;
    overflow-y: auto;
    margin-top: 2px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}

.dropdown-search-list {
    padding: 0;
}

.dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    white-space: normal;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.dropdown-item small {
    opacity: 0.7;
}

.selected-value {
    background-color: #f8f9fa;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
}
</style>
