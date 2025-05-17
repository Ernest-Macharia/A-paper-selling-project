<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container">
      <router-link class="navbar-brand me-auto" to="/">GradesHub</router-link>

      <div class="d-flex flex-grow-1 justify-content-center">
        <div class="input-group search-box">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search text-primary"></i>
          </span>
          <input 
            type="text" 
            class="form-control border-start-0"
            placeholder="Search papers..."
            @input="searchPapers"
          />
        </div>
      </div>

      <div class="d-flex">
        <router-link class="btn btn-outline-primary mx-2" to="/login">Login</router-link>
        <router-link class="btn btn-outline-success mx-2" to="/register">Sell</router-link>
      </div>
    </div>
  </nav>
</template>
  
  <script>
  // import { mapActions } from "vuex";
  
  export default {
    name: "Home",
    // data() {
    //   return {
    //     query: "",
    //     papers: [],
    //     loading: false,
    //   };
    // },
    // methods: {
    //   ...mapActions(["fetchPapers"]),
  
    //   async searchPapers() {
    //     if (!this.query.trim()) {
    //       this.papers = [];
    //       return;
    //     }
  
    //     this.loading = true;
    //     try {
    //       const results = await this.fetchPapers(this.query);
    //       this.papers = results;
    //     } catch (error) {
    //       console.error("Error fetching papers:", error);
    //     } finally {
    //       this.loading = false;
    //     }
    //   },
    // },
  };
  </script>

  <style scoped>
  .custom-navbar {
    position: sticky;
    top: 0;
    z-index: 1030;
    background: linear-gradient(90deg, #6ea8fe, #b28dff); /* Light blue to soft purple */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .navbar-brand {
    font-weight: bold;
    font-size: 1.4rem;
    color: #fff !important;
  }

  .navbar-brand:hover {
    text-decoration: none;
    opacity: 0.85;
  }

  .search-box {
    max-width: 400px;
    width: 100%;
  }

  .input-group-text {
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 20px 0 0 20px;
  }

  .form-control {
    border: none;
    border-radius: 0 20px 20px 0;
    color: #333;
  }

  .input-group-text i {
    color: #0d6efd;
  }

  .btn-outline-primary, .btn-outline-success {
    color: white;
    border-color: rgba(255, 255, 255, 0.5);
  }

  .btn-outline-primary:hover, .btn-outline-success:hover {
    color: #fff;
    border-color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }

</style>
  