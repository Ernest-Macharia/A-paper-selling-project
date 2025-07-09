<template>
    <div class="activation-page">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg custom-navbar">
            <div class="container">
                <router-link class="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src="@/assets/images/gradesworld.png"
                        alt="GradesWorld Logo"
                        height="40"
                        class="me-2"
                    />
                </router-link>
            </div>
        </nav>

        <!-- Main content -->
        <div
            class="container d-flex flex-column justify-content-center align-items-center text-center activation-content"
        >
            <div
                class="card p-5 shadow rounded-4 border-0 text-center"
                style="max-width: 500px; width: 100%"
            >
                <div class="text-success mb-3">
                    <i class="fas fa-check-circle fa-3x"></i>
                </div>
                <h1 class="h4 fw-bold mb-2 text-primary">Registration Successful!</h1>
                <p class="text-muted mb-4">
                    You're almost there. We've sent an activation link to your email. <br />
                    Please check your inbox and click the link to activate your account.
                </p>

                <router-link to="/resend-activation" class="mb-2 d-inline-block">
                    <button class="btn btn-outline-primary btn-sm">
                        Didn’t get the email? Resend Activation
                    </button>
                </router-link>

                <router-link to="/" class="d-block mt-3 text-decoration-none small text-muted">
                    Back to Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ActivationSent',
};
</script>

<style scoped>
.custom-navbar {
    position: sticky;
    top: 0;
    z-index: 1030;
    background: linear-gradient(90deg, #6ea8fe, #b28dff);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
    font-weight: bold;
    font-size: 1.4rem;
    color: #fff !important;
}

.activation-content {
    min-height: calc(80vh - 80px);
    padding-top: 60px;
}

.card {
    background: #ffffff;
}
</style>
