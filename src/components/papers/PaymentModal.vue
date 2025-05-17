<template>
    <div v-if="visible" class="modal-backdrop">
      <div class="modal-content animate-fade">
    
        <!-- Payment Method Selection -->
        <div class="payment-methods mt-3">
          <p>Select your preferred payment method:</p>
          <button class="btn btn-outline-primary w-100" @click="selectPaymentMethod('mpesa')">
            Pay with M-Pesa
          </button>
          <button class="btn btn-outline-secondary w-100 mt-2" @click="selectPaymentMethod('paypal')">
            Pay with PayPal
          </button>
        </div>
    
        <!-- Close Button -->
        <button class="btn btn-danger mt-2" @click="$emit('close')">Dismiss</button>
      </div>
    </div>
    
    <!-- M-Pesa Phone Number Modal -->
    <MpesaPhoneModal 
      v-if="selectedPaymentMethod === 'mpesa'" 
      :visible="selectedPaymentMethod === 'mpesa'" 
      :on-close="closePhoneModal" 
      :on-confirm="initiateMpesaPayment" 
    />
  </template>
  
  <script>
  import MpesaPhoneModal from '@/components/papers/MpesaPhoneModal.vue';
  
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
      message: { 
        type: String, 
        default: "Your paper was uploaded successfully!" 
      }
    },
    data() {
      return {
        selectedPaymentMethod: null
      };
    },
    methods: {
      selectPaymentMethod(method) {
        // Set selected payment method and close the parent modal
        this.selectedPaymentMethod = method;
        this.$emit('close'); // Close the payment selection modal
  
        // For PayPal, directly initiate payment, no further modal
        if (method === 'paypal') {
          this.initiatePaypalPayment();
        }
      },
      initiateMpesaPayment(phoneNumber) {
        if (!phoneNumber) {
          alert('Please enter a valid phone number for M-Pesa.');
          return;
        }
        // Implement M-Pesa payment initiation logic here
        alert(`Initiating M-Pesa payment with phone number: ${phoneNumber}`);
        // Close the modal after payment is initiated
        this.$emit('close');
      },
      initiatePaypalPayment() {
        // Redirect to PayPal for payment
        window.open('https://www.paypal.com/signin', '_blank');
        // Close the modal after initiating PayPal
        this.$emit('close');
      },
      closePhoneModal() {
        this.selectedPaymentMethod = null; // Close the M-Pesa phone number modal
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
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .animate-fade {
    animation: fadeIn 0.4s ease forwards;
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  .payment-methods button {
    margin: 0.5rem 0;
  }
  
  </style>
  