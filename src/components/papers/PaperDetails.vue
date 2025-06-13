<template>
  <Navbar />

  <div class="container py-5">
    <div v-if="isLoading" class="text-center my-5">
      <span class="spinner-border text-primary" role="status"></span>
    </div>

    <div v-else class="paper-details-card shadow-lg rounded-4 p-4 mx-auto border border-2 border-primary" style="max-width: 900px; background: #fefefe;">
      <!-- Grid Layout -->
      <div class="grid-sections mb-4">
        <!-- Left Column -->
        <div class="section-column">
          <!-- Paper Preview -->
          <section class="mb-4">
            <h4 class="section-title d-flex align-items-center gap-2 text-primary">
              <i class="fas fa-file-pdf"></i> Paper Preview
            </h4>
            <div v-if="showPreview" class="preview-container mb-3 rounded" style="border: 1px solid #ddd; overflow: hidden;">
              <VPdfViewer
                :src="paperDetails.document_url"
                style="width: 100%; height: 600px;"
              />
            </div>
            <button
              class="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2"
              @click="showPreview = !showPreview"
              :aria-expanded="showPreview"
              aria-controls="pdfPreview"
            >
              <i :class="showPreview ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              {{ showPreview ? 'Hide Preview' : 'View First 5 Pages' }}
            </button>
          </section>

          <!-- Uploader Info -->
          <section class="mb-4 uploader-box p-3 rounded-3 bg-light border border-secondary">
            <h5 class="mb-3 text-secondary d-flex align-items-center gap-2">
              <i class="fas fa-user-circle"></i> Uploaded By
            </h5>
            <p class="mb-1"><strong>Name:</strong> {{ paperDetails.author_info?.name || 'Unknown' }}</p>
            <p class="mb-1"><strong>Email:</strong> {{ paperDetails.author_info?.email || 'Not provided' }}</p>
            <p><strong>Papers Sold:</strong> {{ paperDetails.author_info?.papers_sold || 0 }}</p>
          </section>
        </div>

        <!-- Right Column -->
        <div class="section-column">
          <section class="mb-4">
            <h4 class="section-title d-flex align-items-center gap-2 text-primary">
              <i class="fas fa-info-circle"></i> Paper Details
            </h4>
            <div class="info-grid">
              <div><i class="fas fa-file-alt text-primary"></i> <strong>Title:</strong> {{ paperDetails.title }}</div>
              <div><i class="fas fa-align-left text-primary"></i> <strong>Description:</strong> {{ paperDetails.description }}</div>
              <div><i class="fas fa-dollar-sign text-success"></i> <strong>Price:</strong> ${{ paperDetails?.price }}</div>
              <div><i class="fas fa-calendar-alt text-secondary"></i> <strong>Uploaded:</strong> {{ formatDate(paperDetails.upload_date) }}</div>
              <div><i class="fas fa-book text-info"></i> <strong>Course:</strong> {{ paperDetails.course?.name || 'N/A' }}</div>
              <div><i class="fas fa-tags text-warning"></i> <strong>Category:</strong> {{ paperDetails.category?.name || 'N/A' }}</div>
              <div><i class="fas fa-file-word text-primary"></i> <strong>Pages:</strong> {{ paperDetails.pages || 'N/A' }}</div>
              <div><i class="fas fa-download text-info"></i> <strong>Downloads:</strong> {{ paperDetails.downloads }}</div>
              <div><i class="fas fa-star text-warning"></i> <strong>Reviews:</strong> {{ paperDetails.reviews || 'N/A' }} / 5</div>
              <div><i class="fas fa-clock text-secondary"></i> <strong>Last Updated:</strong> {{ formatDate(paperDetails.updated_at || paperDetails.upload_date) }}</div>
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
          :disabled="checkoutPapers.length === 0"
        >
          <i class="fas fa-shopping-cart"></i>
          View Cart ({{ checkoutPapers.length }})
        </button>
      </section>
    </div>

    <!-- Checkout Modal -->
    <CheckoutModal
      :visible="checkoutModalVisible"
      :payment-modal-visible="paymentModalVisible"
      :papers="checkoutPapers"
      @close="checkoutModalVisible = false"
      @proceed="openPaymentModal"
      @update:papers="checkoutPapers = $event"
      @continue-shopping="handleContinueShopping"
    />
  </div>
</template>

<script>
import Navbar from '@/components/home/Navbar.vue';
import { VPdfViewer } from '@vue-pdf-viewer/viewer';
import CheckoutModal from '@/components/papers/CheckoutModal.vue';
import { mapActions, mapGetters } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
  components: {
    Navbar,
    VPdfViewer,
    CheckoutModal,
  },
  data() {
    return {
      paperDetails: null,
      showPreview: false,
      isLoading: true,
      checkoutModalVisible: false,
      paymentModalVisible: false,
      checkoutPapers: [],
    };
  },

  created() {
    this.fetchPaperDetails();
    this.loadCheckoutPapers();
  },

  methods: {
    ...mapActions('papers', ['fetchPaperById']),
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

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },

    addToCheckout() {
      if (!this.paperDetails?.id) return;

      const exists = this.checkoutPapers.some(p => p.id === this.paperDetails.id);
      if (!exists) {
        // Create a new array to trigger reactivity
        this.checkoutPapers = [...this.checkoutPapers, this.paperDetails];

        // Save to localStorage
        this.saveCheckoutPapers();

        toast.success(`✅ "${this.paperDetails.title}" has been added to your cart!`);
      } else {
        toast.info(`"${this.paperDetails.title}" is already in your cart.`);
      }
    },

    openCheckoutModal() {
      if (this.checkoutPapers.length === 0) return;
      this.checkoutModalVisible = true;
    },

    handleContinueShopping() {
      this.checkoutModalVisible = false;
      this.$router.push("/papers");
    },

    loadCheckoutPapers() {
      const savedPapers = localStorage.getItem('checkoutPapers');
      if (savedPapers) {
        this.checkoutPapers = JSON.parse(savedPapers);
      }
    },
    saveCheckoutPapers() {
      localStorage.setItem('checkoutPapers', JSON.stringify(this.checkoutPapers));
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
</style>
