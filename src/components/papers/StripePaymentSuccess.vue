<template>
    <div class="text-center p-6">
        <h1 class="text-2xl font-bold text-green-600">✅ Payment Success!</h1>
        <p class="mt-4">Thank you for your purchase.</p>
    </div>
    <Button class="btn btn-primary">
        <router-link class="navbar-brand me-auto" to="/"></router-link>
    </Button>
</template>

<script>
export default {
    name: 'StripePaymentSuccess',
};
</script>
