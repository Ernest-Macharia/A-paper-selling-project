<template>
    <Navbar />
    <div class="container py-3 py-md-4">
        <!-- Improved Breadcrumb -->
        <nav aria-label="breadcrumb" class="mt-2 mt-md-3">
            <ol class="breadcrumb bg-light p-2 p-md-3 rounded-3">
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
                <div class="card-header bg-primary text-white py-2 py-md-3">
                    <h3 class="mb-0 h5 h4-md">
                        <i class="fas fa-file-alt me-2"></i>{{ paperDetails.title }}
                    </h3>
                </div>

                <div class="card-body p-2 p-md-3">
                    <!-- Grid Layout -->
                    <div class="row g-3 g-md-4">
                        <!-- Left Column -->
                        <div class="col-lg-5">
                            <!-- Paper Preview Section -->
                            <div class="mb-3 mb-md-4">
                                <h4 class="section-title text-primary mb-2 mb-md-3 h5">
                                    <i class="fas fa-file me-2"></i>Paper Preview
                                </h4>
                                <div class="preview-thumbnail mb-2 mb-md-3 text-center">
                                    <!-- PDF icon with responsive sizing -->
                                    <div class="pdf-icon-placeholder mb-2 mb-md-3">
                                        <i
                                            class="fas fa-file text-danger"
                                            style="font-size: clamp(2rem, 8vw, 5rem)"
                                        ></i>
                                    </div>

                                    <!-- Preview container with multiple fallback options -->
                                    <div class="preview-content mb-1 mb-md-2">
                                        <!-- Try PDF first if available -->
                                        <img
                                            v-if="isMobileDevice || !paperDetails.preview_url"
                                            :src="paperDetails.preview_image"
                                            alt="Document preview"
                                            class="img-fluid preview-image"
                                            style="max-height: 300px"
                                        />

                                        <!-- Desktop with PDF viewer -->
                                        <object
                                            v-else
                                            :data="paperDetails.preview_url"
                                            type="application/pdf"
                                            class="preview-object w-100"
                                            style="height: 300px"
                                        >
                                            <img
                                                v-if="paperDetails.preview_image"
                                                :src="paperDetails.preview_image"
                                                alt="Document preview"
                                                class="img-fluid preview-image"
                                                style="max-height: 300px"
                                            />
                                        </object>
                                    </div>

                                    <!-- Preview button with enhanced states -->
                                    <button
                                        class="btn w-100 d-flex justify-content-center align-items-center gap-1 gap-md-2 preview-btn py-2"
                                        @click="showPreviewModal = true"
                                        :disabled="!hasPreview"
                                        :class="{
                                            'btn-primary': hasPreview,
                                            'btn-outline-secondary': !hasPreview,
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
                                </div>
                            </div>

                            <!-- Uploader Info -->
                            <div class="uploader-info card mb-3 mb-md-4">
                                <div class="card-body p-2 p-md-3">
                                    <h5 class="card-title text-secondary mb-2 mb-md-3 h6">
                                        <i class="fas fa-user-circle me-2"></i> Uploaded By
                                    </h5>
                                    <div class="d-flex align-items-center mb-2 mb-md-3">
                                        <div class="avatar me-2 me-md-3">
                                            <i
                                                class="fas fa-user text-primary"
                                                style="font-size: 1.5rem"
                                            ></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0 small">
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
                                            class="btn btn-outline-primary w-100 py-2"
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
                                <h4 class="section-title text-primary mb-2 mb-md-3 h5">
                                    <i class="fas fa-info-circle me-2"></i> Paper Details
                                </h4>

                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted" width="30%">
                                                    <i class="fas fa-align-left me-2"></i
                                                    >Description:
                                                </td>
                                                <td>
                                                    <span class="small">{{
                                                        trimmedDescription
                                                    }}</span>
                                                    <button
                                                        class="btn btn-link p-0 ps-2 text-primary small"
                                                        @click="showDescriptionModal = true"
                                                    >
                                                        Read More
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted small">
                                                    <i class="fas fa-dollar-sign me-2"></i>Price:
                                                </td>
                                                <td class="small">
                                                    <span class="badge bg-success"
                                                        >${{ paperDetails?.price }}</span
                                                    >
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted small">
                                                    <i class="fas fa-book me-2"></i>Course:
                                                </td>
                                                <td class="small">
                                                    {{ paperDetails.course?.name || 'N/A' }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted small">
                                                    <i class="fas fa-tags me-2"></i>Category:
                                                </td>
                                                <td class="small">
                                                    {{ paperDetails.category?.name || 'N/A' }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted small">
                                                    <i class="fas fa-file-word me-2"></i>Pages:
                                                </td>
                                                <td class="small">
                                                    {{ paperDetails.pages || 'N/A' }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted small">
                                                    <i class="fas fa-download me-2"></i>Downloads:
                                                </td>
                                                <td class="small">
                                                    {{ paperDetails.download_count || 'N/A' }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted small">
                                                    <i class="fas fa-star me-2"></i>Rating:
                                                </td>
                                                <td class="small">
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
                                                <td class="text-muted small">
                                                    <i class="fas fa-clock me-2"></i>Last Updated:
                                                </td>
                                                <td class="small">
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
                    <div class="action-buttons d-flex flex-wrap gap-2 gap-md-3 mt-3 mt-md-4">
                        <button
                            class="btn btn-primary flex-grow-1 d-flex justify-content-center align-items-center gap-1 gap-md-2 py-2"
                            @click="addToCheckout"
                        >
                            <i class="fas fa-cart-plus"></i>
                            <span class="d-none d-sm-inline">Add to Cart</span>
                        </button>
                        <button
                            class="btn btn-success flex-grow-1 d-flex justify-content-center align-items-center gap-1 gap-md-2 py-2"
                            @click="openCheckoutModal"
                            :disabled="cartCount === 0"
                        >
                            <i class="fas fa-shopping-cart"></i>
                            <span class="d-none d-sm-inline">View Cart</span>
                            <span>({{ cartCount }})</span>
                        </button>
                        <button
                            class="btn btn-danger flex-grow-1 d-flex justify-content-center align-items-center gap-1 gap-md-2 py-2"
                            @click="showCopyrightModal = true"
                        >
                            <i class="fas fa-flag"></i>
                            <span class="d-none d-sm-inline">Report</span>
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
                    <div class="modal-header bg-primary text-white py-2 py-md-3">
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
                    <div class="modal-header bg-danger text-white py-2 py-md-3">
                        <h5 class="modal-title h6 h5-md">
                            <i class="fas fa-flag me-2"></i> Report Copyright Violation
                        </h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="showCopyrightModal = false"
                        ></button>
                    </div>
                    <div class="modal-body p-2 p-md-3">
                        <form @submit.prevent="submitCopyrightReport">
                            <div class="mb-2 mb-md-3">
                                <label for="reason" class="form-label small"
                                    >Reason for report</label
                                >
                                <select
                                    class="form-select form-select-sm"
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
                            <div class="mb-2 mb-md-3">
                                <label for="details" class="form-label small"
                                    >Additional details</label
                                >
                                <textarea
                                    class="form-control form-control-sm"
                                    id="details"
                                    rows="3"
                                    v-model="report.details"
                                    placeholder="Please provide any additional information that might help us investigate..."
                                    required
                                ></textarea>
                            </div>
                            <div class="mb-2 mb-md-3">
                                <label for="contact" class="form-label small"
                                    >Your email (optional)</label
                                >
                                <input
                                    type="email"
                                    class="form-control form-control-sm"
                                    id="contact"
                                    v-model="report.contact_email"
                                    placeholder="Enter your email if you'd like to be contacted"
                                />
                            </div>
                            <div class="d-flex justify-content-end gap-1 gap-md-2">
                                <button
                                    type="button"
                                    class="btn btn-secondary btn-sm"
                                    @click="showCopyrightModal = false"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="btn btn-danger btn-sm"
                                    @click="submitReport"
                                >
                                    <i class="fas fa-paper-plane me-1 me-md-2"></i> Submit
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
                    <div class="modal-header bg-primary text-white py-2 py-md-3">
                        <h5 class="modal-title h6 h5-md">
                            <i class="fas fa-file-pdf me-2"></i> Paper Preview
                        </h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="showPreviewModal = false"
                        ></button>
                    </div>
                    <div class="modal-body p-0" style="height: 70vh">
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
                    <div class="modal-footer bg-light py-2">
                        <button class="btn btn-secondary btn-sm" @click="showPreviewModal = false">
                            <i class="fas fa-times me-1 me-md-2"></i>Close
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
                    <div class="modal-header bg-primary text-white py-2 py-md-3">
                        <h5 class="modal-title h6 h5-md">
                            <i class="fas fa-align-left me-2"></i> Full Description
                        </h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            @click="showDescriptionModal = false"
                        ></button>
                    </div>
                    <div class="modal-body" style="max-height: 60vh; overflow-y: auto">
                        <div class="description-content p-2 p-md-3">
                            <p style="white-space: pre-line" class="small">
                                {{ paperDetails.description }}
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer bg-light py-2">
                        <button
                            class="btn btn-secondary btn-sm"
                            @click="showDescriptionModal = false"
                        >
                            <i class="fas fa-times me-1 me-md-2"></i>Close
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
        window.addEventListener('resize', this.handleResize);
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
    },

    computed: {
        ...mapGetters('payment', ['cartItems', 'cartCount']),
        trimmedDescription() {
            const desc = this.paperDetails?.description || '';
            return desc.length > 200 ? desc.slice(0, 200) + '…' : desc;
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

        handleResize() {
            this.windowWidth = window.innerWidth;
        },

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
    border-radius: 0.5rem;
    overflow: hidden;
    border: none;
}

.card-header {
    padding: 0.75rem 1rem;
    border-bottom: none;
}

.card-body {
    padding: 1rem;
}

.section-title {
    font-size: 1.1rem;
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
    width: 40px;
    height: 40px;
    background-color: #e9f5ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-object {
    width: 100%;
    height: 300px;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
}

.preview-image {
    max-height: 300px;
    width: auto;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
}

.preview-thumbnail {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px dashed #dee2e6;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.pdf-icon-placeholder {
    color: #e74c3c;
    margin: 0 auto;
    width: fit-content;
}

.table td {
    padding: 0.5rem;
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

.action-buttons .btn {
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s ease;
    min-height: 40px;
    padding: 0.5rem;
    flex: 1 0 120px;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn i {
    font-size: 0.9rem;
}

/* Responsive adjustments */
@media (min-width: 768px) {
    .card-header {
        padding: 1rem 1.5rem;
    }

    .card-body {
        padding: 1.5rem;
    }

    .section-title {
        font-size: 1.25rem;
    }

    .action-buttons .btn {
        font-size: 1rem;
        min-height: 48px;
        padding: 0.75rem;
    }

    .btn i {
        font-size: 1rem;
    }

    .avatar {
        width: 50px;
        height: 50px;
    }
}

@media (min-width: 992px) {
    .preview-object,
    .preview-image {
        height: 350px;
        max-height: 350px;
    }
}

/* Modal adjustments for mobile */
.modal-body {
    padding: 1rem;
}

.modal-header,
.modal-footer {
    padding: 0.75rem 1rem;
}

@media (min-width: 768px) {
    .modal-body {
        padding: 1.5rem;
    }

    .modal-header,
    .modal-footer {
        padding: 1rem 1.5rem;
    }
}
</style>
