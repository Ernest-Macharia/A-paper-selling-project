<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-content animate-fade">
      <h5>✅ Success!</h5>
      <p>{{ message }}</p>
      <button class="btn btn-success mt-2" @click="$emit('close')">Dismiss</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadSuccessModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: { 
      type: String, 
      default: "Your paper was uploaded successfully!" 
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 350px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.animate-fade {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
