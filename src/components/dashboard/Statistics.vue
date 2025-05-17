<template>
    <div class="container">
      <h2>📊 Statistics</h2>
      <div class="row">
        <div class="col-md-6">
          <div class="card bg-info text-white p-3">
            <h4>Total Papers:</h4>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card bg-warning text-white p-3">
            <h4>Total Downloads:</h4>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
//   import { mapActions, mapState } from "vuex";
  export default {
    name: "Statistics",
    // computed: {
    //   ...mapState(["stats"]),
    // },
    // methods: {
    //   ...mapActions(["fetchStatistics"]),
    // },
    // async created() {
    //   await this.fetchStatistics();
    // },
  };
  </script>
  