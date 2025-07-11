<template>
    <Navbar />
    <div class="container py-5">
        <h1 class="mb-4 text-primary-emphasis fw-bold text-center">
            Refund and Cancellation Policy
        </h1>
        <div class="accordion" id="refundPolicyAccordion">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                    >
                        Refund Eligibility
                    </button>
                </h2>
                <div
                    id="collapseOne"
                    class="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#refundPolicyAccordion"
                >
                    <div class="accordion-body">
                        <p>
                            Refunds from Gradesworld may be approved under the following conditions:
                        </p>
                        <ul>
                            <li>The purchased digital file cannot be downloaded.</li>
                            <li>
                                The file is downloadable but cannot be opened due to technical
                                issues (e.g., incompatible format).
                            </li>
                            <li>
                                The document has major issues, such as being unreadable or
                                containing serious formatting defects.
                            </li>
                        </ul>
                        <p>
                            To qualify for our 100% Money-Back Guarantee, the following must apply:
                        </p>
                        <ul>
                            <li>The purchase was made within the past 7 days.</li>
                            <li>You reached out to us or the seller to report the issue.</li>
                            <li>
                                The issue is not related to missing content that was clearly
                                disclosed by the seller in the product description.
                            </li>
                        </ul>
                        <p>
                            If you meet the above conditions, you may request a refund through our
                            <router-link to="/contact">Contact Us</router-link> page.
                        </p>
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                    >
                        Order Cancellation Policy
                    </button>
                </h2>
                <div
                    id="collapseTwo"
                    class="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#refundPolicyAccordion"
                >
                    <div class="accordion-body">
                        <p>
                            Since digital products are available for immediate download upon
                            purchase, Gradesworld generally does not process cancellations after a
                            transaction is completed. However, if you experience issues that qualify
                            under our refund policy, we encourage you to contact us so we can review
                            your case. In some instances, this may lead to a cancellation.
                        </p>
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                    >
                        Non-Refundable Situations
                    </button>
                </h2>
                <div
                    id="collapseThree"
                    class="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#refundPolicyAccordion"
                >
                    <div class="accordion-body">
                        <p>Refunds will not be issued in the following cases:</p>
                        <ul>
                            <li>The file has already been accessed or downloaded.</li>
                            <li>
                                The refund request is made more than 7 days after the purchase date.
                            </li>
                            <li>
                                The reason for the refund is not supported by our eligibility
                                criteria.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingFour">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                    >
                        Need Help?
                    </button>
                </h2>
                <div
                    id="collapseFour"
                    class="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#refundPolicyAccordion"
                >
                    <div class="accordion-body">
                        <p>
                            If you need guidance or assistance regarding a refund or cancellation,
                            our team is here to support you. Simply reach out via the
                            <router-link to="/contact">Contact Us</router-link> page, and we’ll
                            respond as quickly as possible to help resolve your concern.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
};
</script>

<style scoped>
.accordion-button {
    font-weight: 600;
}
</style>
