<template>
  <div class="container my-5">
    <div class="card shadow-lg">
      <div class="card-body bg-light">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="card-title text-primary">User Profile</h2>
            <p class="text-muted mb-0">Manage your personal information</p>
          </div>
          <button class="btn btn-primary" @click="openModal">
            <i class="bi bi-pencil-square me-2"></i>Edit Profile
          </button>
        </div>

        <div class="row gy-3">
          <div class="col-md-6">
            <label class="form-label fw-bold">Full Name</label>
            <p class="form-control-plaintext">{{ userDetails.full_name }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Email</label>
            <p class="form-control-plaintext">{{ userDetails.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade show d-block" v-if="showModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content shadow">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Edit Profile</h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveProfileChanges">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">First Name</label>
                <input
                  v-model="form.first_name"
                  type="text"
                  class="form-control"
                  :disabled="loading"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Last Name</label>
                <input
                  v-model="form.last_name"
                  type="text"
                  class="form-control"
                  :disabled="loading"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :disabled="loading"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-success" :disabled="loading">
                <span v-if="loading">
                  <span class="spinner-border spinner-border-sm me-1"></span> Saving...
                </span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" v-if="showModal"></div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { toast } from 'vue3-toastify';

export default {
  name: "Profile",
  data() {
    return {
      showModal: false,
      loading: false,
      userDetails: {},
      form: {
        first_name: "",
        last_name: "",
        email: ""
      }
    };
  },
  async created() {
    await this.loadUserDetails();
  },
  methods: {
    ...mapActions("authentication", ["fetchCurrentUserDetails", "updateCurrentUserDetails"]),
    async loadUserDetails() {
      try {
        const user = await this.fetchCurrentUserDetails();
        this.userDetails = user;
      } catch (error) {
        toast.error("Error fetching user details.");
      }
    },
    openModal() {
      this.showModal = true;
      this.form = {
        first_name: this.userDetails.first_name || "",
        last_name: this.userDetails.last_name || "",
        email: this.userDetails.email || ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    async saveProfileChanges() {
      this.loading = true;

      const data = {
        first_name: this.form.first_name.trim(),
        last_name: this.form.last_name.trim(),
        email: this.form.email.trim()
      };

      if (!data.first_name || !data.last_name || !data.email) {
        toast.error("All fields are required.")
        this.loading = false;
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error("Enter a valid email address.")
        this.loading = false;
        return;
      }

      try {
        await this.updateCurrentUserDetails(data);

        // Update UI
        this.userDetails = {
          ...this.userDetails,
          ...data,
          full_name: `${data.first_name} ${data.last_name}`
        };

        // Show toast
        toast.success("Profile updated successfully!");

        // Close modal
        this.closeModal();
      } catch (error) {
        toast.error("Failed to update profile.")
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.modal {
  display: block; /* force modal to be visible when v-if is true */
}
</style>
