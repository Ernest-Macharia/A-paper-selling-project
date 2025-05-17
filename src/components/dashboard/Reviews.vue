<template>
    <div class="container">
      <h2>⭐ Reviews</h2>
      <div class="text-center">Loading...</div>
      <ul class="list-group">
        <li class="list-group-item">
          <!-- <h5>{{ review.reviewer }}</h5>
          <p>{{ review.comment }}</p> -->
          <p>Rating: ⭐ 2/5</p>
        </li>
      </ul>
      <!-- <div v-else class="text-muted">No reviews yet.</div> -->
    </div>
  </template>
  
  <script>
//   import { mapActions, mapState } from "vuex";
  export default {
    name: "Reviews",
    // computed: {
    //   ...mapState(["reviews", "loading"]),
    // },
    // methods: {
    //   ...mapActions(["fetchReviews"]),
    // },
    // async created() {
    //   await this.fetchReviews();
    // },
  };
  </script>
  