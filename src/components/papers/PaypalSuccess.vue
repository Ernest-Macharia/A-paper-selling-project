<!-- src/views/PaymentSuccess.vue -->
<template>
    <div>
        <h1>Payment Successful!</h1>
        <p v-if="loading">Confirming your payment...</p>
        <p v-if="error" style="color: red">{{ error }}</p>
        <p v-if="success" style="color: green">Payment confirmed successfully!</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'PaypalSuccess',
    data() {
        return {
            loading: true,
            error: null,
            success: false,
        };
    },
    async mounted() {
        const query = new URLSearchParams(window.location.search);
        const orderID = query.get('token'); // token = orderID
        const payerID = query.get('PayerID'); // PayPal returns this

        if (!orderID || !payerID) {
            this.error = 'Missing payment details from PayPal.';
            this.loading = false;
            return;
        }

        try {
            await axios.post('https://c06b-197-232-89-168.ngrok-free.app/api/paypal_api/capture/', {
                orderID,
                payerID,
            });

            this.success = true;
        } catch (err) {
            this.error = err.response?.data?.detail || 'Payment capture failed.';
        } finally {
            this.loading = false;
        }
    },
};
</script>
