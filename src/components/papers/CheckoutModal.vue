<template>
    <!-- Modal backdrop and container -->
    <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        :class="{ show: visible }"
        :style="{ display: visible ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }"
        @click.self="handleClose"
    >
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content rounded-4 shadow-lg p-4">
                <div class="modal-header border-0 pb-2">
                    <h5 class="modal-title d-flex align-items-center gap-2">
                        <i class="bi bi-cart4 fs-4 text-primary"></i>
                        Checkout Summary
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        @click="handleClose"
                    ></button>
                </div>

                <div
                    v-if="cartItems.length"
                    class="modal-body overflow-auto py-3"
                    style="max-height: 400px"
                >
                    <div
                        v-for="paper in cartItems"
                        :key="paper.id"
                        class="border rounded-3 p-3 mb-3 bg-white shadow-sm d-flex align-items-center justify-content-between"
                    >
                        <div>
                            <p class="fw-semibold mb-1 text-truncate" style="max-width: 250px">
                                {{ paper.title }}
                            </p>
                            <p class="text-muted mb-1 small">
                                by {{ paper.author_info?.name || 'Unknown Author' }}
                            </p>
                            <p class="mb-0 fw-bold text-primary">
                                ${{ Number(paper.price).toFixed(2) }}
                            </p>
                        </div>
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            @click="removeFromCart(paper.id)"
                            title="Remove"
                        >
                            <i class="bi bi-trash-fill"></i> Remove
                        </button>
                    </div>
                </div>

                <div v-else class="modal-body text-center text-muted py-5 fs-5">
                    <i class="bi bi-cart-x mb-3 fs-1"></i>
                    <div>No items in checkout.</div>
                </div>

                <div
                    v-if="cartItems.length"
                    class="modal-footer border-0 pt-3 d-flex justify-content-between align-items-center"
                >
                    <div class="fs-5 fw-semibold text-primary">
                        Total: ${{ totalAmount.toFixed(2) }}
                    </div>
                    <div class="d-flex gap-2">
                        <button
                            type="button"
                            class="btn btn-outline-secondary d-flex align-items-center gap-2"
                            @click="$emit('continue-shopping')"
                        >
                            <i class="bi bi-arrow-left-circle"></i> Continue Shopping
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary d-flex align-items-center gap-2"
                            :disabled="cartCount === 0"
                            @click="openPaymentModal"
                        >
                            <i class="bi bi-credit-card-2-front-fill"></i> Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Payment Modal -->
    <PaymentModal
        :visible="paymentModalVisible"
        :amount="totalAmount"
        :paper-ids="paperIds"
        :cart-items="cartItems"
        @close="paymentModalVisible = false"
    />
</template>

<script>
import PaymentModal from '@/components/papers/PaymentModal.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'CheckoutModal',
    components: { PaymentModal },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            paymentModalVisible: false,
        };
    },

    computed: {
        ...mapGetters('payment', ['cartItems', 'cartCount', 'totalAmount', 'paperIds']),
        ...mapGetters('ui', ['showPaymentModal']),
    },

    watch: {
        showPaymentModal(val) {
            if (val) {
                this.paymentModalVisible = true;
                this.$store.commit('payment/SET_SHOW_PAYMENT_MODAL', false); // Reset
            }
        },
    },

    methods: {
        ...mapMutations('payment', ['REMOVE_FROM_CART']),
        handleClose() {
            this.$emit('close');
        },
        removeFromCart(id) {
            this.REMOVE_FROM_CART(id);
        },
        openPaymentModal() {
            if (!this.$store.getters['authentication/isAuthenticated']) {
                this.$router.push({
                    path: '/login',
                    query: {
                        redirect: this.$route.fullPath,
                        openPayment: true,
                    },
                });
            } else {
                this.paymentModalVisible = true;
            }
        },
    },
};
</script>

<style scoped>
.modal.show {
    display: block;
    animation: fadeIn 0.3s ease forwards;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.modal-content {
    background-color: #fff;
}
.modal-body {
    scrollbar-width: thin;
    scrollbar-color: #adb5bd #f1f3f5;
}
.modal-body::-webkit-scrollbar {
    width: 8px;
}
.modal-body::-webkit-scrollbar-thumb {
    background-color: #adb5bd;
    border-radius: 4px;
}
.modal-body::-webkit-scrollbar-track {
    background-color: #f1f3f5;
}
.btn-outline-danger:hover {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
}
</style>
