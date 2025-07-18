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
                                    <select
                                        v-model="paper.category"
                                        class="form-select"
                                        :class="{ 'is-invalid': submitted && !paper.category }"
                                        :disabled="isLoading"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        <option
                                            v-for="cat in categories"
                                            :key="cat.id"
                                            :value="cat.id"
                                        >
                                            {{ cat.name }}
                                        </option>
                                    </select>
                                    <div class="invalid-feedback">Please select a category</div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold"
                                        >Course <span class="text-danger">*</span></label
                                    >
                                    <select
                                        v-model="paper.course"
                                        class="form-select"
                                        :class="{ 'is-invalid': submitted && !paper.course }"
                                        :disabled="isLoading"
                                    >
                                        <option value="" disabled>Select Course</option>
                                        <option
                                            v-for="course in courses"
                                            :key="course.id"
                                            :value="course.id"
                                        >
                                            {{ course.name }}
                                        </option>
                                    </select>
                                    <div class="invalid-feedback">Please select a course</div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold"
                                        >Institution <span class="text-danger">*</span></label
                                    >
                                    <select
                                        v-model="paper.school"
                                        class="form-select"
                                        :class="{ 'is-invalid': submitted && !paper.school }"
                                        :disabled="isLoading"
                                    >
                                        <option value="" disabled>Select University</option>
                                        <option
                                            v-for="school in schools"
                                            :key="school.id"
                                            :value="school.id"
                                        >
                                            {{ school.name }}
                                        </option>
                                    </select>
                                    <div class="invalid-feedback">Please select an institution</div>
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
            };
        },

        async loadCategories() {
            try {
                const data = await this.fetchCategories();
                this.categories = data.results;
            } catch {
                this.categories = [];
            }
        },

        async loadCourses() {
            try {
                const data = await this.fetchCourses();
                this.courses = data.results;
            } catch {
                this.courses = [];
            }
        },

        async loadSchools() {
            try {
                const data = await this.fetchSchools();
                this.schools = data.results;
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
</style>
