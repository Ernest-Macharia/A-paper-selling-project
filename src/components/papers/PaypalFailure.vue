<!-- src/views/PaymentFailed.vue -->
<template>
    <div>
      <h1>Payment Failed</h1>
      <p v-if="loading">Processing failure details...</p>
      <p v-if="error" style="color: red;">{{ error }}</p>
      <p v-if="!loading && !error">
        Unfortunately, your payment could not be completed.
      </p>
      <button @click="retryPayment">Try Again</button>
      <button @click="contactSupport">Contact Support</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaypalFailure',
    data() {
      return {
        loading: true,
        error: null,
      };
    },
    mounted() {
      // You might want to check URL params or state to show specific failure reasons.
      // For example, get error codes or messages from query params if your backend redirects with them.
      
      // For now, just simulate async "processing" to show loading
      setTimeout(() => {
        this.loading = false;
        // Optionally set error from URL query param or other source here
        const query = new URLSearchParams(window.location.search);
        const errorMsg = query.get('error');
        if (errorMsg) {
          this.error = decodeURIComponent(errorMsg);
        }
      }, 1000);
    },
    methods: {
      retryPayment() {
        // Redirect back to your payment page or open payment modal again
        this.$router.push('/papers');
      },
      contactSupport() {
        // Redirect or open a support page/modal
        this.$router.push('/papers');
      }
    }
  };
  </script>
  