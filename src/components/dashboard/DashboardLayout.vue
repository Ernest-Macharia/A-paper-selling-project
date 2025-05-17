<template>
    <div>
      <DashboardNavbar />
      <router-view />
    </div>
  </template>
  
  <script>
  import DashboardNavbar from "@/components/dashboard/DashboardNavbar.vue";
  
  export default {
    name: "DashboardLayout",
    components: {
      DashboardNavbar,
    },
  };
  </script>
  