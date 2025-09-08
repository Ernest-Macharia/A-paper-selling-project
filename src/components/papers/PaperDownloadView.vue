<template>
    <Navbar />
    <div class="container py-5">
        <!-- Success Header -->
        <div class="text-center mb-5">
            <div class="success-animation mb-4">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
            </div>
            <h1 class="fw-bold mb-3 text-success">Download Successful!</h1>
            <p class="lead text-muted mb-4">
                Your paper{{ paperDetailsList.length > 1 ? 's are' : ' is' }} ready for download
            </p>

            <!-- Download Progress Overview -->
            <div v-if="downloadProgress.overall.total > 0" class="mb-4">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card bg-light border-0">
                            <div class="card-body py-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="small text-muted">Overall Progress</span>
                                    <span class="small text-muted">
                                        {{ downloadProgress.overall.completed }}/{{
                                            downloadProgress.overall.total
                                        }}
                                    </span>
                                </div>
                                <div class="progress" style="height: 8px">
                                    <div
                                        class="progress-bar bg-success"
                                        :style="{
                                            width: `${(downloadProgress.overall.completed / downloadProgress.overall.total) * 100}%`,
                                        }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="paperDetailsList.length > 1" class="d-flex justify-content-center gap-3">
                <button
                    @click="downloadAllPapers"
                    class="btn btn-primary"
                    :disabled="
                        isDownloadingAll ||
                        downloadProgress.overall.completed === downloadProgress.overall.total
                    "
                >
                    <span
                        v-if="isDownloadingAll"
                        class="spinner-border spinner-border-sm me-2"
                    ></span>
                    <i class="bi bi-download me-2"></i>
                    {{ downloadProgress.overall.completed > 0 ? 'Resume All' : 'Download All' }}
                </button>
                <router-link to="/dashboard/downloads" class="btn btn-outline-secondary">
                    <i class="bi bi-list-check me-2"></i>View Downloads
                </router-link>
            </div>
        </div>

        <!-- Papers Grid -->
        <div class="row g-4">
            <div v-for="paper in paperDetailsList" :key="paper.id" class="col-md-6">
                <div class="card border-0 shadow-sm h-100 hover-lift transition-all">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h3 class="card-title text-primary fw-bold mb-0">
                                <i class="bi bi-journal-text me-2"></i>{{ paper.title }}
                            </h3>
                            <span class="badge bg-success bg-opacity-10 text-success">
                                ${{ paper.price ?? 'Free' }}
                            </span>
                        </div>

                        <p class="text-muted mb-4">
                            {{ paper.description || 'No description available' }}
                        </p>

                        <ul class="list-unstyled small mb-4">
                            <li class="mb-2">
                                <i class="bi bi-folder me-2 text-muted"></i>
                                <span class="text-muted">Category:</span>
                                {{ paper.category?.name || '—' }}
                            </li>
                            <li class="mb-2">
                                <i class="bi bi-file-text me-2 text-muted"></i>
                                <span class="text-muted">Pages:</span> {{ paper.pages || '—' }}
                            </li>
                            <li>
                                <i class="bi bi-calendar me-2 text-muted"></i>
                                <span class="text-muted">Uploaded:</span>
                                {{ formatDate(paper.upload_date) }}
                            </li>
                        </ul>

                        <!-- Download Status Indicators -->
                        <div v-if="downloadProgress.papers[paper.id]" class="mb-3">
                            <div
                                class="d-flex justify-content-between align-items-center small text-muted mb-1"
                            >
                                <span>
                                    <span
                                        v-if="
                                            downloadProgress.papers[paper.id].status ===
                                            'downloading'
                                        "
                                    >
                                        Downloading...
                                    </span>
                                    <span
                                        v-else-if="
                                            downloadProgress.papers[paper.id].status === 'completed'
                                        "
                                    >
                                        Downloaded successfully
                                    </span>
                                    <span
                                        v-else-if="
                                            downloadProgress.papers[paper.id].status === 'error'
                                        "
                                    >
                                        Download failed
                                    </span>
                                    <span v-else> Ready to download </span>
                                </span>
                                <span v-if="downloadProgress.papers[paper.id].progress > 0">
                                    {{ Math.round(downloadProgress.papers[paper.id].progress) }}%
                                </span>
                            </div>
                            <div class="progress" style="height: 6px">
                                <div
                                    class="progress-bar"
                                    :class="{
                                        'bg-success':
                                            downloadProgress.papers[paper.id].status ===
                                            'completed',
                                        'bg-danger':
                                            downloadProgress.papers[paper.id].status === 'error',
                                        'bg-primary':
                                            downloadProgress.papers[paper.id].status ===
                                                'downloading' ||
                                            downloadProgress.papers[paper.id].status === 'pending',
                                    }"
                                    :style="{
                                        width: `${downloadProgress.papers[paper.id].progress}%`,
                                    }"
                                ></div>
                            </div>
                        </div>

                        <div class="d-flex flex-wrap gap-2">
                            <button
                                @click="downloadSinglePaper(paper.id)"
                                class="btn flex-grow-1"
                                :class="{
                                    'btn-success':
                                        downloadProgress.papers[paper.id]?.status !== 'completed',
                                    'btn-outline-success':
                                        downloadProgress.papers[paper.id]?.status === 'completed',
                                    disabled:
                                        downloadProgress.papers[paper.id]?.status === 'completed',
                                }"
                                :disabled="
                                    isDownloading === paper.id ||
                                    downloadProgress.papers[paper.id]?.status === 'completed'
                                "
                            >
                                <span
                                    v-if="isDownloading === paper.id"
                                    class="spinner-border spinner-border-sm me-2"
                                ></span>
                                <template
                                    v-else-if="
                                        downloadProgress.papers[paper.id]?.status === 'completed'
                                    "
                                >
                                    <i class="bi bi-check-circle-fill me-1"></i>Downloaded
                                </template>
                                <template v-else>
                                    <i class="bi bi-download me-1"></i>Download
                                </template>
                            </button>
                            <button
                                @click="openReviewModal(paper)"
                                class="btn btn-outline-primary flex-grow-1"
                                :disabled="
                                    downloadProgress.papers[paper.id]?.status !== 'completed'
                                "
                            >
                                <i class="bi bi-star me-1"></i>Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Download Complete Toast -->
        <div
            v-if="showDownloadCompleteToast"
            class="position-fixed bottom-0 end-0 p-3"
            style="z-index: 11"
        >
            <div class="toast show" role="alert">
                <div class="toast-header bg-success text-white">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    <strong class="me-auto">Download Complete</strong>
                    <button
                        type="button"
                        class="btn-close btn-close-white"
                        @click="showDownloadCompleteToast = false"
                    ></button>
                </div>
                <div class="toast-body">All papers have been downloaded successfully!</div>
            </div>
        </div>

        <!-- Review Modal -->
        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div
            v-if="showModal"
            class="modal fade show d-block"
            tabindex="-1"
            aria-modal="true"
            role="dialog"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header border-0">
                        <h5 class="modal-title fw-bold">Review Paper</h5>
                        <button type="button" class="btn-close" @click="closeReviewModal"></button>
                    </div>
                    <div class="modal-body">
                        <h6 class="mb-3 text-primary">{{ selectedPaper?.title }}</h6>

                        <div class="mb-4">
                            <label class="form-label fw-semibold">Rating</label>
                            <div class="star-rating">
                                <i
                                    v-for="n in 5"
                                    :key="n"
                                    class="bi me-2 fs-3"
                                    :class="{
                                        'bi-star-fill text-warning': reviewForm.rating >= n,
                                        'bi-star text-muted': reviewForm.rating < n,
                                    }"
                                    style="cursor: pointer"
                                    @click="reviewForm.rating = n"
                                ></i>
                                <span class="ms-2 text-muted small">
                                    {{ reviewForm.rating }} of 5 stars
                                </span>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-semibold">Your Review</label>
                            <textarea
                                v-model="reviewForm.comment"
                                class="form-control"
                                rows="4"
                                placeholder="Share your experience with this paper..."
                            ></textarea>
                        </div>

                        <div v-if="submissionError" class="alert alert-danger mb-4">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            {{ submissionError }}
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="closeReviewModal"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="btn btn-primary"
                                @click="submitReview"
                                :disabled="reviewForm.rating === 0 || isSubmittingReview"
                            >
                                <span
                                    v-if="isSubmittingReview"
                                    class="spinner-border spinner-border-sm me-2"
                                ></span>
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
            isSubmittingReview: false,
            submissionError: null,
            isDownloading: null,
            isDownloadingAll: false,
            showDownloadCompleteToast: false,
            downloadProgress: {
                overall: {
                    total: 0,
                    completed: 0,
                },
                papers: {},
            },
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

            try {
                const paperIds = idsQuery
                    .split(',')
                    .map((id) => parseInt(id.trim(), 10))
                    .filter(Boolean);

                // Initialize download progress tracking
                this.downloadProgress.overall.total = paperIds.length;
                this.downloadProgress.overall.completed = 0;

                paperIds.forEach((id) => {
                    this.$set(this.downloadProgress.papers, id, {
                        status: 'pending',
                        progress: 0,
                    });
                });

                const results = await Promise.all(
                    paperIds.map(async (id) => {
                        try {
                            return await this.fetchPaperById(id);
                        } catch {
                            return null;
                        }
                    }),
                );

                this.paperDetailsList = results.filter(Boolean);
                if (this.paperDetailsList.length === 0) {
                    this.errorMessage = 'No valid papers found.';
                }
            } catch (error) {
                console.error('Failed to load papers:', error);
                this.errorMessage = 'There was a problem fetching your downloads.';
                toast.error('Failed to load papers');
            } finally {
                this.isLoading = false;
            }
        },

        async downloadSinglePaper(paperId) {
            this.isDownloading = paperId;

            this.downloadProgress.papers[paperId] = {
                status: 'downloading',
                progress: 0,
            };

            try {
                // Simulate progress for demonstration (in real app, you'd use actual download progress events)
                const progressInterval = setInterval(() => {
                    if (this.downloadProgress.papers[paperId].progress < 90) {
                        this.downloadProgress.papers[paperId].progress += 10;
                    }
                }, 300);

                const fileUrl = await this.downloadPaperById(paperId);

                // Clear the interval and set to 100%
                clearInterval(progressInterval);
                this.downloadProgress.papers[paperId].progress = 100;
                this.downloadProgress.papers[paperId].status = 'completed';
                this.downloadProgress.overall.completed += 1;

                if (fileUrl) {
                    window.open(fileUrl, '_blank');
                    toast.success('Download completed successfully!');

                    // Show completion toast if all downloads are done
                    if (
                        this.downloadProgress.overall.completed ===
                        this.downloadProgress.overall.total
                    ) {
                        this.showDownloadCompleteToast = true;
                        setTimeout(() => {
                            this.showDownloadCompleteToast = false;
                        }, 5000);
                    }
                }
            } catch (error) {
                console.error('Download failed:', error);
                this.downloadProgress.papers[paperId].status = 'error';
                toast.error('Failed to download paper');
            } finally {
                this.isDownloading = null;
            }
        },

        async downloadAllPapers() {
            this.isDownloadingAll = true;
            try {
                for (const paper of this.paperDetailsList) {
                    // Skip already downloaded papers
                    if (this.downloadProgress.papers[paper.id]?.status !== 'completed') {
                        await this.downloadSinglePaper(paper.id);
                    }
                }
            } catch (error) {
                console.error('Batch download failed:', error);
                toast.error('Some downloads failed');
            } finally {
                this.isDownloadingAll = false;
            }
        },

        openReviewModal(paper) {
            this.selectedPaper = paper;
            this.showModal = true;
        },

        closeReviewModal() {
            this.showModal = false;
            this.reviewForm = { rating: 0, comment: '' };
            this.submissionError = null;
        },

        async submitReview() {
            if (!this.selectedPaper?.id) {
                this.submissionError = 'No paper selected for review';
                return;
            }

            this.isSubmittingReview = true;
            this.submissionError = null;

            try {
                await this.submitPaperReview({
                    paper: this.selectedPaper.id,
                    reviewData: this.reviewForm,
                });
                toast.success('Review submitted successfully!');
                this.closeReviewModal();
            } catch (error) {
                console.error('Review submission failed:', error);
                this.submissionError = error.response?.data?.message || 'Failed to submit review';
                toast.error('Review submission failed');
            } finally {
                this.isSubmittingReview = false;
            }
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('en-US', {
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
.success-animation {
    width: 100px;
    height: 100px;
    margin: 0 auto;
}

.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #28a745;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 0 auto;
    box-shadow: 0 0 0 rgba(40, 167, 69, 0.4);
    animation:
        fill 0.4s ease-in-out 0.4s forwards,
        scale 0.3s ease-in-out 0.9s both;
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes scale {
    0%,
    100% {
        transform: none;
    }
    50% {
        transform: scale3d(1.1, 1.1, 1);
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0 0 0 100px rgba(40, 167, 69, 0.1);
    }
}

.hover-lift {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
}

.star-rating {
    display: flex;
    align-items: center;
}

.modal-backdrop {
    z-index: 1040;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal {
    z-index: 1050;
}

.card {
    border-radius: 0.75rem;
}

.btn {
    border-radius: 0.5rem;
    padding: 0.5rem 1.25rem;
}

.toast {
    opacity: 1;
}
</style>
