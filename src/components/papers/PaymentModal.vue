<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-content animate-fade">
      <!-- Payment Method Selection -->
      <div v-if="!selectedPaymentMethod" class="payment-methods mt-3">
        <p>Select your preferred payment method:</p>

        <button class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                @click="selectPaymentMethod('mpesa')">
          Pay with M-Pesa
        </button>
        <button class="btn btn-outline-secondary w-100 mt-2"
                @click="selectPaymentMethod('paypal')">
          Pay with PayPal
        </button>
        <button class="btn btn-dark w-100 mt-3" @click="handleStripePayment">
          Pay with 💳 Stripe
        </button>
      </div>

      <!-- Close Button -->
      <button class="btn btn-danger mt-3" @click="$emit('close')">Dismiss</button>
    </div>
  </div>

  <!-- M-Pesa Phone Number Modal -->
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
  components: {
    MpesaPhoneModal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      selectedPaymentMethod: null,
      paymentError: null
    };
  },
  mounted() {
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=Aclljz51mMGjt9kJ6QkH6Lag7bZ8iB8JxRIZ3n7H84hAcx7-iG4QxKazxDQNQ4wIR0mR0moOYDVwRUFu&currency=USD";
      script.async = true;
      script.onload = () => {
        if (this.selectedPaymentMethod === 'paypal') {
          this.initiatePaypalPayment();
        }
      };
      document.head.appendChild(script);
    }
  },
  methods: {
    ...mapActions('papers', [
      'initiateMpesaPayment',
      'createPaypalOrder',
      'capturePaypalOrder',
      'createStripeSession'
    ]),

    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method;

      if (method === 'paypal') {
        this.initiatePaypalPayment();
      }
    },

    normalizePhone(raw) {
      if (/^0\d{9}$/.test(raw)) return '254' + raw.slice(1);
      if (/^254\d{9}$/.test(raw)) return raw;
      throw new Error('Invalid Kenyan phone number');
    },

    async onMpesaConfirm(phoneNumber) {
      const normalized = this.normalizePhone(phoneNumber);
      try {
        const resp = await this.initiateMpesaPayment({
          phoneNumber: normalized,
          amount: this.amount
        });
        alert(resp.CustomerMessage || 'Check your phone for the payment prompt.');
      } catch (err) {
        console.error(err);
        alert('Failed to initiate M-Pesa payment.');
      } finally {
        this.closePhoneModal();
      }
    },

    async initiatePaypalPayment() {
      try {
        const { orderID } = await this.createPaypalOrder({ amount: this.amount });

        if (window.paypal) {
          window.paypal
            .Buttons({
              createOrder: async () => {
                return orderID; // fixed: async function returns Promise
              },
              onApprove: async (data) => {
                try {
                  await this.capturePaypalOrder({
                    orderID: data.orderID,
                    payerID: data.payerID
                  });
                  this.paymentError = null;
                  this.$router.push('/payment-success');
                } catch (err) {
                  console.error('Capture failed:', err);
                  this.paymentError = 'Payment capture failed. Please try again.';
                }
              },
              onError: (err) => {
                console.error('PayPal error:', err);
                this.paymentError = 'Payment failed. Redirecting...';
                setTimeout(() => {
                  this.$router.push('/payment-failure');
                }, 3000);
              }
            })
            .render('#paypal-button-container');
        } else {
          alert('PayPal SDK not loaded.');
        }
      } catch (error) {
        console.error('PayPal payment initiation failed:', error);
        this.paymentError = 'Failed to start PayPal payment.';
      }
    },

    async handleStripePayment() {
      try {
        const stripe = await stripePromise;
        const sessionId = await this.createStripeSession({
          amount: this.amount,
          title: 'Exam Paper Purchase'
        });
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) console.error(error.message);
      } catch (err) {
        alert('Error starting Stripe payment.');
      }
    },

    closePhoneModal() {
      this.selectedPaymentMethod = null;
    },

    openPaypalInfo() {
      window.open(
        'https://www.paypal.com/webapps/mpp/paypal-popup',
        'WIPaypal',
        'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1060,height=700'
      );
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
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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

.paypal-logo img {
  max-width: 100%;
  height: auto;
}
</style>
