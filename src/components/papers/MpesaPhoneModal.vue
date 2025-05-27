<template>
    <div v-if="visible" class="modal-backdrop">
      <div class="modal-content animate-fade">
        <p>Enter your M-Pesa phone number:</p>
        <input
          v-model="phoneNumber"
          type="text"
          placeholder="Enter phone number"
          class="form-control"
          @input="validatePhoneNumber"
        />
        <button
          class="btn btn-success mt-2 w-100"
          :disabled="!isPhoneValid"
          @click="confirmPayment"
        >
          Confirm M-Pesa Payment
        </button>
        <button class="btn btn-danger mt-2 w-100" @click="closeModal">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MpesaPhoneModal',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        phoneNumber: '',
        isPhoneValid: false
      };
    },
    methods: {
      validatePhoneNumber() {
        const phonePattern = /^[0-9]{10}$/;
        this.isPhoneValid = phonePattern.test(this.phoneNumber);
      },
      confirmPayment() {
        this.$emit('confirm', this.phoneNumber);
      },
      closeModal() {
        this.onClose(); // Emit close event to parent
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
  
  button {
    margin-top: 10px;
  }
  
  input {
    width: 100%;
    margin-top: 10px;
  }
  </style>
  