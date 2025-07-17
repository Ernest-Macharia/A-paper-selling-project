<template>
    <Navbar />
    <main class="policy-page bg-light">
        <div class="container py-5">
            <!-- Header Section -->
            <div class="text-center mb-5">
                <h1 class="display-5 fw-bold text-primary mb-3">Refund and Cancellation Policy</h1>
                <div class="d-flex justify-content-center gap-3">
                    <button class="btn btn-outline-primary btn-sm" @click="printPage">
                        <i class="bi bi-printer-fill me-2"></i>Print Policy
                    </button>
                </div>
            </div>

            <!-- Policy Content -->
            <div class="row justify-content-center">
                <div class="col-lg-10 col-xl-8">
                    <div class="card shadow-sm border-0">
                        <div class="card-body p-4">
                            <!-- Summary Alert -->
                            <div class="alert alert-info bg-opacity-10 border-info">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-info-circle-fill text-info fs-4 me-3"></i>
                                    <div>
                                        <h3 class="h5 mb-2">Key Points Summary</h3>
                                        <ul class="mb-0 ps-3">
                                            <li>
                                                Refunds available for technical issues within 7 days
                                            </li>
                                            <li>
                                                Digital products generally non-refundable after
                                                download
                                            </li>
                                            <li>Contact support for assistance with any issues</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Accordion -->
                            <div class="accordion custom-accordion mt-4" id="refundPolicyAccordion">
                                <div class="accordion-item border-0 mb-3">
                                    <h2 class="accordion-header" id="headingOne">
                                        <button
                                            class="accordion-button rounded-3 shadow-none bg-light"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-expanded="true"
                                            aria-controls="collapseOne"
                                        >
                                            <i
                                                class="bi bi-check-circle-fill text-primary me-3"
                                            ></i>
                                            <span class="fw-semibold">Refund Eligibility</span>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseOne"
                                        class="accordion-collapse collapse show"
                                        aria-labelledby="headingOne"
                                        data-bs-parent="#refundPolicyAccordion"
                                    >
                                        <div class="accordion-body pt-3 pb-4">
                                            <p class="lead">
                                                Refunds from Gradesworld may be approved under the
                                                following conditions:
                                            </p>
                                            <ul class="list-styled mb-4">
                                                <li class="mb-2">
                                                    <i class="bi bi-check text-success me-2"></i>
                                                    The purchased digital file cannot be downloaded
                                                </li>
                                                <li class="mb-2">
                                                    <i class="bi bi-check text-success me-2"></i>
                                                    The file is downloadable but cannot be opened
                                                    due to technical issues
                                                </li>
                                                <li class="mb-2">
                                                    <i class="bi bi-check text-success me-2"></i>
                                                    The document has major readability or formatting
                                                    defects
                                                </li>
                                            </ul>

                                            <div class="bg-primary bg-opacity-5 p-4 rounded-3 mb-4">
                                                <h4 class="h5 text-primary mb-3">
                                                    <i class="bi bi-shield-check me-2"></i>
                                                    100% Money-Back Guarantee Requirements
                                                </h4>
                                                <ul class="list-styled">
                                                    <li class="mb-2">
                                                        <i
                                                            class="bi bi-clock text-primary me-2"
                                                        ></i>
                                                        Purchase made within the past 7 days
                                                    </li>
                                                    <li class="mb-2">
                                                        <i
                                                            class="bi bi-chat-dots text-primary me-2"
                                                        ></i>
                                                        You reported the issue to us or the seller
                                                    </li>
                                                    <li>
                                                        <i
                                                            class="bi bi-file-text text-primary me-2"
                                                        ></i>
                                                        Issue not related to disclosed missing
                                                        content
                                                    </li>
                                                </ul>
                                            </div>

                                            <p class="mb-0">
                                                If you meet these conditions, request a refund
                                                through our
                                                <router-link
                                                    to="/contact"
                                                    class="text-decoration-underline"
                                                    >Contact Us</router-link
                                                >
                                                page.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="accordion-item border-0 mb-3">
                                    <h2 class="accordion-header" id="headingTwo">
                                        <button
                                            class="accordion-button collapsed rounded-3 shadow-none bg-light"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-expanded="false"
                                            aria-controls="collapseTwo"
                                        >
                                            <i class="bi bi-x-circle-fill text-danger me-3"></i>
                                            <span class="fw-semibold"
                                                >Order Cancellation Policy</span
                                            >
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseTwo"
                                        class="accordion-collapse collapse"
                                        aria-labelledby="headingTwo"
                                        data-bs-parent="#refundPolicyAccordion"
                                    >
                                        <div class="accordion-body pt-3 pb-4">
                                            <p>
                                                Since digital products are available for immediate
                                                download upon purchase, Gradesworld generally does
                                                not process cancellations after a transaction is
                                                completed. However:
                                            </p>
                                            <div
                                                class="d-flex align-items-start bg-light p-3 rounded-3 mb-3"
                                            >
                                                <i
                                                    class="bi bi-lightbulb text-warning fs-5 mt-1 me-3"
                                                ></i>
                                                <div>
                                                    If you experience issues that qualify under our
                                                    refund policy, contact us for review. In some
                                                    cases, this may lead to cancellation.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="accordion-item border-0 mb-3">
                                    <h2 class="accordion-header" id="headingThree">
                                        <button
                                            class="accordion-button collapsed rounded-3 shadow-none bg-light"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree"
                                            aria-expanded="false"
                                            aria-controls="collapseThree"
                                        >
                                            <i
                                                class="bi bi-slash-circle-fill text-secondary me-3"
                                            ></i>
                                            <span class="fw-semibold"
                                                >Non-Refundable Situations</span
                                            >
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseThree"
                                        class="accordion-collapse collapse"
                                        aria-labelledby="headingThree"
                                        data-bs-parent="#refundPolicyAccordion"
                                    >
                                        <div class="accordion-body pt-3 pb-4">
                                            <p>Refunds will not be issued in these cases:</p>
                                            <ul class="list-styled">
                                                <li class="mb-2">
                                                    <i
                                                        class="bi bi-download text-secondary me-2"
                                                    ></i>
                                                    File already accessed or downloaded
                                                </li>
                                                <li class="mb-2">
                                                    <i
                                                        class="bi bi-calendar-x text-secondary me-2"
                                                    ></i>
                                                    Request made >7 days after purchase
                                                </li>
                                                <li>
                                                    <i
                                                        class="bi bi-exclamation-diamond text-secondary me-2"
                                                    ></i>
                                                    Reason not covered by eligibility criteria
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="accordion-item border-0">
                                    <h2 class="accordion-header" id="headingFour">
                                        <button
                                            class="accordion-button collapsed rounded-3 shadow-none bg-light"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseFour"
                                            aria-expanded="false"
                                            aria-controls="collapseFour"
                                        >
                                            <i
                                                class="bi bi-question-circle-fill text-info me-3"
                                            ></i>
                                            <span class="fw-semibold">Need Help?</span>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseFour"
                                        class="accordion-collapse collapse"
                                        aria-labelledby="headingFour"
                                        data-bs-parent="#refundPolicyAccordion"
                                    >
                                        <div class="accordion-body pt-3 pb-4">
                                            <div class="row align-items-center">
                                                <div class="col-md-8">
                                                    <p class="lead mb-3">
                                                        Our support team is ready to assist with any
                                                        refund or cancellation questions.
                                                    </p>
                                                    <router-link
                                                        to="/contact"
                                                        class="btn btn-primary px-4"
                                                    >
                                                        <i class="bi bi-headset me-2"></i>
                                                        Contact Support
                                                    </router-link>
                                                </div>
                                                <div class="col-md-4 text-center d-none d-md-block">
                                                    <i
                                                        class="bi bi-headset text-primary"
                                                        style="font-size: 3rem"
                                                    ></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'RefundPolicy',
    components: {
        Footer,
        Navbar,
    },
    methods: {
        printPage() {
            window.print();
        },
    },
};
</script>

<style scoped>
.policy-page {
    min-height: 100vh;
}

.custom-accordion .accordion-button {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
}

.custom-accordion .accordion-button:not(.collapsed) {
    background-color: rgba(13, 110, 253, 0.05);
    color: var(--bs-primary);
}

.custom-accordion .accordion-body {
    padding: 1.5rem;
}

.list-styled {
    list-style: none;
    padding-left: 0;
}

.list-styled li {
    padding-left: 2rem;
    position: relative;
}

@media print {
    .d-print-none {
        display: none !important;
    }

    .accordion-collapse {
        display: block !important;
    }

    .accordion-button {
        background-color: transparent !important;
        color: inherit !important;
    }

    .accordion-button::after {
        display: none;
    }

    .policy-page {
        background: white !important;
    }

    .card {
        border: none !important;
        box-shadow: none !important;
    }
}
</style>
