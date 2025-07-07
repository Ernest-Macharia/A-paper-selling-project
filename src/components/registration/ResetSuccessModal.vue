<template>
    <div class="modal-backdrop show d-flex justify-content-center align-items-center">
        <div class="modal-dialog">
            <div class="modal-content p-4">
                <h5 class="modal-title text-success">{{ title }}</h5>
                <p class="mt-2">{{ message }}</p>
                <button class="btn btn-success mt-3" @click="$emit('close')">OK</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        message: String,
    },
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1050;
}
</style>
