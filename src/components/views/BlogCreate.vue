<template>
    <Navbar />
    <section class="container mx-auto py-10">
        <h1 class="text-3xl font-bold mb-6 text-center">Write a New Article</h1>

        <form
            @submit.prevent="submitPost"
            class="bg-white rounded-3xl shadow-sm border p-6 max-w-3xl mx-auto"
            novalidate
        >
            <div class="mb-4">
                <label class="form-label fw-semibold">Title</label>
                <input
                    v-model.trim="title"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.title }"
                    placeholder="Enter article title"
                    required
                />
                <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
            </div>

            <div class="mb-4">
                <label class="form-label fw-semibold">Content</label>
                <textarea
                    v-model.trim="content"
                    rows="6"
                    class="form-control"
                    :class="{ 'is-invalid': errors.content }"
                    placeholder="Write your article content here..."
                    required
                ></textarea>
                <div v-if="errors.content" class="invalid-feedback">{{ errors.content }}</div>
            </div>

            <div class="mb-4">
                <label class="form-label fw-semibold">Image</label>
                <input type="file" @change="onFileChange" class="form-control" />
            </div>

            <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary px-5" :disabled="blogLoading">
                    <span
                        v-if="blogLoading"
                        class="spinner-grow spinner-grow-sm me-2"
                        role="status"
                        aria-hidden="true"
                    ></span>
                    {{ blogLoading ? 'Publishing...' : 'Publish' }}
                </button>
            </div>

            <p v-if="blogError" class="text-danger mt-3 text-center">{{ blogError }}</p>
        </form>

        <div v-if="successMessage" class="alert alert-success mt-4 text-center">
            {{ successMessage }}
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
            title: '',
            content: '',
            imageFile: null,
            errors: {},
            successMessage: '',
        };
    },
    computed: {
        ...mapGetters('blog', ['blogLoading', 'blogError']),
    },
    methods: {
        ...mapActions('blog', ['createBlogPost']),
        onFileChange(e) {
            this.imageFile = e.target.files[0];
        },
        validateForm() {
            this.errors = {};
            if (!this.title) this.errors.title = 'Title is required.';
            if (!this.content) this.errors.content = 'Content is required.';
            return Object.keys(this.errors).length === 0;
        },
        async submitPost() {
            if (!this.validateForm()) return;

            const formData = new FormData();
            formData.append('title', this.title);
            formData.append('content', this.content);
            if (this.imageFile) formData.append('image', this.imageFile);

            try {
                await this.createBlogPost(formData);
                this.successMessage = 'Your article was successfully published!';
                this.title = '';
                this.content = '';
                this.imageFile = null;
                setTimeout(() => (this.successMessage = ''), 3000);
                this.$router.push({ name: 'Blog' });
            } catch (err) {
                console.error(err);
            }
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 900px;
}
</style>
