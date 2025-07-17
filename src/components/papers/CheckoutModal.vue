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
            <div class="modal-content rounded-4 shadow-lg border-0">
                <!-- Modal Header -->
                <div class="modal-header border-bottom-0 pb-0">
                    <div class="d-flex align-items-center gap-2 w-100">
                        <i class="bi bi-cart3 fs-4 text-primary"></i>
                        <h5 class="modal-title mb-0 flex-grow-1">Checkout Summary</h5>
                        <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            @click="handleClose"
                        ></button>
                    </div>
                </div>

                <!-- Modal Body -->
                <div class="modal-body px-4 py-3">
                    <!-- Items List -->
                    <div
                        v-if="cartItems.length"
                        class="items-container overflow-auto mb-3"
                        style="max-height: 400px"
                    >
                        <div
                            v-for="paper in cartItems"
                            :key="paper.id"
                            class="item-card rounded-3 p-3 mb-3 bg-light d-flex align-items-center justify-content-between gap-3"
                        >
                            <div class="flex-grow-1 text-truncate">
                                <h6 class="mb-1 text-truncate fw-semibold">{{ paper.title }}</h6>
                                <small class="text-muted d-block">
                                    by {{ paper.author_info?.name || 'Unknown Author' }}
                                </small>
                                <span class="badge bg-primary mt-1">
                                    ${{ Number(paper.price).toFixed(2) }}
                                </span>
                            </div>
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                @click="removeFromCart(paper.id)"
                                title="Remove"
                            >
                                <i class="bi bi-trash"></i>
                                <span class="d-none d-sm-inline">Remove</span>
                            </button>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="empty-state text-center py-5">
                        <i class="bi bi-cart-x text-muted fs-1 mb-3"></i>
                        <p class="text-muted mb-0">Your cart is empty</p>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div v-if="cartItems.length" class="modal-footer border-top-0 pt-0 px-4 pb-4">
                    <div class="d-flex justify-content-between align-items-center w-100 gap-3">
                        <div class="total-amount fs-5 fw-semibold text-primary">
                            Total: ${{ totalAmount.toFixed(2) }}
                        </div>
                        <div class="d-flex gap-2">
                            <button
                                type="button"
                                class="btn btn-outline-secondary px-3 d-flex align-items-center gap-2"
                                @click="$emit('continue-shopping')"
                            >
                                <i class="bi bi-arrow-left"></i>
                                <span class="d-none d-sm-inline">Continue</span>
                            </button>
                            <button
                                type="button"
                                class="btn btn-primary px-3 d-flex align-items-center gap-2"
                                :disabled="cartCount === 0"
                                @click="openPaymentModal"
                            >
                                <i class="bi bi-credit-card"></i>
                                <span class="d-none d-sm-inline">Pay</span>
                            </button>
                        </div>
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
                this.$store.commit('payment/SET_SHOW_PAYMENT_MODAL', false);
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
/* Modal Animation */
.modal.show {
    display: block;
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-content {
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* Items Container */
.items-container {
    scrollbar-width: thin;
    scrollbar-color: #dee2e6 transparent;
}

.items-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.items-container::-webkit-scrollbar-thumb {
    background-color: #dee2e6;
    border-radius: 3px;
}

/* Item Card */
.item-card {
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.item-card:hover {
    background-color: #f8f9fa !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Buttons */
.btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.btn-outline-danger:hover {
    background-color: var(--bs-danger);
    color: white;
}

.btn-primary {
    min-width: 90px;
}

/* Responsive Adjustments */
@media (max-width: 576px) {
    .modal-body {
        padding: 1rem;
    }

    .btn {
        padding: 0.5rem;
    }

    .total-amount {
        font-size: 1rem;
    }
}

.empty-state {
    opacity: 0.7;
}
</style>
