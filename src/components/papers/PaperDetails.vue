<template>
    <Navbar />
    <div class="container py-4">
        <!-- Improved Breadcrumb -->
        <nav aria-label="breadcrumb" class="mt-3">
            <ol class="breadcrumb bg-light p-3 rounded-3">
                <li class="breadcrumb-item">
                    <router-link to="/papers" class="text-decoration-none">
                        <i class="fas fa-chevron-left me-2"></i>All Papers
                    </router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                    <i class="fas fa-file-alt me-2"></i>Paper Details
                </li>
            </ol>
        </nav>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center my-5 py-5">
            <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading paper details...</p>
        </div>

        <!-- Main Content -->
        <div v-else class="paper-details-container">
            <!-- Paper Card -->
            <div class="card shadow-lg border-primary mb-4">
                <div class="card-header bg-primary text-white">
                    <h3 class="mb-0">
                        <i class="fas fa-file-alt me-2"></i>{{ paperDetails.title }}
                    </h3>
                </div>

                <div class="card-body">
                    <!-- Grid Layout -->
                    <div class="row g-4">
                        <!-- Left Column -->
                        <div class="col-lg-5">
                            <!-- Paper Preview Section -->
                            <div class="mb-4">
                                <h4 class="section-title text-primary mb-3">
                                    <i class="fas fa-file me-2"></i>Paper Preview
                                </h4>
                                <div class="preview-thumbnail mb-3 text-center">
                                    <!-- PDF icon with responsive sizing -->
                                    <div class="pdf-icon-placeholder mb-3">
                                        <i
                                            class="fas fa-file text-danger"
                                            style="font-size: clamp(3rem, 8vw, 5rem)"
                                        ></i>
                                    </div>

                                    <!-- Preview container with multiple fallback options -->
                                    <div class="preview-content mb-2">
                                        <!-- Try PDF first if available -->
                                        <object
                                            v-if="paperDetails.preview_url"
                                            :data="paperDetails.preview_url"
                                            type="application/pdf"
                                            class="preview-object"
                                            @error="handlePdfError"
                                        >
                                            <img
                                                v-if="paperDetails.preview_image"
                                                :src="paperDetails.preview_image"
                                                alt="Document preview"
                                                class="img-fluid preview-image"
                                            />
                                        </object>

                                        <img
                                            v-else-if="paperDetails.preview_image"
                                            :src="paperDetails.preview_image"
                                            alt="Document preview"
                                            class="img-fluid preview-image"
                                        />
                                    </div>

                                    <!-- Preview button with enhanced states -->
                                    <button
                                        class="btn w-100 d-flex justify-content-center align-items-center gap-2 preview-btn"
                                        @click="showPreviewModal = true"
                                        :disabled="!hasPreview"
                                        :class="{
                                            'btn-primary': hasPreview,
                                            'btn-outline-secondary': !hasPreview,
                                            'btn-sm': windowWidth < 768,
                                        }"
                                    >
                                        <i
                                            class="fas"
                                            :class="hasPreview ? 'fa-eye' : 'fa-ban'"
                                        ></i>
                                        {{
                                            hasPreview
                                                ? windowWidth < 768
                                                    ? 'Preview'
                                                    : 'View Preview'
                                                : 'Preview Not Available'
                                        }}
                                    </button>

                                    <!-- Watermark notice -->
                                    <!-- <div v-if="paperDetails.preview_url" class="text-muted small mt-2">
                                        <i class="fas fa-water me-1"></i> Preview contains watermark
                                    </div> -->
                                </div>
                            </div>

                            <!-- Uploader Info -->
                            <div class="uploader-info card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title text-secondary mb-3">
                                        <i class="fas fa-user-circle me-2"></i> Uploaded By
                                    </h5>
                                    <div class="d-flex align-items-center mb-3">
                                        <div class="avatar me-3">
                                            <i class="fas fa-user fa-2x text-primary"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">
                                                {{ paperDetails.author_info?.name || 'Unknown' }}
                                            </h6>
                                            <small class="text-muted"
                                                >Uploaded
                                                {{ formatDate(paperDetails.upload_date) }}</small
                                            >
                                        </div>
                                    </div>

                                    <!-- Chat Button -->
                                    <div
                                        v-if="
                                            userDetails &&
                                            paperDetails.author_info &&
                                            userDetails.id !== paperDetails.author_info.id
                                        "
                                    >
                                        <button
                                            class="btn btn-outline-primary w-100"
                                            @click="showChatModal = true"
                                        >
                                            <i class="fas fa-comments me-2"></i> Message Author
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column -->
                        <div class="col-lg-7">
                            <!-- Paper Details -->
                            <div class="paper-details">
                                <h4 class="section-title text-primary mb-3">
                                    <i class="fas fa-info-circle me-2"></i> Paper Details
                                </h4>

                                <div class="table-responsive">
                                    <table class="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted" width="30%">
                                                    <i class="fas fa-align-left me-2"></i
                                                    >Description:
                                                </td>
                                                <td>
                                                    {{ trimmedDescription }}
                                                    <button
                                                        class="btn btn-link p-0 ps-2 text-primary"
                                                        @click="showDescriptionModal = true"
                                                    >
                                                        Read More
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">
                                                    <i class="fas fa-dollar-sign me-2"></i>Price:
                                                </td>
                                                <td>
                                                    <span class="badge bg-success"
                                                        >${{ paperDetails?.price }}</span
                                                    >
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">
                                                    <i class="fas fa-book me-2"></i>Course:
                                                </td>
                                                <td>{{ paperDetails.course?.name || 'N/A' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">
                                                    <i class="fas fa-tags me-2"></i>Category:
                                                </td>
                                                <td>{{ paperDetails.category?.name || 'N/A' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">
                                                    <i class="fas fa-file-word me-2"></i>Pages:
                                                </td>
                                                <td>{{ paperDetails.pages || 'N/A' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">
                                                    <i class="fas fa-download me-2"></i>Downloads:
                                                </td>
                                                <td>{{ paperDetails.download_count || 'N/A' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">
                                                    <i class="fas fa-star me-2"></i>Rating:
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="rating me-2">
                                                            <i
                                                                v-for="i in 5"
                                                                :key="i"
                                                                class="fas fa-star"
                                                                :class="{
                                                                    'text-warning':
                                                                        i <=
                                                                        Math.round(
                                                                            paperDetails.average_rating,
                                                                        ),
                                                                    'text-light':
                                                                        i >
                                                                        Math.round(
                                                                            paperDetails.average_rating,
                                                                        ),
                                                                }"
                                                            ></i>
                                                        </div>
                                                        <span
                                                            >{{
                                                                paperDetails.average_rating.toFixed(
                                                                    1,
                                                                ) || 'N/A'
                                                            }}
                                                            / 5</span
                                                        >
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">
                                                    <i class="fas fa-clock me-2"></i>Last Updated:
                                                </td>
                                                <td>
                                                    {{
                                                        formatDate(
                                                            paperDetails.updated_at ||
                                                                paperDetails.upload_date,
                                                        )
                                                    }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons d-flex gap-3 mt-4">
                        <button
                            class="btn btn-primary flex-grow-1 d-flex justify-content-center align-items-center gap-2 py-2"
                            @click="addToCheckout"
                        >
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button
                            class="btn btn-success flex-grow-1 d-flex justify-content-center align-items-center gap-2 py-2"
                            @click="openCheckoutModal"
                            :disabled="cartCount === 0"
                        >
                            <i class="fas fa-shopping-cart"></i>
                            <span class="d-none d-sm-inline">View Cart</span>
                            <span>({{ cartCount }})</span>
                        </button>
                        <button
                            class="btn btn-danger flex-grow-1 d-flex justify-content-center align-items-center gap-2 py-2"
                            @click="showCopyrightModal = true"
                        >
                            <i class="fas fa-flag"></i> Report Copyright
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chat Modal -->
        <div
            class="modal fade"
            :class="{ show: showChatModal }"
            v-if="showChatModal"
            tabindex="-1"
            style="display: block; background-color: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-primary text-white">
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="showChatModal = false"
                        ></button>
                    </div>
                    <div class="modal-body p-0">
                        <UserChatBox
                            :recipient-id="paperDetails.author_info.id"
                            :recipient-name="paperDetails.author_info.name"
                            :current-user-id="userDetails.id"
                            :current-user-name="userDetails.name"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div
            class="modal fade"
            :class="{ show: showCopyrightModal }"
            v-if="showCopyrightModal"
            style="display: block; background-color: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-flag me-2"></i> Report Copyright Violation
                        </h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="showCopyrightModal = false"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitCopyrightReport">
                            <div class="mb-3">
                                <label for="reason" class="form-label">Reason for report</label>
                                <select
                                    class="form-select"
                                    id="reason"
                                    v-model="report.reason"
                                    required
                                >
                                    <option value="" disabled>Select a reason</option>
                                    <option value="copyright">Copyright infringement</option>
                                    <option value="plagiarism">Plagiarism</option>
                                    <option value="unauthorized">Unauthorized distribution</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="details" class="form-label">Additional details</label>
                                <textarea
                                    class="form-control"
                                    id="details"
                                    rows="4"
                                    v-model="report.details"
                                    placeholder="Please provide any additional information that might help us investigate..."
                                    required
                                ></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="contact" class="form-label"
                                    >Your email (optional)</label
                                >
                                <input
                                    type="email"
                                    class="form-control"
                                    id="contact"
                                    v-model="report.contact_email"
                                    placeholder="Enter your email if you'd like to be contacted"
                                />
                            </div>
                            <div class="d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    @click="showCopyrightModal = false"
                                >
                                    Cancel
                                </button>
                                <button type="submit" class="btn btn-danger" @click="submitReport">
                                    <i class="fas fa-paper-plane me-2"></i> Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Checkout Modal -->
        <CheckoutModal
            :visible="checkoutModalVisible"
            :payment-modal-visible="paymentModalVisible"
            :papers="cartItems"
            @close="checkoutModalVisible = false"
            @update:papers="cartItems = $event"
            @continue-shopping="handleContinueShopping"
        />

        <!-- PDF Preview Modal -->
        <div
            class="modal fade"
            :class="{ show: showPreviewModal }"
            v-if="showPreviewModal"
            style="display: block; background-color: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-file-pdf me-2"></i> Paper Preview
                        </h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="showPreviewModal = false"
                        ></button>
                    </div>
                    <div class="modal-body p-0" style="height: 80vh">
                        <PDFPreview
                            v-if="!isMobileDevice && paperDetails.preview_url"
                            :src="paperDetails.preview_url"
                            :visible="showPreviewModal"
                        />
                        <img
                            v-else-if="paperDetails.preview_image"
                            :src="paperDetails.preview_image"
                            alt="Document preview"
                            class="img-fluid h-100 w-100"
                            style="object-fit: contain"
                        />
                    </div>
                    <div class="modal-footer bg-light">
                        <button class="btn btn-secondary" @click="showPreviewModal = false">
                            <i class="fas fa-times me-2"></i>Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Full Description Modal -->
        <div
            class="modal fade"
            :class="{ show: showDescriptionModal }"
            v-if="showDescriptionModal"
            style="display: block; background-color: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-align-left me-2"></i> Full Description
                        </h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="showDescriptionModal = false"
                        ></button>
                    </div>
                    <div class="modal-body" style="max-height: 60vh; overflow-y: auto">
                        <div class="description-content p-3">
                            <p style="white-space: pre-line">{{ paperDetails.description }}</p>
                        </div>
                    </div>
                    <div class="modal-footer bg-light">
                        <button class="btn btn-secondary" @click="showDescriptionModal = false">
                            <i class="fas fa-times me-2"></i>Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '@/components/home/Navbar.vue';
import CheckoutModal from '@/components/papers/CheckoutModal.vue';
import { mapActions, mapGetters } from 'vuex';
import { toast } from 'vue3-toastify';
import PDFPreview from '@/components/papers/PDFPreview.vue';
import UserChatBox from '@/components/chat/UserChatBox.vue';

export default {
    components: {
        Navbar,
        CheckoutModal,
        PDFPreview,
        UserChatBox,
    },
    data() {
        return {
            paperDetails: null,
            showPreviewModal: false,
            isLoading: true,
            checkoutModalVisible: false,
            paymentModalVisible: false,
            showDescriptionModal: false,
            userDetails: null,
            showChatModal: false,
            showCopyrightModal: false,
            report: {
                reason: '',
                details: '',
                contact_email: '',
                paper_id: null,
            },
            windowWidth: window.innerWidth,
        };
    },

    async created() {
        await Promise.all([this.fetchPaperDetails(), this.loadUserDetails()]);
    },

    computed: {
        ...mapGetters('payment', ['cartItems', 'cartCount']),
        trimmedDescription() {
            const desc = this.paperDetails?.description || '';
            return desc.length > 300 ? desc.slice(0, 300) + '…' : desc;
        },
        hasPreview() {
            return this.paperDetails?.preview_url || this.paperDetails?.preview_image;
        },
        isMobileDevice() {
            return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
        },
    },

    methods: {
        ...mapActions('papers', ['fetchPaperById']),
        ...mapActions('authentication', ['fetchCurrentUserDetails']),
        ...mapActions('communications', ['submitCopyrightReport']),
        async fetchPaperDetails() {
            try {
                const paperId = this.$route.params.id;
                this.paperDetails = await this.fetchPaperById(paperId);
            } catch (error) {
                console.error('Error fetching paper:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async loadUserDetails() {
            try {
                const user = await this.fetchCurrentUserDetails();
                this.userDetails = user;
            } catch {
                this.userDetails = null;
            }
        },

        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },

        addToCheckout() {
            if (!this.paperDetails?.id) return;

            const exists = this.cartItems.some((p) => p.id === this.paperDetails.id);

            if (!exists) {
                this.$store.commit('payment/ADD_TO_CART', this.paperDetails);
                toast.success(`✅ "${this.paperDetails.title}" has been added to your cart!`);
            } else {
                toast.info(`"${this.paperDetails.title}" is already in your cart.`);
            }
        },

        openCheckoutModal() {
            if (this.cartCount === 0) return;
            this.checkoutModalVisible = true;
        },

        handleContinueShopping() {
            this.checkoutModalVisible = false;
            this.$router.push('/papers');
        },

        async submitReport() {
            try {
                const reportData = {
                    paper_id: this.paperDetails.id,
                    reason: this.report.reason,
                    details: this.report.details,
                    contact_email: this.report.contact_email,
                };

                await this.submitCopyrightReport(reportData);

                toast.success('Thank you for your report. We will investigate this matter.');
                this.showCopyrightModal = false;
                this.resetReportForm();
            } catch (error) {
                console.error('Error submitting copyright report:', error);
                toast.error(
                    error.response?.data?.message ||
                        'Failed to submit report. Please try again later.',
                );
            }
        },
        resetReportForm() {
            this.report = {
                reason: '',
                details: '',
                contact_email: '',
                paper_id: null,
            };
        },
    },
};
</script>

<style scoped>
.paper-details-container {
    max-width: 1200px;
    margin: 0 auto;
}

.card {
    border-radius: 0.75rem;
    overflow: hidden;
    border: none;
}

.card-header {
    padding: 1.5rem;
    border-bottom: none;
}

.card-body {
    padding: 2rem;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(13, 110, 253, 0.2);
}

.uploader-info {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
}

.avatar {
    width: 50px;
    height: 50px;
    background-color: #e9f5ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-object {
    width: 100%;
    height: 400px;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
}

.preview-image {
    max-height: 400px;
    width: auto;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
}

.preview-fallback {
    padding: 2rem;
    text-align: center;
    color: #6c757d;
}

.preview-thumbnail {
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 2px dashed #dee2e6;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.pdf-icon-placeholder {
    color: #e74c3c; /* Red color similar to PDF icons */
    margin: 0 auto;
    width: fit-content;
}

/* Add to your existing styles */
.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
}

.btn-danger:hover {
    background-color: #bb2d3b;
    border-color: #b02a37;
}

.copyright-report-form .form-label {
    font-weight: 500;
    color: #495057;
}

.copyright-report-form .form-control,
.copyright-report-form .form-select {
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid #ced4da;
}

.copyright-report-form .form-control:focus,
.copyright-report-form .form-select:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.table td {
    padding: 0.75rem 0.5rem;
    vertical-align: middle;
}

.table tr:not(:last-child) td {
    border-bottom: 1px solid #eee;
}

.rating {
    color: #e9ecef;
}

.description-content {
    background-color: #f8f9fa;
    border-radius: 0.5rem;
}

.action-buttons {
    max-width: 600px;
    margin: 0 auto;
}

.btn {
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;
    min-height: 48px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
    transform: translateY(0);
}

.btn i {
    font-size: 1.1rem;
}

/* Modal animations */
.modal.fade {
    transition: opacity 0.3s linear;
}

.modal.fade:not(.show) {
    opacity: 0;
}

.modal.fade .modal-dialog {
    transition: transform 0.3s ease-out;
    transform: translate(0, -50px);
}

.modal.fade.show .modal-dialog {
    transform: none;
}

@media (max-width: 768px) {
    .action-buttons {
        flex-direction: column;
        gap: 1rem;
    }

    .btn {
        width: 100%;
    }
}

@media (max-width: 576px) {
    .btn {
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
    }

    .btn i {
        font-size: 1rem;
    }
}
</style>
