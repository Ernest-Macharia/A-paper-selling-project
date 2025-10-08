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
                    <!-- <button class="payment-btn stripe-btn" @click="handleStripePayment">
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
                    </button> -->

                    <!-- Paystack Payment -->
                    <!-- <button class="payment-btn paystack-btn" @click="handlePaystackPayment">
                        <div class="btn-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                width="38"
                                height="24"
                            >
                                <path
                                    fill="#0A0A0A"
                                    d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 448c-105.9 0-192-86.1-192-192S150.1 64 256 64s192 86.1 192 192-86.1 192-192 192z"
                                />
                                <path
                                    fill="#0A0A0A"
                                    d="M256 128c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128zm0 208c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"
                                />
                            </svg>
                        </div>
                        <div class="btn-content">
                            <span class="btn-title">Paystack</span>
                            <span class="btn-subtitle">Cards, Bank Transfer, USSD</span>
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
                    </button> -->

                    <!-- PayPal Payment -->
                    <button class="payment-btn paypal-btn" @click="handlePaypalPayment">
                        <div class="btn-icon">
                            <!-- PayPal official logo (cleaner, scalable) -->
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="38"
                                height="24"
                                viewBox="0 0 32 32"
                                fill="none"
                            >
                                <path
                                    fill="#253B80"
                                    d="M10.2 25.8h2l.6-3.9c.1-.5.4-.8.9-.8h1.4c4.4 0 7.1-2.1 7.7-5.8.3-1.8 0-3.1-.7-4C21.2 9.7 19.6 9 17.7 9h-6c-.5 0-.9.4-1 .9l-2.6 15.6c-.1.4.2.8.7.8z"
                                />
                                <path
                                    fill="#179BD7"
                                    d="M26 12.1c-.5 3.7-3.2 5.8-7.7 5.8h-1.4c-.5 0-.8.3-.9.8l-.7 4.7-.1.6H13c-.5 0-.9.4-.9.9v.2l.5 3c.1.5.4.9.9.9h1.7l.1-.9.9-5.7v-.3c0-.5.4-.9.9-.9h2c3.9 0 7-1.6 7.7-5.4.2-1.6.1-3-.5-3.9-.4-.6-1.1-.8-2-.8z"
                                />
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
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    <!-- IntaSend Payment -->
                    <button class="payment-btn intasend-btn" @click="handleIntasendPayment">
                        <div class="btn-icon" aria-hidden="true">
                            <!-- Inline credit-card SVG (brand-neutral) -->
                            <svg
                                width="38"
                                height="24"
                                viewBox="0 0 64 40"
                                xmlns="http://www.w3.org/2000/svg"
                                role="img"
                                aria-label="Credit card"
                            >
                                <rect
                                    x="1"
                                    y="1"
                                    width="62"
                                    height="38"
                                    rx="6"
                                    fill="#ffffff"
                                    stroke="#d1d8df"
                                />
                                <rect x="1" y="6" width="62" height="8" rx="4" fill="#f3fafc" />
                                <rect x="8" y="12" width="10" height="8" rx="1.2" fill="#e8eef3" />
                                <rect
                                    x="9.6"
                                    y="13.6"
                                    width="6"
                                    height="5"
                                    rx="0.8"
                                    fill="#cdd6dd"
                                />
                                <rect x="22" y="14" width="28" height="3" rx="1" fill="#dfe8ef" />
                                <rect x="22" y="19" width="18" height="3" rx="1" fill="#e9f0f5" />
                            </svg>
                        </div>

                        <div class="btn-content">
                            <span class="btn-title">Card Payment</span>
                            <span class="btn-subtitle">Pay with Card(Visa/)</span>
                        </div>

                        <div class="btn-arrow">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.6"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect x="1.5" y="4.5" width="21" height="15" rx="2.5"></rect>
                                <line x1="1.5" y1="9.5" x2="22.5" y2="9.5"></line>
                            </svg>
                        </div>
                    </button>

                    <!-- Pesapal Payment -->
                    <!-- <button class="payment-btn pesapal-btn" @click="handlePesapalPayment">
                        <div class="btn-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="38" height="24">
                                <path fill="#253B80" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/>
                                <path fill="#253B80" d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                                <path fill="#253B80" d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                            </svg>
                        </div>
                        <div class="btn-content">
                            <span class="btn-title">Pesapal</span>
                            <span class="btn-subtitle">Pay with card or mobile money</span>
                        </div>
                        <div class="btn-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </button> -->
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
            'createPaystackSession',
            'createPesapalSession',
            'createIntasendSession',
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

        async handleIntasendPayment() {
            this.isProcessing = true;
            try {
                const checkoutUrl = await this.createIntasendSession({
                    paperIds: this.selectedPaperIds,
                });
                window.location.href = checkoutUrl;
            } catch (error) {
                this.paymentError = 'IntaSend payment failed.';
                toast.error('IntaSend payment failed.');
                console.error(error);
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

        async handlePaystackPayment() {
            this.isProcessing = true;
            try {
                const checkoutUrl = await this.createPaystackSession({
                    paperIds: this.selectedPaperIds,
                });
                window.location.href = checkoutUrl;
            } catch (err) {
                console.error('Paystack error:', err);
                this.paymentError = 'Paystack payment failed.';
                toast.error('Paystack payment failed.');
            } finally {
                this.isProcessing = false;
            }
        },

        async handlePesapalPayment() {
            this.isProcessing = true;
            try {
                const pesapalUrl = await this.createPesapalSession({
                    paperIds: this.selectedPaperIds,
                });
                window.location.href = pesapalUrl;
            } catch (err) {
                console.error('Pesapal error:', err);
                this.paymentError = 'Pesapal payment failed.';
                toast.error('Pesapal payment failed.');
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

/* Make icons uniform and sharp */
.payment-btn .btn-icon svg {
    display: block;
    width: 38px;
    height: 24px;
}

/* Align titles and subtitles neatly */
.payment-btn .btn-content {
    flex: 1;
    line-height: 1.2;
}

/* PayPal brand feel */
.paypal-btn {
    border-left: 4px solid #253b80;
}
.paypal-btn:hover {
    background: #f8fbff;
    border-color: #179bd7;
}

/* IntaSend brand-neutral style */
.intasend-btn {
    border-left: 4px solid #4a6bdf;
}
.intasend-btn:hover {
    background: #f5f7ff;
    border-color: #3a5bd9;
}

/* Slight hover animation on arrow */
.payment-btn:hover .btn-arrow svg {
    transform: translateX(4px);
    transition: transform 0.15s ease;
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

.paystack-btn {
    border-left: 4px solid #0a0a0a;
}

.paystack-btn:hover {
    border-color: #0a0a0a;
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
