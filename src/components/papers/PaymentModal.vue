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
                <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                >
                </span>
                Processing payment...
            </div>

            <!-- Payment Method Selection -->
            <div
                v-if="!selectedPaymentMethod && !isProcessing && !showSuccessMessage"
                class="payment-methods mt-3"
            >
                <p>Select your preferred payment method:</p>

                <!-- <button class="btn btn-success w-100 py-3 d-flex align-items-center justify-content-center gap-2 mt-3" @click="handleMpesaPayment">
                    <i class="fas fa-mobile-alt fa-lg"></i> Pay with M-Pesa
                </button> -->

                <!-- Stripe -->
                <button
                    class="btn btn-dark w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                    @click="handleStripePayment"
                >
                    <i class="fab fa-cc-stripe fa-lg"></i> Credit or Debit Card
                </button>

                <!-- PayPal -->
                <button
                    class="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 mt-3"
                    @click="handlePaypalPayment"
                >
                    <i class="fab fa-cc-paypal fa-lg"></i> PayPal
                </button>
            </div>

            <!-- Close Button -->
            <button class="btn btn-danger mt-3" @click="handleClose" :disabled="isProcessing">
                Dismiss
            </button>
        </div>
    </div>

    <!-- M-Pesa Phone Modal -->
    <!-- <MpesaPhoneModal
        v-if="selectedPaymentMethod === 'mpesa'"
        :visible="selectedPaymentMethod === 'mpesa'"
        @close="closePhoneModal"
        @confirm="onMpesaConfirm"
    /> -->
</template>

<script>
import { mapActions } from 'vuex';
import MpesaPhoneModal from '@/components/papers/MpesaPhoneModal.vue';
import { toast } from 'vue3-toastify';

export default {
    name: 'PaymentModal',
    components: { MpesaPhoneModal },
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
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.payment-methods button {
    margin: 0.5rem 0;
}

.alert {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
}
</style>
