<template>
    <div v-show="visible" class="modal-backdrop">
        <div class="modal-content animate-fade">
            <!-- Success Message -->
            <div v-if="showSuccessMessage" class="payment-success-message">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4BB543"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h4>Payment Successful!</h4>
                <p>Your transaction was completed successfully.</p>
            </div>

            <!-- Error Message -->
            <div v-if="paymentError" class="payment-error-message">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h4>Payment Failed</h4>
                <p>{{ paymentError }}</p>
                <button class="retry-btn" @click="paymentError = null">Try Again</button>
            </div>

            <!-- Loading State -->
            <div v-if="isProcessing" class="payment-processing">
                <div class="spinner">
                    <div class="double-bounce1"></div>
                    <div class="double-bounce2"></div>
                </div>
                <h4>Processing Payment</h4>
                <p>Please wait while we process your transaction</p>
            </div>

            <!-- Payment Method Selection -->
            <div v-if="!selectedPaymentMethod && !isProcessing && !showSuccessMessage">
                <div class="payment-header">
                    <h3>Complete Payment</h3>
                    <p class="payment-amount">Total Amount: ${{ amount.toFixed(2) }}</p>
                </div>

                <div class="payment-methods">
                    <p class="methods-title">Select payment method:</p>

                    <!-- Stripe Card Payment -->
                    <button class="payment-btn stripe-btn" @click="handleStripePayment">
                        <div class="btn-icon">
                            <svg
                                viewBox="0 0 38 24"
                                xmlns="http://www.w3.org/2000/svg"
                                role="img"
                                width="38"
                                height="24"
                            >
                                <path
                                    fill="#6772E5"
                                    d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                                ></path>
                                <path
                                    fill="#FFF"
                                    d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                                ></path>
                                <path
                                    fill="#6772E5"
                                    d="M11 9c0-2.8 2.2-5 5-5s5 2.2 5 5c0 .6-.4 1-1 1s-1-.4-1-1c0-1.7-1.3-3-3-3s-3 1.3-3 3 1.3 3 3 3c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4c0-.6.4-1 1-1s1 .4 1 1c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2c-2.2 0-4-1.8-4-4z"
                                ></path>
                            </svg>
                        </div>
                        <div class="btn-content">
                            <span class="btn-title">Credit/Debit Card</span>
                            <span class="btn-subtitle">Visa, Mastercard, Amex</span>
                        </div>
                        <div class="btn-arrow">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </button>

                    <!-- PayPal Payment -->
                    <button class="payment-btn paypal-btn" @click="handlePaypalPayment">
                        <div class="btn-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="38"
                                height="24"
                            >
                                <path
                                    fill="#253B80"
                                    d="M7.3 17.1h1.5l.5-3.2c.1-.4.4-.6.8-.6h1.1c3.5 0 5.6-1.7 6-4.6.2-1.4 0-2.5-.6-3.2C15.7 5 14.4 5 13 5H7.7c-.4 0-.7.3-.8.7L5 17.1c0 .4.3.7.7.7h1.6z"
                                ></path>
                                <path
                                    fill="#179BD7"
                                    d="M19.4 8.3c-.4 2.9-2.5 4.6-6 4.6h-1.1c-.4 0-.7.2-.8.6l-.6 3.7-.1.5h-1.5c-.4 0-.7.3-.7.7v.2l.4 2.4v.1c0 .4.3.7.7.7h1.3l.1-.7.7-4.5v-.3c0-.4.3-.7.8-.7h1.6c3.1 0 5.5-1.3 6.1-4.3.2-1.3.1-2.4-.4-3.1-.3-.4-.9-.6-1.7-.6"
                                ></path>
                                <path
                                    fill="#222D65"
                                    d="M9.3 8.1H7.8c-.4 0-.7.3-.8.7L5 17.1c0 .4.3.7.7.7h1.6l.5-3.2c.1-.4.4-.6.8-.6h1.1c3.5 0 5.6-1.7 6-4.6.2-1.4 0-2.5-.6-3.2-.7-.7-2-1.1-4.4-1.1zm.3 1.2c.1 0 .2 0 .3.1 1.3.3 2.3.8 2.8 1.6.3.5.4 1.1.3 1.8-.3 2.1-1.9 3.2-4.8 3.2H8.2l.4-2.5c0-.3.3-.6.6-.6h1.4z"
                                ></path>
                                <path
                                    fill="#253B80"
                                    d="M15.2 8.2c-.1-.1-.2-.1-.3-.1-1.3-.3-2.3-.8-2.8-1.6-.3-.5-.4-1.1-.3-1.8.1-.6.3-1.1.6-1.5.4-.4.9-.7 1.5-.8h4.9c.4 0 .7.3.7.7v.6l-1 6.2c-.1.4-.4.6-.8.6h-1.1c-.4 0-.7-.2-.8-.6l-.1-.5-.6-3.7v-.3c0-.1-.1-.2-.1-.3"
                                ></path>
                                <path
                                    fill="#179BD7"
                                    d="M18.9 4.1h-4.9c-.6.1-1.1.4-1.5.8-.3.4-.5.9-.6 1.5-.1.7 0 1.3.3 1.8.5.8 1.5 1.3 2.8 1.6.1 0 .2.1.3.1h1.1c.4 0 .7-.2.8-.6l.6-3.7v-.3c0-.4-.3-.7-.7-.7h-.8z"
                                ></path>
                            </svg>
                        </div>
                        <div class="btn-content">
                            <span class="btn-title">PayPal</span>
                            <span class="btn-subtitle">Pay with PayPal balance or card</span>
                        </div>
                        <div class="btn-arrow">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Close Button -->
            <button v-if="!isProcessing" class="close-btn" @click="handleClose">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Close
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
// import MpesaPhoneModal from '@/components/papers/MpesaPhoneModal.vue';
import { toast } from 'vue3-toastify';

export default {
    name: 'PaymentModal',
    // components: { MpesaPhoneModal },
    props: {
        visible: Boolean,
        amount: Number,
        cartItems: Array,
        paperIds: Array,
    },
    data() {
        return {
            selectedPaymentMethod: null,
            paymentError: null,
            isProcessing: false,
            showSuccessMessage: false,
        };
    },

    computed: {
        selectedPaperIds() {
            return this.cartItems.map((p) => p?.id).filter((id) => id != null);
        },
    },

    methods: {
        ...mapActions('payment', [
            'initiateMpesaPayment',
            'createStripeSession',
            'createPaypalSession',
        ]),

        selectPaymentMethod(method) {
            this.selectedPaymentMethod = method;
        },

        normalizePhone(raw) {
            if (/^0\d{9}$/.test(raw)) return '254' + raw.slice(1);
            if (/^254\d{9}$/.test(raw)) return raw;
            toast.error('Invalid phone number');
        },

        async onMpesaConfirm(phoneNumber) {
            this.isProcessing = true;
            try {
                const normalized = this.normalizePhone(phoneNumber);
                await this.initiateMpesaPayment({
                    phoneNumber: normalized,
                    amount: parseFloat(this.amount),
                });
                toast.success(
                    'M-Pesa payment initiated. Please check your phone for the payment prompt.',
                );
                this.showSuccessThenClose();
            } catch {
                this.paymentError = 'Failed to initiate M-Pesa payment.';
                toast.error('Failed to initiate M-Pesa payment.');
            } finally {
                this.isProcessing = false;
                this.closePhoneModal();
            }
        },

        async handleStripePayment() {
            this.isProcessing = true;
            try {
                const checkoutUrl = await this.createStripeSession({
                    paperIds: this.selectedPaperIds,
                });
                window.location.href = checkoutUrl;
            } catch {
                this.paymentError = 'Stripe payment failed.';
                toast.error('Stripe payment failed.');
            } finally {
                this.isProcessing = false;
            }
        },

        async handlePaypalPayment() {
            this.isProcessing = true;
            try {
                const paypalUrl = await this.createPaypalSession({
                    paperIds: this.selectedPaperIds,
                });
                window.location.href = paypalUrl;
            } catch (err) {
                this.paymentError = 'PayPal payment failed.';
                toast.error('PayPal payment failed.');
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
    },
};
</script>

<style scoped>
/* Base Modal Styles */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    width: 420px;
    max-width: 90%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    position: relative;
}

.animate-fade {
    animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Payment Header */
.payment-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.payment-header h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
}

.payment-amount {
    font-size: 1.8rem;
    font-weight: 700;
    color: #4a6bdf;
    margin: 0;
}

/* Payment Methods */
.payment-methods {
    margin-top: 1.5rem;
}

.methods-title {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
    text-align: center;
}

.payment-btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
}

.payment-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    border-color: #d0d0d0;
}

.payment-btn:active {
    transform: translateY(0);
}

.btn-icon {
    width: 40px;
    display: flex;
    justify-content: center;
    margin-right: 1rem;
}

.btn-content {
    flex: 1;
}

.btn-title {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.2rem;
}

.btn-subtitle {
    display: block;
    font-size: 0.8rem;
    color: #777;
}

.btn-arrow {
    color: #999;
}

/* Specific Button Styles */
.stripe-btn {
    border-left: 4px solid #6772e5;
}

.stripe-btn:hover {
    border-color: #6772e5;
}

.paypal-btn {
    border-left: 4px solid #253b80;
}

.paypal-btn:hover {
    border-color: #253b80;
}

/* Status Messages */
.payment-success-message,
.payment-error-message,
.payment-processing {
    text-align: center;
    padding: 1.5rem 0;
}

.payment-success-message svg,
.payment-error-message svg {
    margin-bottom: 1rem;
}

.payment-success-message h4 {
    color: #4bb543;
    margin-bottom: 0.5rem;
}

.payment-error-message h4 {
    color: #ff3333;
    margin-bottom: 0.5rem;
}

.payment-processing h4 {
    color: #4a6bdf;
    margin-bottom: 0.5rem;
}

/* Spinner Animation */
.spinner {
    width: 50px;
    height: 50px;
    position: relative;
    margin: 0 auto 1rem;
}

.double-bounce1,
.double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #4a6bdf;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
    animation-delay: -1s;
}

@keyframes sk-bounce {
    0%,
    100% {
        transform: scale(0);
    }
    50% {
        transform: scale(1);
    }
}

/* Close Button */
.close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.8rem;
    margin-top: 1.5rem;
    background: transparent;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    color: #666;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: #f8f8f8;
    color: #333;
}

.retry-btn {
    margin-top: 1rem;
    padding: 0.6rem 1.5rem;
    background: #4a6bdf;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
}

.retry-btn:hover {
    background: #3a5bd9;
}
</style>
