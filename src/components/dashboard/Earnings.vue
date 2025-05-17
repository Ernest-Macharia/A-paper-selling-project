<template>
    <div class="container">
      <h2>💰 Earnings</h2>
      <div class="card p-3">
        <h4>Total Earnings:</h4>
        <!-- <p>Last Payout: ${{ earnings.lastPayout }} on {{ earnings.lastPayoutDate }}</p> -->
        <button class="btn btn-success">Withdraw</button>
      </div>
      <h3 class="mt-4">Earnings History</h3>
      <!-- <ul class="list-group">
        <li v-for="payment in earnings.history" :key="payment.id" class="list-group-item">
          {{ payment.date }} - ${{ payment.amount }}
        </li>
      </ul> -->
    </div>
  </template>
  
  <script>
//   import { mapActions, mapState } from "vuex";
  export default {
    name: "Earnings",
    // computed: {
    //   ...mapState(["earnings"]),
    // },
    // methods: {
    //   ...mapActions(["fetchEarnings"]),
    // },
    // async created() {
    //   await this.fetchEarnings();
    // },
  };
  </script>
  