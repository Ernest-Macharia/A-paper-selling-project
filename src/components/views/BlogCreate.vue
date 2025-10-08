<template>
    <Navbar />
    <section class="container-fluid bg-light min-vh-100 py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 col-xl-7">
                    <!-- Header -->
                    <div class="text-center mb-6">
                        <h1 class="display-5 fw-bold text-gradient mb-3">Create New Article</h1>
                        <p class="lead text-muted">
                            Share your knowledge and insights with the community
                        </p>
                    </div>

                    <!-- Create Form -->
                    <form
                        @submit.prevent="submitPost"
                        class="bg-white rounded-4 shadow-sm border p-4 p-md-5"
                        novalidate
                    >
                        <!-- Title Field -->
                        <div class="mb-4">
                            <label class="form-label fw-semibold fs-5">
                                <i class="bi bi-type me-2 text-primary"></i>
                                Article Title
                            </label>
                            <input
                                v-model.trim="formData.title"
                                type="text"
                                class="form-control form-control-lg border-2"
                                :class="{ 'is-invalid': errors.title }"
                                placeholder="Enter a compelling title..."
                                required
                            />
                            <div
                                v-if="errors.title"
                                class="invalid-feedback d-flex align-items-center"
                            >
                                <i class="bi bi-exclamation-circle me-2"></i>
                                {{ errors.title }}
                            </div>
                        </div>

                        <!-- Content Field -->
                        <div class="mb-4">
                            <label class="form-label fw-semibold fs-5">
                                <i class="bi bi-pencil me-2 text-primary"></i>
                                Content
                            </label>
                            <textarea
                                v-model.trim="formData.content"
                                rows="8"
                                class="form-control border-2"
                                :class="{ 'is-invalid': errors.content }"
                                placeholder="Write your amazing content here... (Supports HTML)"
                                required
                            ></textarea>
                            <div class="form-text">
                                You can use HTML tags for formatting. Minimum 100 characters.
                            </div>
                            <div
                                v-if="errors.content"
                                class="invalid-feedback d-flex align-items-center"
                            >
                                <i class="bi bi-exclamation-circle me-2"></i>
                                {{ errors.content }}
                            </div>
                        </div>

                        <!-- Image Upload -->
                        <div class="mb-4">
                            <label class="form-label fw-semibold fs-5">
                                <i class="bi bi-image me-2 text-primary"></i>
                                Featured Image
                            </label>
                            <div class="image-upload-container">
                                <input
                                    type="file"
                                    @change="onFileChange"
                                    class="form-control border-2"
                                    accept="image/*"
                                />
                                <div class="form-text">
                                    Recommended size: 1200x630 pixels. Max file size: 5MB.
                                </div>

                                <!-- Image Preview -->
                                <div v-if="imagePreview" class="image-preview mt-3">
                                    <div class="preview-container position-relative d-inline-block">
                                        <img
                                            :src="imagePreview"
                                            alt="Preview"
                                            class="preview-image rounded-3 shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            @click="removeImage"
                                            class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                                            style="width: 30px; height: 30px"
                                        >
                                            <i class="bi bi-x"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Category & Tags -->
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    <i class="bi bi-bookmark me-2 text-primary"></i>
                                    Category
                                </label>
                                <select
                                    v-model="formData.category_id"
                                    class="form-select border-2"
                                    :disabled="categoriesLoading"
                                >
                                    <option value="">Select a category</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                                <div v-if="categoriesLoading" class="form-text">
                                    <small class="text-muted">Loading categories...</small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    <i class="bi bi-tags me-2 text-primary"></i>
                                    Tags
                                </label>
                                <select
                                    v-model="formData.tag_ids"
                                    multiple
                                    class="form-select border-2"
                                    :disabled="tagsLoading"
                                >
                                    <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                                        {{ tag.name }}
                                    </option>
                                </select>
                                <div class="form-text">Hold Ctrl to select multiple tags</div>
                                <div v-if="tagsLoading" class="form-text">
                                    <small class="text-muted">Loading tags...</small>
                                </div>
                            </div>
                        </div>

                        <!-- Publish Options -->
                        <div class="mb-4 mt-3">
                            <div class="form-check form-switch">
                                <input
                                    v-model="formData.is_published"
                                    class="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="publishSwitch"
                                />
                                <label class="form-check-label fw-semibold" for="publishSwitch">
                                    <i
                                        class="bi bi-globe me-2"
                                        :class="
                                            formData.is_published
                                                ? 'text-success'
                                                : 'text-secondary'
                                        "
                                    ></i>
                                    Publish immediately
                                </label>
                            </div>
                            <div class="form-text">
                                If unchecked, your article will be saved as a draft.
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-flex gap-3 justify-content-center mt-5 pt-3">
                            <button
                                type="submit"
                                class="btn btn-primary btn-lg px-5 rounded-pill"
                                :disabled="blogLoading"
                            >
                                <span
                                    v-if="blogLoading"
                                    class="spinner-grow spinner-grow-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                <i v-else class="bi bi-rocket-takeoff me-2"></i>
                                {{ blogLoading ? 'Publishing...' : 'Publish Article' }}
                            </button>

                            <router-link
                                to="/blog"
                                class="btn btn-outline-secondary btn-lg px-4 rounded-pill"
                            >
                                <i class="bi bi-arrow-left me-2"></i>
                                Cancel
                            </router-link>
                        </div>

                        <!-- Error Message -->
                        <p v-if="blogError" class="text-danger mt-4 text-center fs-5">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            {{ blogError }}
                        </p>
                    </form>

                    <!-- Success Message -->
                    <div
                        v-if="successMessage"
                        class="alert alert-success alert-dismissible fade show mt-4 text-center rounded-3"
                    >
                        <div class="d-flex align-items-center justify-content-center">
                            <i class="bi bi-check-circle-fill me-3 fs-4"></i>
                            <div>
                                <h5 class="mb-1">Article Published Successfully!</h5>
                                <p class="mb-0">{{ successMessage }}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="btn-close"
                            @click="successMessage = ''"
                        ></button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <Footer />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'BlogCreate',
    components: {
        Footer,
        Navbar,
    },
    data() {
        return {
            formData: {
                title: '',
                content: '',
                category_id: null,
                tag_ids: [],
                is_published: true,
            },
            imageFile: null,
            imagePreview: null,
            categoriesLoading: false,
            tagsLoading: false,
            errors: {},
            successMessage: '',
        };
    },
    computed: {
        ...mapGetters('blog', ['blogLoading', 'blogError', 'categories', 'tags']),
    },
    async created() {
        await this.loadFormData();
    },
    methods: {
        ...mapActions('blog', ['createBlogPost', 'fetchCategories', 'fetchTags']),

        async loadFormData() {
            this.categoriesLoading = true;
            this.tagsLoading = true;

            try {
                await Promise.all([this.fetchCategories(), this.fetchTags()]);
            } catch (error) {
                console.error('Error loading form data:', error);
            } finally {
                this.categoriesLoading = false;
                this.tagsLoading = false;
            }
        },

        onFileChange(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    this.errors.image = 'File size must be less than 5MB';
                    return;
                }
                this.imageFile = file;
                this.imagePreview = URL.createObjectURL(file);
            }
        },

        removeImage() {
            this.imageFile = null;
            this.imagePreview = null;
        },

        validateForm() {
            this.errors = {};
            if (!this.formData.title.trim()) {
                this.errors.title = 'Title is required';
            } else if (this.formData.title.length < 5) {
                this.errors.title = 'Title must be at least 5 characters long';
            }

            if (!this.formData.content.trim()) {
                this.errors.content = 'Content is required';
            } else if (this.formData.content.length < 100) {
                this.errors.content = 'Content must be at least 100 characters long';
            }

            return Object.keys(this.errors).length === 0;
        },

        async submitPost() {
            if (!this.validateForm()) return;

            const formData = new FormData();
            formData.append('title', this.formData.title);
            formData.append('content', this.formData.content);
            formData.append('is_published', this.formData.is_published);

            if (this.imageFile) formData.append('image', this.imageFile);
            if (this.formData.category_id)
                formData.append('category_id', this.formData.category_id);
            if (this.formData.tag_ids.length) {
                this.formData.tag_ids.forEach((tagId) => formData.append('tag_ids', tagId));
            }

            try {
                await this.createBlogPost(formData);
                this.successMessage = 'Your article was successfully published! Redirecting...';

                // Reset form
                this.formData = {
                    title: '',
                    content: '',
                    category_id: null,
                    tag_ids: [],
                    is_published: true,
                };
                this.imageFile = null;
                this.imagePreview = null;

                // Redirect after delay
                setTimeout(() => {
                    this.$router.push({ name: 'Blog' });
                }, 2000);
            } catch (err) {
                console.error('Error creating post:', err);
                // Handle backend validation errors
                if (err.response?.data) {
                    const backendErrors = err.response.data;
                    Object.keys(backendErrors).forEach((key) => {
                        this.errors[key] = Array.isArray(backendErrors[key])
                            ? backendErrors[key].join(', ')
                            : backendErrors[key];
                    });
                }
            }
        },
    },
};
</script>

<style scoped>
/* Previous styles remain the same */
.text-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.form-control.border-2,
.form-select.border-2 {
    border-width: 2px !important;
    border-color: #e9ecef;
    transition: all 0.3s ease;
}

.form-control.border-2:focus,
.form-select.border-2:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.image-upload-container {
    border: 2px dashed #dee2e6;
    border-radius: 15px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
}

.image-upload-container:hover {
    border-color: #667eea;
    background-color: #f8f9ff;
}

.preview-image {
    max-width: 300px;
    max-height: 200px;
    object-fit: cover;
}

.btn {
    transition: all 0.3s ease;
}

.alert-success {
    border: none;
    background: linear-gradient(135deg, #d4edda, #c3e6cb);
}
</style>
