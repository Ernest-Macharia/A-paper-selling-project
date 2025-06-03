<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
    <h2 class="text-4xl font-bold text-gray-800 mb-6">💰 My Earnings Dashboard</h2>

    <!-- Earnings Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="rounded-xl shadow-lg p-6 bg-gradient-to-r from-green-400 to-green-600 text-white">
        <p class="text-sm">Total Earnings</p>
        <p class="text-2xl font-semibold mt-1">${{ earnings.total.toFixed(2) }}</p>
      </div>
      <div class="rounded-xl shadow-lg p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
        <p class="text-sm">Withdrawn</p>
        <p class="text-2xl font-semibold mt-1">${{ earnings.withdrawn.toFixed(2) }}</p>
      </div>
      <div class="rounded-xl shadow-lg p-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
        <p class="text-sm">Unpaid Balance</p>
        <p class="text-2xl font-semibold mt-1">${{ earnings.unpaid.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Tabs and Withdraw Button -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex space-x-4">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-5 py-2 rounded-full text-sm font-medium',
            activeTab === tab
              ? 'bg-blue-600 text-white shadow'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ tab }}
        </button>
      </div>
      <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md transition">
        Request Withdrawal
      </button>
    </div>

    <!-- Earnings Table -->
    <div class="bg-white shadow-md rounded-xl overflow-x-auto">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-6 py-3">Paper Title</th>
            <th class="px-6 py-3">Amount</th>
            <th class="px-6 py-3">Date</th>
            <th class="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in filteredEarnings"
            :key="entry.id"
            class="border-t hover:bg-gray-50 transition duration-200"
          >
            <td class="px-6 py-4 font-medium text-gray-800">{{ entry.title }}</td>
            <td class="px-6 py-4 text-green-700 font-semibold">${{ entry.amount.toFixed(2) }}</td>
            <td class="px-6 py-4 text-gray-500">{{ entry.date }}</td>
            <td class="px-6 py-4">
              <span
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-700': entry.status === 'paid',
                  'bg-yellow-100 text-yellow-700': entry.status === 'unpaid',
                  'bg-blue-100 text-blue-700': entry.status === 'withdrawn'
                }"
              >
                {{ entry.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredEarnings.length === 0" class="p-6 text-center text-gray-400 italic">
        No records found in this category.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Earnings",
  data() {
    return {
      activeTab: "Withdrawals",
      tabs: ["Withdrawals", "Unpaid", "All Earnings"],
      earnings: {
        total: 560.0,
        withdrawn: 250.0,
        unpaid: 310.0,
        entries: [
          {
            id: 1,
            title: "How to Win at Research",
            amount: 100.0,
            date: "2025-06-01",
            status: "withdrawn",
          },
          {
            id: 2,
            title: "Data Structures Deep Dive",
            amount: 90.0,
            date: "2025-06-03",
            status: "unpaid",
          },
          {
            id: 3,
            title: "Advanced Algorithms 101",
            amount: 120.0,
            date: "2025-05-28",
            status: "paid",
          },
          {
            id: 4,
            title: "AI in Education",
            amount: 150.0,
            date: "2025-05-25",
            status: "withdrawn",
          },
          {
            id: 5,
            title: "Cryptography Basics",
            amount: 100.0,
            date: "2025-06-01",
            status: "unpaid",
          },
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
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>
