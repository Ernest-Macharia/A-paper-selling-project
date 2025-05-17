<template>
  <div class="checkout container py-5">
    <h2 class="text-center">🛒 Checkout</h2>

    <!-- Order Summary -->
    <div class="order-summary mt-4">
      <h4>📄 Your Order</h4>
      <div v-if="cartItems.length">
        <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
          <p><strong>{{ item.title }}</strong> - ${{ item.price.toFixed(2) }}</p>
        </div>
        <hr />
        <h5>Total: ${{ totalAmount.toFixed(2) }}</h5>
      </div>
      <p v-else>No items in the cart.</p>
    </div>

    <!-- Billing Details -->
    <div class="billing-details mt-4">
      <h4>📝 Billing Details</h4>
      <form @submit.prevent="processCheckout">
        <div class="mb-3">
          <label for="fullName" class="form-label">Full Name</label>
          <input type="text" id="fullName" v-model="billing.fullName" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" v-model="billing.email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="paymentMethod" class="form-label">Payment Method</label>
          <select id="paymentMethod" v-model="billing.paymentMethod" class="form-control" required>
            <option value="credit_card">💳 Credit Card</option>
            <option value="paypal">🅿️ PayPal</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary w-100">✅ Place Order</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Checkout",
  data() {
    return {
      cartItems: [
        { title: "AI & Machine Learning Paper", price: 9.99 },
        { title: "Blockchain Research Paper", price: 7.99 },
      ],
      billing: {
        fullName: "",
        email: "",
        paymentMethod: "credit_card",
      },
    };
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((total, item) => total + item.price, 0);
    },
  },
  methods: {
    processCheckout() {
      alert(`Order placed successfully! Payment via: ${this.billing.paymentMethod}`);
    },
  },
};
</script>

<style scoped>
.checkout {
  max-width: 600px;
  margin: auto;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.cart-item {
  background: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}
button {
  font-size: 18px;
}
</style>
