<template>
    <div class="container py-5 text-center">
        <div v-if="isLoading">
            <p>Verifying your payment...</p>
            <span class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </span>
        </div>

        <div v-else-if="errorMessage">
            <p class="text-danger">{{ errorMessage }}</p>
            <router-link to="/" class="btn btn-outline-danger mt-3">Go Back Home</router-link>
        </div>

        <div v-else-if="redirecting">
            <p class="text-success">Payment verified! Redirecting to your paper...</p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'PaymentSuccess',
    data() {
        return {
            isLoading: true,
            errorMessage: null,
            redirecting: false,
        };
    },
    methods: {
        ...mapActions('payment', ['verifyPayment']),
        async handleVerification() {
            const sessionId = this.$route.query.session_id || this.$route.query.paymentId;
            const orderId = this.$route.query.order_id;

            if (!orderId) {
                this.errorMessage = 'Invalid payment confirmation details.';
                this.isLoading = false;
                return;
            }

            try {
                const result = await this.verifyPayment({ sessionId, orderId });

                if (result.success && result.order) {
                    this.redirecting = true;

                    this.$store.commit('payment/CLEAR_CART');

                    setTimeout(() => {
                        this.$router.push({
                            name: 'PaperDownloadView',
                            query: { ids: result.order.paper_ids.join(',') },
                        });
                    }, 2000);
                } else {
                    this.errorMessage = 'Payment verification failed. Please try again.';
                }
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    this.errorMessage = 'Session expired. Please log in again.';
                } else {
                    this.errorMessage = 'Something went wrong during verification.';
                }
            } finally {
                this.isLoading = false;
            }
        },
    },
    created() {
        this.handleVerification();
    },
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: auto;
}
</style>
