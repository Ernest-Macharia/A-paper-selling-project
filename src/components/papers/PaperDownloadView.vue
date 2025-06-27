<template>
    <Navbar />
    <div class="container py-5">
        <!-- Heading -->
        <div class="text-center mb-5">
            <h2 :class="downloadUrls.length ? 'text-success' : 'text-danger'" class="fw-bold">
                {{ downloadUrls.length ? 'Download Your Papers' : 'No Papers Found' }}
            </h2>
            <p class="text-muted" v-if="downloadUrls.length">
                Thank you for your purchase! Your papers are ready below.
            </p>
        </div>

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="text-center my-5">
            <p class="text-primary">Loading your papers...</p>
            <span class="spinner-border text-primary" role="status" />
        </div>

        <!-- Error Message -->
        <div v-else-if="errorMessage" class="text-center my-5">
            <p class="text-danger fs-5">{{ errorMessage }}</p>
            <router-link to="/" class="btn btn-outline-danger mt-3">
                <i class="bi bi-house-door me-2"></i>Go Back Home
            </router-link>
        </div>

        <!-- Downloadable Papers -->
        <div v-else-if="downloadUrls.length" class="row row-cols-1 row-cols-md-2 g-4">
            <div v-for="(url, index) in downloadUrls" :key="index" class="col" data-aos="fade-up">
                <div class="card h-100 border-0 shadow-sm rounded-3">
                    <div class="card-body">
                        <h5 class="card-title text-primary mb-3">
                            <i class="bi bi-file-earmark-text me-2"></i>
                            {{ paperDetailsList[index]?.title || 'Untitled Paper' }}
                        </h5>
                        <ul class="list-unstyled text-muted small mb-0">
                            <li>
                                <strong>Price:</strong>
                                <span class="text-success"
                                    >${{ paperDetailsList[index]?.price ?? '—' }}</span
                                >
                            </li>
                            <li>
                                <strong>Uploaded:</strong>
                                {{ formatDate(paperDetailsList[index]?.upload_date) }}
                            </li>
                            <li>
                                <strong>Pages:</strong>
                                {{ paperDetailsList[index]?.pages || '—' }}
                            </li>
                            <li>
                                <strong>Category:</strong>
                                {{ paperDetailsList[index]?.category?.name || '—' }}
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <a
                            :href="url"
                            target="_blank"
                            download
                            class="btn btn-success w-100 d-flex justify-content-center align-items-center gap-2"
                        >
                            <i class="bi bi-download"></i> Download Paper
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Downloadable Papers -->
        <div v-else class="text-center text-muted mt-5">
            <p class="fs-5">No downloadable papers were found for this order.</p>
        </div>

        <!-- Continue Shopping Button -->
        <div class="text-center mt-5" v-if="downloadUrls.length">
            <router-link to="/papers" class="btn btn-outline-primary">
                <i class="bi bi-arrow-left-circle me-2"></i>Continue Shopping
            </router-link>
        </div>
    </div>
    <Footer />
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/components/home/Navbar.vue';
import Footer from '@/components/home/Footer.vue';

export default {
    name: 'PaperDownloadView',

    components: {
        Navbar,
        Footer,
    },
    data() {
        return {
            isLoading: true,
            errorMessage: null,
            downloadUrls: [],
            paperDetailsList: [],
        };
    },
    async created() {
        const idsQuery = this.$route.query.ids;

        if (!idsQuery) {
            this.errorMessage = 'No papers specified for download.';
            this.isLoading = false;
            return;
        }

        const paperIds = idsQuery
            .split(',')
            .map((id) => parseInt(id.trim(), 10))
            .filter(Boolean);

        try {
            const results = await Promise.all(
                paperIds.map(async (id) => {
                    const [url, details] = await Promise.all([
                        this.downloadPaperById(id),
                        this.fetchPaperById(id),
                    ]);
                    return { url, details };
                }),
            );

            this.downloadUrls = results.map((r) => r.url);
            this.paperDetailsList = results.map((r) => r.details);
        } catch (error) {
            console.error('Download failed:', error);
            this.errorMessage = 'There was a problem fetching your downloads.';
        } finally {
            this.isLoading = false;
        }
    },
    methods: {
        ...mapActions('papers', ['fetchPaperById', 'downloadPaperById']),
        formatDate(date) {
            if (!date) return '—';
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
.card-title {
    font-size: 1.2rem;
    font-weight: 600;
}
.card-body ul li {
    margin-bottom: 0.25rem;
}
.card-footer .btn {
    font-weight: 500;
}
</style>
