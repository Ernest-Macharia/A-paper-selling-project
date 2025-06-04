<template>
  <div class="container py-5 font-sans">
    <h2 class="mb-4 display-5 fw-bold text-primary-emphasis">
      My Earnings Dashboard
    </h2>

    <!-- Earnings Summary Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <div class="card shadow-sm text-white bg-success border-0 rounded-4">
          <div class="card-body text-center py-4">
            <p class="card-text fs-6 mb-1">Total Earnings</p>
            <p class="card-title fs-3 fw-semibold">${{ earnings.total.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm text-white bg-info border-0 rounded-4">
          <div class="card-body text-center py-4">
            <p class="card-text fs-6 mb-1">Withdrawn</p>
            <p class="card-title fs-3 fw-semibold">${{ earnings.withdrawn.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm text-white bg-warning border-0 rounded-4">
          <div class="card-body text-center py-4">
            <p class="card-text fs-6 mb-1">Unpaid Balance</p>
            <p class="card-title fs-3 fw-semibold">${{ earnings.unpaid.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs and Withdraw Button -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <ul class="nav nav-pills">
        <li v-for="tab in tabs" :key="tab" class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </li>
      </ul>
      <button class="btn btn-success btn-lg shadow-sm" @click="showModal = true">
        Request Withdrawal
      </button>
    </div>

    <!-- Earnings Table -->
    <div class="table-responsive rounded-4 shadow-sm border">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light text-uppercase small">
          <tr>
            <th scope="col">Paper Title</th>
            <th scope="col">Amount</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filteredEarnings" :key="entry.id" class="cursor-pointer">
            <td class="fw-medium text-primary">{{ entry.title }}</td>
            <td class="text-success fw-semibold">${{ entry.amount.toFixed(2) }}</td>
            <td class="text-muted">{{ entry.date }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-success': entry.status === 'paid',
                  'bg-warning text-dark': entry.status === 'unpaid',
                  'bg-info text-dark': entry.status === 'withdrawn'
                }"
              >
                {{ entry.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredEarnings.length === 0" class="p-4 text-center text-secondary fst-italic">
        No records found in this category.
      </div>
    </div>

    <!-- Withdrawal Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: showModal }"
      style="display: block;"
      v-if="showModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 shadow">
          <div class="modal-header bg-success text-white rounded-top-4">
            <h5 class="modal-title">Withdrawal Request</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="submitWithdrawal">
              <div class="mb-3">
                <label class="form-label">Withdrawal Method</label>
                <select
                  class="form-select"
                  v-model="withdrawalForm.method"
                  required
                >
                  <option disabled value="">Select method</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="paypal">PayPal</option>
                  <option value="visa">Visa</option>
                </select>
              </div>

              <div class="mb-3" v-if="withdrawalForm.method">
                <label class="form-label">
                  {{
                    withdrawalForm.method === 'mpesa'
                      ? 'M-Pesa Phone Number'
                      : withdrawalForm.method === 'paypal'
                      ? 'PayPal Email'
                      : 'Visa Card Number'
                  }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="withdrawalForm.account"
                  :placeholder="getAccountPlaceholder"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Amount</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="withdrawalForm.amount"
                  min="1"
                  :max="earnings.unpaid"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Currency</label>
                <select class="form-select" v-model="withdrawalForm.currency" required>
                  <option disabled value="">Select currency</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="KES">KES</option>
                </select>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-success btn-lg">Submit Request</button>
                <button type="button" class="btn btn-outline-secondary" @click="showModal = false">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal backdrop -->
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: "Earnings",
  data() {
    return {
      activeTab: "Withdrawals",
      showModal: false,
      tabs: ["Withdrawals", "Unpaid", "All Earnings"],
      withdrawalForm: {
        method: "",
        account: "",
        amount: null,
        currency: "",
      },
      earnings: {
        total: 560.0,
        withdrawn: 250.0,
        unpaid: 310.0,
        entries: [
          { id: 1, title: "How to Win at Research", amount: 100.0, date: "2025-06-01", status: "withdrawn" },
          { id: 2, title: "Data Structures Deep Dive", amount: 90.0, date: "2025-06-03", status: "unpaid" },
          { id: 3, title: "Advanced Algorithms 101", amount: 120.0, date: "2025-05-28", status: "paid" },
          { id: 4, title: "AI in Education", amount: 150.0, date: "2025-05-25", status: "withdrawn" },
          { id: 5, title: "Cryptography Basics", amount: 100.0, date: "2025-06-01", status: "unpaid" },
        ],
      },
    };
  },
  computed: {
    filteredEarnings() {
      if (this.activeTab === "Withdrawals") {
        return this.earnings.entries.filter((e) => e.status === "withdrawn");
      } else if (this.activeTab === "Unpaid") {
        return this.earnings.entries.filter((e) => e.status === "unpaid");
      } else {
        return this.earnings.entries;
      }
    },

    getAccountPlaceholder() {
      switch (this.withdrawalForm.method) {
        case "mpesa":
          return "e.g., +254712345678";
        case "paypal":
          return "e.g., user@example.com";
        case "visa":
          return "e.g., 4111 1111 1111 1111";
        default:
          return "";
      }
    },
  },
  methods: {
    submitWithdrawal() {
      alert(`Withdrawal submitted:\nAccount: ${this.withdrawalForm.account}\nAmount: ${this.withdrawalForm.amount}\nCurrency: ${this.withdrawalForm.currency}`);
      this.showModal = false;
      // Optionally reset the form
      this.withdrawalForm = {
        account: "",
        amount: null,
        currency: "",
      };
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}
.cursor-pointer {
  cursor: pointer;
}
.modal {
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-backdrop {
  z-index: 1040;
}
.modal-content {
  z-index: 1050;
}
</style>
