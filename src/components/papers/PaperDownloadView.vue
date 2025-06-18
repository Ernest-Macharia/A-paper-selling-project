<template>
    <div class="container py-5 text-center">
        <div v-if="isLoading">
            <p>Loading your paper...</p>
        </div>
        <div v-else-if="paperDetails.file">
            <p>Your paper is ready to download:</p>
            <a :href="paperDetails.file" target="_blank" class="btn btn-success"> Download Now </a>
        </div>
        <div v-else>
            <p class="text-danger">
                Unable to fetch the download. Please check your purchase or contact support.
            </p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'PaperDownloadView',
    data() {
        return {
            isLoading: true,
            downloadUrl: null,
            paperDetails: null,
        };
    },
    created() {
        this.fetchdownloadPaper();
        this.fetchPaperDetails();
    },
    methods: {
        ...mapActions('exampapers', ['downloadPaperById']),
        ...mapActions('papers', ['fetchPaperById']),
        async fetchdownloadPaper() {
            try {
                const paperId = this.$route.params.pk;
                const url = await this.downloadPaperById(paperId);
                this.downloadUrl = url;
            } catch (error) {
                // Optionally show an error toast
            } finally {
                this.isLoading = false;
            }
        },

        async fetchPaperDetails() {
            try {
                const paperId = this.$route.params.id;
                this.paperDetails = await this.fetchPaperById(paperId);
            } catch (error) {
                console.error('Error fetching paper:', error);
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: auto;
}
</style>
