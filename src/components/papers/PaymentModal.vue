<template>
  <div v-show="visible" class="modal-backdrop">
    <div class="modal-content animate-fade">
      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="alert alert-success w-100 mb-3">
        Payment successful! Closing...
      </div>

      <!-- Error Message -->
      <div v-if="paymentError" class="alert alert-danger w-100 mb-3">
        {{ paymentError }}
      </div>

      <!-- Loading Spinner -->
      <div v-if="isProcessing" class="my-3">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Processing payment...
      </div>

      <!-- Payment Method Selection -->
      <div v-if="!selectedPaymentMethod && !isProcessing && !showSuccessMessage" class="payment-methods mt-3">
        <p>Select your preferred payment method:</p>

        <button class="btn btn-outline-primary w-100" @click="selectPaymentMethod('mpesa')">
          Pay with M-Pesa
        </button>

        <button class="btn btn-dark w-100 mt-3" @click="handleStripePayment">
          Pay with 💳 Stripe
        </button>
      </div>

      <!-- PayPal Button Container (always shown) -->
      <div id="paypal-button-container" class="my-3"></div>

      <!-- Close Button -->
      <button class="btn btn-danger mt-3" @click="handleClose" :disabled="isProcessing">
        Dismiss
      </button>
    </div>
  </div>

  <!-- M-Pesa Phone Modal -->
  <MpesaPhoneModal 
    v-if="selectedPaymentMethod === 'mpesa'" 
    :visible="selectedPaymentMethod === 'mpesa'"
    @close="closePhoneModal"
    @confirm="onMpesaConfirm"
  />
</template>

<script>
import { mapActions } from 'vuex';
import MpesaPhoneModal from '@/components/papers/MpesaPhoneModal.vue';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RTIWaReA2jsJqbBHslgQ6ToQrGYGJevwQk0sa7vRUFkQVaRQfdJU9FReZ9qShUx3XBFw2pCe8HqbyQdXb6dDm2e00Uc12H9UJ');

export default {
  name: 'PaymentModal',
  components: { MpesaPhoneModal },
  props: {
    visible: Boolean,
    amount: Number
  },
  data() {
    return {
      selectedPaymentMethod: null,
      paymentError: null,
      isProcessing: false,
      showSuccessMessage: false,
      paypalScriptLoaded: false
    };
  },

  watch: {
    visible(newVal) {
      if (newVal && !this.paypalScriptLoaded) {
        this.loadPaypalScript();
      } else if (!newVal) {
        this.resetModal();
      }
    }
  },

  methods: {
    ...mapActions('papers', [
      'initiateMpesaPayment',
      'createStripeSession'
    ]),

    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method;
    },

    normalizePhone(raw) {
      if (/^0\d{9}$/.test(raw)) return '254' + raw.slice(1);
      if (/^254\d{9}$/.test(raw)) return raw;
      throw new Error('Invalid Kenyan phone number');
    },

    async onMpesaConfirm(phoneNumber) {
      this.isProcessing = true;
      try {
        const normalized = this.normalizePhone(phoneNumber);
        const resp = await this.initiateMpesaPayment({
          phoneNumber: normalized,
          amount: this.amount
        });
        alert(resp.CustomerMessage || 'Check your phone for the payment prompt.');
        this.showSuccessThenClose();
      } catch (err) {
        this.paymentError = 'Failed to initiate M-Pesa payment.';
      } finally {
        this.isProcessing = false;
        this.closePhoneModal();
      }
    },

    async handleStripePayment() {
      this.isProcessing = true;
      try {
        const stripe = await stripePromise;
        const sessionId = await this.createStripeSession({
          amount: this.amount,
          title: 'Exam Paper Purchase'
        });
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) this.paymentError = error.message;
      } catch {
        this.paymentError = 'Stripe payment failed.';
      } finally {
        this.isProcessing = false;
      }
    },

    showSuccessThenClose() {
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.$emit('close');
        this.resetModal();
      }, 2000);
    },

    closePhoneModal() {
      this.selectedPaymentMethod = null;
    },

    handleClose() {
      if (!this.isProcessing) {
        this.$emit('close');
        this.resetModal();
      }
    },

    resetModal() {
      this.selectedPaymentMethod = null;
      this.paymentError = null;
      this.isProcessing = false;
      this.showSuccessMessage = false;
    },

    loadPaypalScript() {
      const vm = this;
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=Aclljz51mMGjt9kJ6QkH6Lag7bZ8iB8JxRIZ3n7H84hAcx7-iG4QxKazxDQNQ4wIR0mR0moOYDVwRUFu&currency=USD";
      script.onload = function() {
        vm.paypalScriptLoaded = true;
        vm.renderPaypalButton();
      };
      document.body.appendChild(script);
    },

    renderPaypalButton() {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: this.amount.toString()
                }
              }]
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              alert('Transaction completed by ' + details.payer.name.given_name);
              this.showSuccessThenClose();
            } catch (err) {
              this.paymentError = 'Error capturing PayPal payment.';
            }
          },
          onError: err => {
            this.paymentError = 'PayPal error: ' + err.message;
          }
        }).render('#paypal-button-container');
      }
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 350px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
}

.animate-fade {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.payment-methods button {
  margin: 0.5rem 0;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}
</style>
