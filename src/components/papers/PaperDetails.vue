<template>
  <Navbar />
  <div class="container py-5">
    <div v-if="isLoading" class="text-center my-5">
      <span class="spinner-border text-primary" role="status"></span>
    </div>

    <div v-else class="paper-details-card shadow-lg rounded-4 p-5 mx-auto">
      <!-- Grid Layout for Sections -->
      <div class="grid-sections mb-4">
        <!-- Left Column -->
        <div class="section-column">
          <!-- Section: Paper Preview -->
          <section class="mb-4">
            <h4 class="section-title">Paper Preview</h4>
            <div v-if="showPreview" class="preview-container mb-3">
              <VPdfViewer
                :src="paperDetails.document_url"
                style="width: 100%; height: 600px;"
              />
            </div>
            <button
              class="btn btn-outline-primary w-100"
              @click="showPreview = !showPreview"
            >
              {{ showPreview ? 'Hide Preview' : 'View First 5 Pages' }}
            </button>
          </section>

          <!-- Section: Uploader -->
          <section class="mb-4 uploader-box p-3 rounded-3">
            <h5 class="mb-2">👤 Uploaded By</h5>
            <p class="mb-1"><strong>Name:</strong> {{ paperDetails.author_info?.name || 'Unknown' }}</p>
            <p class="mb-1"><strong>Email:</strong> {{ paperDetails.author_info?.email || 'Not provided' }}</p>
            <p><strong>Papers Sold:</strong> {{ paperDetails.author_info?.papers_sold || 0 }}</p>
          </section>
        </div>

        <!-- Right Column -->
        <div class="section-column">
          <!-- Section: Paper Details -->
          <section class="mb-4">
            <h4 class="section-title">📚 Paper Details</h4>
            <div class="info-grid">
              <div><strong>📝 Title:</strong> {{ paperDetails.title }}</div>
              <div><strong>📖 Description:</strong> {{ paperDetails.description }}</div>
              <div><strong>💰 Price:</strong> ${{ paperDetails.price }}</div>
              <div><strong>📅 Uploaded:</strong> {{ formatDate(paperDetails.upload_date) }}</div>
              <div><strong>📘 Course:</strong> {{ paperDetails.course.name || 'N/A' }}</div>
              <div><strong>🏷️ Category:</strong> {{ paperDetails.category.name || 'N/A' }}</div>
              <div><strong>📄 Pages:</strong> {{ paperDetails.pages || 'N/A' }}</div>
              <div><strong>⬇️ Downloads:</strong> {{ paperDetails.downloads }}</div>
              <div><strong>⭐ Reviews:</strong> {{ paperDetails.reviews || 'N/A' }} / 5</div>
              <div><strong>⏰ Last Updated:</strong> {{ formatDate(paperDetails.updated_at || paperDetails.upload_date) }}</div>
            </div>
          </section>
        </div>
      </div>

      <!-- Section: Action Buttons -->
      <section class="d-grid gap-3">
        <button class="btn btn-success btn-lg w-100" @click="showModal = true">
          🛒 Proceed to Payment
        </button>
        <button class="btn btn-outline-dark btn-lg w-100" @click="addToCart(paperDetails)">
          <i class="bi bi-cart-plus me-2"></i> Add to Cart
        </button>
      </section>
    </div>

    <PaymentModal
      :visible="showModal"
      :amount="paperDetails.price"
      @close="showModal = false"
    />
  </div>
</template>

<script>
import Navbar from '@/components/home/Navbar.vue';
import PaymentModal from '@/components/papers/PaymentModal.vue';
import { VPdfViewer } from '@vue-pdf-viewer/viewer';
import { mapActions } from 'vuex';

export default {
  name: 'PaperDetails',
  components: {
    Navbar,
    VPdfViewer,
    PaymentModal
  },
  data() {
    return {
      paperDetails: null,
      isLoading: true,
      showPreview: false,
      showModal: false
    };
  },
  methods: {
    ...mapActions('papers', ['fetchPaperById']),
    async fetchPaperDetails() {
      this.isLoading = true;
      try {
        const paperId = this.$route.params.id;
        this.paperDetails = await this.fetchPaperById(paperId);
      } catch (error) {
        console.error('Error fetching paper:', error);
      } finally {
        this.isLoading = false;
      }
    },
    addToCart(paper) {
      alert(`✅ "${paper.title}" has been added to your cart!`);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  },
  created() {
    this.fetchPaperDetails();
  }
};
</script>

<style scoped>
.paper-details-card {
  max-width: 900px;
  background: #fff;
  border: 1px solid #e5e5e5;
}

.section-title {
  font-weight: bold;
  font-size: 1.25rem;
  border-bottom: 2px solid #ccc;
  padding-bottom: 0.25rem;
  margin-bottom: 1rem;
  color: #5e60ce;
}

.preview-container {
  border: 2px dashed #5e60ce;
  padding: 10px;
  border-radius: 10px;
  background: #f3f4ff;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 0.95rem;
}

.uploader-box {
  background-color: #f9f9f9;
  border-left: 5px solid #5e60ce;
}

button.btn-lg {
  font-size: 1.1rem;
}

.grid-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.section-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.uploader-box {
  background-color: #f9f9f9;
  border-left: 4px solid #0d6efd;
}
</style>
