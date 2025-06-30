<template>
    <Navbar />
    <div class="container py-5">
        <h2 class="mb-4 text-center text-primary fw-bold">📄 Your Exam Papers</h2>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-danger text-center">
            {{ errorMessage }}
        </div>

        <!-- Papers -->
        <div v-else class="row row-cols-1 row-cols-md-2 g-4">
            <div v-for="(paper, index) in paperDetailsList" :key="paper.id" class="col">
                <div class="card h-100 shadow border-0">
                    <div class="card-body">
                        <h5 class="card-title text-primary">
                            <i class="bi bi-journal-text me-2"></i>{{ paper.title }}
                        </h5>
                        <p class="text-muted">
                            {{ paper.description || 'No description available.' }}
                        </p>
                        <ul class="list-unstyled small mb-3">
                            <li><strong>Category:</strong> {{ paper.category?.name || '—' }}</li>
                            <li><strong>Pages:</strong> {{ paper.pages || '—' }}</li>
                            <li><strong>Uploaded:</strong> {{ formatDate(paper.upload_date) }}</li>
                            <li>
                                <strong>Price:</strong>
                                <span class="text-success">${{ paper.price ?? 'Free' }}</span>
                            </li>
                        </ul>
                        <button class="btn btn-success me-2" @click="downloadSinglePaper(paper.id)">
                            <i class="bi bi-download me-1"></i>Download
                        </button>
                        <button class="btn btn-outline-primary" @click="openReviewModal(paper)">
                            <i class="bi bi-star-half me-1"></i>Leave Review
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Review Modal -->
        <div class="modal fade show" tabindex="-1" style="display: block" v-if="showModal">
            <div class="modal-dialog">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Review: {{ selectedPaper?.title }}</h5>
                        <button type="button" class="btn-close" @click="closeReviewModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitReview">
                            <div class="mb-3">
                                <label class="form-label">Your Rating</label>
                                <div>
                                    <i
                                        v-for="n in 5"
                                        :key="n"
                                        class="bi me-1 fs-4"
                                        :class="{
                                            'bi-star-fill text-warning': reviewForm.rating >= n,
                                            'bi-star text-secondary': reviewForm.rating < n,
                                        }"
                                        style="cursor: pointer"
                                        @click="reviewForm.rating = n"
                                    ></i>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Your Comment</label>
                                <textarea
                                    v-model="reviewForm.comment"
                                    class="form-control"
                                    rows="3"
                                    placeholder="Share your thoughts..."
                                ></textarea>
                            </div>

                            <div class="d-flex justify-content-between">
                                <button type="submit" class="btn btn-primary" @click="submitReview">
                                    Submit Review
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    @click="closeReviewModal"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div v-if="submissionError" class="alert alert-danger mt-3">
                                {{ submissionError }}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Backdrop -->
        <div v-if="showModal" class="modal-backdrop fade show"></div>
    </div>
    <Footer />
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';
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
            paperDetailsList: [],
            isLoading: true,
            errorMessage: null,
            showModal: false,
            selectedPaper: null,
            reviewForm: {
                rating: 0,
                comment: '',
            },
            reviewSuccess: false,
            submissionError: null,
        };
    },
    methods: {
        ...mapActions('papers', ['fetchPaperById', 'submitPaperReview', 'downloadPaperById']),

        async handleDownloadFlow() {
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
                        try {
                            const paper = await this.fetchPaperById(id);
                            return paper;
                        } catch {
                            return null;
                        }
                    }),
                );
                this.paperDetailsList = results.filter(Boolean);
                if (this.paperDetailsList.length === 0) {
                    this.errorMessage = 'No valid papers found.';
                } else {
                    toast.success('Papers loaded successfully!');
                }
            } catch {
                this.paperDetailsList = [];
                toast.error('Failed to load papers.');
                this.errorMessage = 'There was a problem fetching your downloads.';
            } finally {
                this.isLoading = false;
            }
        },

        async downloadSinglePaper(paperId) {
            try {
                const fileUrl = await this.downloadPaperById(paperId);
                if (fileUrl) {
                    window.open(fileUrl, '_blank');
                    toast.success('Paper downloaded successfully!');
                } else {
                    throw new Error('No download URL found.');
                }
            } catch {
                toast.error('Failed to download paper.');
            }
        },

        openReviewModal(paper) {
            this.selectedPaper = paper;
            this.reviewForm = { rating: 0, comment: '' };
            this.submissionError = null;
            this.reviewSuccess = false;
            this.showModal = true;
        },

        closeReviewModal() {
            this.showModal = false;
            this.selectedPaper = null;
        },

        async submitReview() {
            if (!this.selectedPaper || !this.selectedPaper.id) {
                this.submissionError = 'Paper not selected.';
                return;
            }

            const reviewPayload = {
                rating: this.reviewForm.rating,
                comment: this.reviewForm.comment,
            };

            try {
                await this.submitPaperReview({
                    paper: this.selectedPaper.id,
                    reviewData: reviewPayload,
                });
                this.reviewSuccess = true;
                this.submissionError = null;
                toast.success('Review submitted successfully!');
                this.closeReviewModal();
            } catch {
                this.submissionError = 'Failed to submit review. Please try again.';
            }
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
    },
    created() {
        this.handleDownloadFlow();
    },
};
</script>

<style scoped>
.card-title {
    font-weight: 600;
}
.modal-backdrop {
    z-index: 1040;
}
.modal {
    z-index: 1050;
}
</style>
