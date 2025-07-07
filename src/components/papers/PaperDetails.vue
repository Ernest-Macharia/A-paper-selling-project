<template>
    <Navbar />
    <div class="container py-5">
        <nav class="container mt-3" aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/papers">All Papers</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Paper Details</li>
            </ol>
        </nav>

        <div v-if="isLoading" class="text-center my-5">
            <span class="spinner-border text-primary" role="status"></span>
        </div>

        <div
            v-else
            class="paper-details-card shadow-lg rounded-4 p-4 mx-auto border border-2 border-primary"
            style="max-width: 900px; background: #fefefe"
        >
            <!-- Grid Layout -->
            <div class="grid-sections mb-4">
                <!-- Left Column -->
                <div class="section-column">
                    <!-- Paper Preview -->
                    <section class="mb-4">
                        <h4 class="section-title d-flex align-items-center gap-2 text-primary">
                            <i class="fas fa-file-pdf"></i> Paper Preview
                        </h4>
                        <button
                            class="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2"
                            @click="paperDetails.preview_url && (showPreviewModal = true)"
                            :disabled="!paperDetails.preview_url"
                        >
                            <i class="fas fa-eye"></i> View Preview
                        </button>
                    </section>

                    <!-- Uploader Info -->
                    <section
                        class="mb-4 uploader-box p-3 rounded-3 bg-light border border-secondary"
                    >
                        <h5 class="mb-3 text-secondary d-flex align-items-center gap-2">
                            <i class="fas fa-user-circle"></i> Uploaded By
                        </h5>
                        <p class="mb-1">
                            <strong>Name:</strong> {{ paperDetails.author_info?.name || 'Unknown' }}
                        </p>
                        <p class="mb-1">
                            <strong>Email:</strong>
                            {{ paperDetails.author_info?.email || 'Not provided' }}
                        </p>
                        <p>
                            <strong>Papers Sold:</strong>
                            {{ paperDetails.author_info?.papers_sold || 0 }}
                        </p>

                        <!-- Show chat button only if the viewer is not the uploader -->
                        <div
                            v-if="
                                userDetails &&
                                paperDetails.author_info &&
                                userDetails.id !== paperDetails.author_info.id
                            "
                        >
                            <button
                                class="btn btn-outline-primary btn-sm mt-2"
                                @click="showChatModal = true"
                            >
                                <i class="fas fa-comments"></i> Message
                                {{ paperDetails.author_info.name }}
                            </button>
                        </div>
                    </section>
                </div>

                <!-- Right Column -->
                <div class="section-column">
                    <section class="mb-4">
                        <h4 class="section-title d-flex align-items-center gap-2 text-primary">
                            <i class="fas fa-info-circle"></i> Paper Details
                        </h4>
                        <div class="info-grid">
                            <div>
                                <i class="fas fa-file-alt text-primary"></i> <strong>Title:</strong>
                                {{ paperDetails.title }}
                            </div>
                            <div>
                                <i class="fas fa-align-left text-primary"></i>
                                <strong>Description:</strong>
                                <div class="text-muted mt-1">
                                    {{ trimmedDescription }}
                                    <button
                                        class="btn btn-link p-0 ps-1"
                                        @click="showDescriptionModal = true"
                                    >
                                        Read More
                                    </button>
                                </div>
                            </div>

                            <div>
                                <i class="fas fa-dollar-sign text-success"></i>
                                <strong>Price:</strong> ${{ paperDetails?.price }}
                            </div>
                            <div>
                                <i class="fas fa-calendar-alt text-secondary"></i>
                                <strong>Uploaded:</strong>
                                {{ formatDate(paperDetails.upload_date) }}
                            </div>
                            <div>
                                <i class="fas fa-book text-info"></i> <strong>Course:</strong>
                                {{ paperDetails.course?.name || 'N/A' }}
                            </div>
                            <div>
                                <i class="fas fa-tags text-warning"></i> <strong>Category:</strong>
                                {{ paperDetails.category?.name || 'N/A' }}
                            </div>
                            <div>
                                <i class="fas fa-file-word text-primary"></i>
                                <strong>Pages:</strong> {{ paperDetails.pages || 'N/A' }}
                            </div>
                            <div>
                                <i class="fas fa-download text-info"></i>
                                <strong>Downloads:</strong>
                                {{ paperDetails.download_count || 'N/A' }}
                            </div>
                            <div>
                                <i class="fas fa-star text-warning"></i> <strong>Reviews:</strong>
                                {{ paperDetails.average_rating.toFixed(1) || 'N/A' }} / 5
                            </div>
                            <div>
                                <i class="fas fa-clock text-secondary"></i>
                                <strong>Last Updated:</strong>
                                {{
                                    formatDate(paperDetails.updated_at || paperDetails.upload_date)
                                }}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Action Buttons -->
            <section class="d-grid gap-3">
                <button
                    class="btn btn-primary btn-lg d-flex justify-content-center align-items-center gap-2"
                    @click="addToCheckout"
                >
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button
                    class="btn btn-success btn-lg d-flex justify-content-center align-items-center gap-2"
                    @click="openCheckoutModal"
                    :disabled="cartCount.length === 0"
                >
                    <i class="fas fa-shopping-cart"></i> View Cart ({{ cartCount }})
                </button>
            </section>
        </div>

        <!-- Chat Modal -->
        <div
            class="modal fade show"
            v-if="showChatModal"
            tabindex="-1"
            role="dialog"
            style="display: block; background-color: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog modal-dialog-scrollable modal-md" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chat with {{ paperDetails.author_info.name }}</h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="showChatModal = false"
                        ></button>
                    </div>
                    <div class="modal-body">
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
            class="modal fade show d-block"
            v-if="showPreviewModal"
            style="background-color: rgba(0, 0, 0, 0.5)"
            tabindex="-1"
            role="dialog"
        >
            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                <div class="modal-content border-0 rounded-4 overflow-hidden">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fas fa-file-pdf"></i> Paper Preview</h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="showPreviewModal = false"
                        ></button>
                    </div>
                    <div class="modal-body p-0" style="height: 80vh">
                        <PDFPreview :src="paperDetails.preview_url" :visible="showPreviewModal" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Full Description Modal -->
        <div
            v-if="showDescriptionModal"
            class="modal fade show d-block"
            style="background-color: rgba(0, 0, 0, 0.5)"
            tabindex="-1"
            role="dialog"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content border-0 rounded-4 overflow-hidden">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-align-left me-2"></i> Full Description
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="showDescriptionModal = false"
                        ></button>
                    </div>
                    <div class="modal-body" style="max-height: 60vh; overflow-y: auto">
                        <p class="text-muted" style="white-space: pre-line">
                            {{ paperDetails.description }}
                        </p>
                    </div>
                    <div class="modal-footer bg-light">
                        <button class="btn btn-secondary" @click="showDescriptionModal = false">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '@/components/home/Navbar.vue';
// import { VPdfViewer } from '@vue-pdf-viewer/viewer';
import CheckoutModal from '@/components/papers/CheckoutModal.vue';
import { mapActions, mapGetters } from 'vuex';
import { toast } from 'vue3-toastify';
import PDFPreview from '@/components/papers/PDFPreview.vue';
import UserChatBox from '@/components/chat/UserChatBox.vue';

export default {
    components: {
        Navbar,
        // VPdfViewer,
        CheckoutModal,
        PDFPreview,
        UserChatBox,
    },
    data() {
        return {
            paperDetails: null,
            showPreview: false,
            showPreviewModal: false,
            isLoading: true,
            checkoutModalVisible: false,
            paymentModalVisible: false,
            showDescriptionModal: false,
            userDetails: null,
            showChatModal: false,
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
    },

    methods: {
        ...mapActions('papers', ['fetchPaperById']),
        ...mapActions('authentication', ['fetchCurrentUserDetails']),
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
                toast.error('Error fetching user details.');
            }
        },

        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString();
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
    },
};
</script>

<style scoped>
.grid-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.section-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.info-grid {
    display: grid;
    gap: 0.8rem;
    font-size: 1rem;
    color: #444;
}

.section-column {
    display: flex;
    flex-direction: column;
}

.uploader-box {
    background-color: #f9fafb;
    border-radius: 0.5rem;
}

button[disabled] {
    cursor: not-allowed !important;
    opacity: 0.65 !important;
}

.btn-lg {
    font-weight: 600;
    font-size: 1.1rem;
}

.preview-container {
    border-radius: 0.5rem;
    box-shadow: 0 0 15px rgb(0 0 0 / 0.1);
    background: white;
}

.modal.fade {
    animation: fadeIn 0.3s ease-in-out;
}

.modal {
    display: block;
    z-index: 1050;
}

.modal-backdrop {
    display: none;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
