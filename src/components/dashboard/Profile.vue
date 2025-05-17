<template>
    <div class="container">
      <h2>👤 Profile</h2>
  
      <!-- Profile Picture -->
      <div class="text-center">
        <!-- <img :src="user.profilePic || defaultPic" class="rounded-circle profile-img" /> -->
        <input type="file" class="form-control mt-2"/>
      </div>
  
      <!-- Profile Details -->
      <div class="card p-3 mt-4">
        <h4>Personal Info</h4>
        <form>
          <div class="mb-3">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control"  required />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" required disabled />
          </div>
          <div class="mb-3">
            <label class="form-label">Phone</label>
            <input type="text" class="form-control" />
          </div>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
      </div>
  
      <!-- Change Password -->
      <div class="card p-3 mt-4">
        <h4>Change Password</h4>
        <form>
          <div class="mb-3">
            <label class="form-label">Current Password</label>
            <input type="password" class="form-control"required />
          </div>
          <div class="mb-3">
            <label class="form-label">New Password</label>
            <input type="password" class="form-control"required />
          </div>
          <div class="mb-3">
            <label class="form-label">Confirm New Password</label>
            <input type="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-warning">Update Password</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
//   import { mapActions, mapState } from "vuex";
  
  export default {
    name: "Profile",
    // data() {
    //   return {
    //     defaultPic: "https://via.placeholder.com/150",
    //     password: { current: "", new: "", confirm: "" },
    //   };
    // },
    // computed: {
    //   ...mapState(["user"]),
    // },
    // methods: {
    //   ...mapActions(["fetchUserProfile", "updateUserProfile", "changePassword", "uploadProfilePicture"]),
  
    //   async updateProfile() {
    //     try {
    //       await this.updateUserProfile(this.user);
    //       alert("Profile updated successfully!");
    //     } catch (error) {
    //       alert("Error updating profile.");
    //     }
    //   },
  
    //   async updatePassword() {
    //     if (this.password.new !== this.password.confirm) {
    //       alert("New passwords do not match!");
    //       return;
    //     }
    //     try {
    //       await this.changePassword(this.password);
    //       alert("Password updated successfully!");
    //       this.password = { current: "", new: "", confirm: "" };
    //     } catch (error) {
    //       alert("Error updating password.");
    //     }
    //   },
  
    //   async uploadProfilePic(event) {
    //     const file = event.target.files[0];
    //     if (file) {
    //       const formData = new FormData();
    //       formData.append("profilePic", file);
    //       try {
    //         await this.uploadProfilePicture(formData);
    //         alert("Profile picture updated!");
    //       } catch (error) {
    //         alert("Error uploading picture.");
    //       }
    //     }
    //   },
    // },
    // async created() {
    //   await this.fetchUserProfile();
    // },
  };
  </script>
  
  <style scoped>
  .profile-img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border: 3px solid #ccc;
  }
  </style>
  