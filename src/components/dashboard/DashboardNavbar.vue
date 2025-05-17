<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/dashboard">Dashboard</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#dashboardNavbar"
        aria-controls="dashboardNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="dashboardNavbar">
        <ul class="navbar-nav ms-auto">

      <!-- Profile Link -->
      <li class="nav-item">
        <router-link class="nav-link" to="/dashboard/profile">Profile</router-link>
      </li>

      <!-- Dropdown Menu for Dashboard Links -->
      <li class="nav-item dropdown">
        <button
          class="btn btn-secondary dropdown-toggle ms-2"
          id="dashboardMenu"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          📚 Dashboard Menu
        </button>

        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dashboardMenu">
          <li><router-link class="dropdown-item" to="/dashboard/upload-file">📄 Upload a Paper</router-link></li>
          <li><router-link class="dropdown-item" to="/dashboard/uploads">📤 Uploads</router-link></li>
          <li><router-link class="dropdown-item" to="/dashboard/downloads">📥 Downloads</router-link></li>
          <li><router-link class="dropdown-item" to="/dashboard/earnings">💰 Earnings</router-link></li>
          <li><router-link class="dropdown-item" to="/dashboard/reviews">⭐ Reviews</router-link></li>
          <li><router-link class="dropdown-item" to="/dashboard/statistics">📊 Statistics</router-link></li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button class="dropdown-item text-danger" @click="logout">🚪 Logout</button>
          </li>
        </ul>
      </li>

      <!-- Cart (Optional) -->
      <li class="nav-item">
        <router-link class="nav-link position-relative" to="/dashboard/checkout">
          🛒 Checkout
          <!-- <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span> -->
        </router-link>
      </li>

      </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DashboardNavbar",
  // computed: {
  //   ...mapState({
  //     cartCount: (state) => state.cart.items.length, // Fetch cart count from Vuex
  //   }),
  // },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

/* Cart Badge */
.cart-badge {
  position: absolute;
  top: 5px;
  right: -10px;
  background: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 50%;
}
.dropdown-menu {
  min-width: 220px;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.text-danger {
  font-weight: 500;
}

</style>
