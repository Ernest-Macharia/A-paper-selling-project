<template>
    <Navbar />
    <div class="container py-5">
      <div v-if="isLoading" class="text-center my-5">
        <span class="spinner-border text-primary" role="status"></span>
      </div>
  
      <div v-else class="paper-details-card shadow-lg p-4 rounded-4 mx-auto">
        <button class="btn btn-primary" @click="showPreview = true">
          📄 Preview Document
        </button>
        <div v-if="paperDetails">
          <div v-if="showPreview" class="paper-preview mb-4 d-flex align-items-center justify-content-center">
            <VPdfViewer :src="paperDetails.document_url" style="width: 100%; height: 600px;" />
          </div>
          <h2 class="text-gradient mb-3">{{ paperDetails.title }}</h2>
          <p class="mb-3">{{ paperDetails.description }}</p>
          <p><strong>💰 Price:</strong> ${{ paperDetails.price }}</p>
          <p><strong>📅 Uploaded on:</strong> {{ formatDate(paperDetails.upload_date) }}</p>
          <p><strong>💾 Downloads:</strong> {{ paperDetails.downloads }}</p>
          <p><strong>⭐ Reviews:</strong> {{ paperDetails.reviews || 'N/A' }} / 5</p>
          
        <button class="btn btn-success mt-4 w-100" @click="showModal = true">Proceed to Payment</button>
        </div>
        <router-link
            class="btn btn-outline-success mt-4 w-100 d-flex align-items-center justify-content-center"
            to="/register"
            >
            <i class="bi bi-cart-plus me-2"></i> Add to Cart
        </router-link>
      </div>
      <PaymentModal 
        :visible="showModal" 
        @close="showModal = false" 
        message="Your paper was uploaded successfully!"
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
          this.paperDetails= await this.fetchPaperById(paperId);
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
          day: 'numeric',
        });
      },
    },
    created() {
      this.fetchPaperDetails();
    }
  };
  </script>
  
  <style scoped>
  .text-gradient {
    background: linear-gradient(45deg, #6a11cb, #2575fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .paper-details-card {
    max-width: 600px;
    background: white;
  }
  
  .paper-preview {
    background: linear-gradient(135deg, #8e44ad, #3498db);
    color: white;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }
  
  .preview-text {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .modal {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-dialog {
    max-width: 90%;
  }
</style>
  