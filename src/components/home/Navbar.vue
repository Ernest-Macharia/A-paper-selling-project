<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container">
      <router-link class="navbar-brand" to="/">GradesWorld</router-link>

      <!-- 📱 Toggler button for mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 🌐 Navbar content collapsible on mobile -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto ms-3 mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/courses">Courses</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/categories">Categories</router-link>
          </li>
        </ul>

        <!-- 🔍 Centered search box (will move under on small screens) -->
        <div class="d-flex mx-auto my-2 my-lg-0" style="width: 100%; max-width: 400px;">
          <div class="input-group search-box w-100">
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

        <!-- 👤 Auth buttons -->
        <div class="d-flex ms-auto mt-2 mt-lg-0">
          <router-link class="btn btn-outline-primary mx-2" to="/login">Login</router-link>
          <router-link class="btn btn-outline-success mx-2" to="/register"><i class="fas fa-upload fa-lg"></i>Sell</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Home",
  methods: {
    searchPapers(event) {
      const query = event.target.value.trim();
      if (query.length > 2) {
        this.$router.push({ path: '/search', query: { q: query } });
      }
    },
  },
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

  .navbar-toggler {
    border: none;
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
