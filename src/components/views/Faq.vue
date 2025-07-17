<template>
    <Navbar />
    <section class="faq-section py-5 bg-light">
        <!-- Hero Section -->
        <div class="container py-4">
            <div class="row justify-content-center">
                <div class="col-lg-10 text-center">
                    <h1 class="display-4 fw-bold text-primary mb-3">Frequently Asked Questions</h1>
                    <p class="lead text-muted mb-4">
                        Find quick answers to common questions about Gradesworld
                    </p>

                    <!-- Search Bar -->
                    <div class="col-lg-8 mx-auto mb-5">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0">
                                <i class="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                class="form-control border-start-0"
                                placeholder="Search questions..."
                                v-model="searchQuery"
                                @input="filterFAQs"
                            />
                            <button class="btn btn-primary" type="button">Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAQ Content -->
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <!-- Categories Navigation -->
                    <div class="d-flex flex-wrap gap-2 mb-5 justify-content-center">
                        <button
                            v-for="(category, index) in categories"
                            :key="index"
                            @click="filterByCategory(category)"
                            :class="[
                                'btn btn-sm',
                                activeCategory === category ? 'btn-primary' : 'btn-outline-primary',
                            ]"
                        >
                            {{ category }}
                        </button>
                    </div>

                    <!-- FAQ Accordion -->
                    <div class="accordion" id="faqAccordion">
                        <div
                            class="accordion-item border-0 mb-3 shadow-sm"
                            v-for="(item, index) in filteredFAQs"
                            :key="index"
                        >
                            <h2 class="accordion-header" :id="`heading${index}`">
                                <button
                                    class="accordion-button collapsed d-flex justify-content-between align-items-center py-3"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    :data-bs-target="`#collapse${index}`"
                                    aria-expanded="false"
                                    :aria-controls="`collapse${index}`"
                                >
                                    <span class="fw-medium">{{ item.question }}</span>
                                    <i
                                        class="bi bi-chevron-down text-primary ms-2 transition-all"
                                    ></i>
                                </button>
                            </h2>
                            <div
                                :id="`collapse${index}`"
                                class="accordion-collapse collapse"
                                :aria-labelledby="`heading${index}`"
                                data-bs-parent="#faqAccordion"
                            >
                                <div class="accordion-body pt-0" v-html="item.answer"></div>
                            </div>
                        </div>
                    </div>

                    <!-- No Results -->
                    <div v-if="filteredFAQs.length === 0" class="text-center py-5">
                        <div class="bg-light rounded-circle d-inline-flex p-4 mb-3">
                            <i class="bi bi-question-circle-fill text-primary fs-1"></i>
                        </div>
                        <h3 class="h4 mb-3">No matching questions found</h3>
                        <p class="text-muted mb-4">
                            Try different search terms or browse all questions
                        </p>
                        <button @click="resetFilters" class="btn btn-primary">
                            Show All Questions
                        </button>
                    </div>

                    <!-- Still Have Questions? -->
                    <div class="card border-primary mt-5">
                        <div class="card-header bg-primary text-white">
                            <h2 class="h5 mb-0">Still have questions?</h2>
                        </div>
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <p class="mb-md-0">
                                        Can't find what you're looking for? Our support team is
                                        ready to help you 24/7.
                                    </p>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <router-link to="/contact" class="btn btn-outline-primary">
                                        <i class="bi bi-headset me-2"></i>Contact Support
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <Footer />
</template>

<script>
import Footer from '@/components/home/Footer.vue';
import Navbar from '@/components/home/Navbar.vue';

export default {
    name: 'Faq',
    components: {
        Footer,
        Navbar,
    },
    data() {
        return {
            searchQuery: '',
            activeCategory: 'All',
            categories: ['All', 'Payments', 'Uploading', 'Downloading', 'Documents', 'Account'],
            faqs: [
                {
                    question: "I Don't Have a Credit Card—How Can I Pay?",
                    answer: `
                        <div class="alert alert-info mb-3">
                            <i class="bi bi-info-circle-fill me-2"></i>
                            No Credit Card? No Worries! At Gradesworld, we offer multiple payment options.
                        </div>
                        <p>Payment methods differ depending on your country. When you're ready to check out, you'll see the available payment options specific to your region.</p>
                        <h5 class="mt-4">Available Options:</h5>
                        <ul class="list-group list-group-flush mb-3">
                            <li class="list-group-item d-flex align-items-center">
                                <i class="bi bi-credit-card me-3 text-primary"></i>
                                <div>
                                    <strong>Alternative Payment Methods</strong><br>
                                    Select one of the other payment methods shown during checkout
                                </div>
                            </li>
                            <li class="list-group-item d-flex align-items-center">
                                <i class="bi bi-person-plus me-3 text-primary"></i>
                                <div>
                                    <strong>Ask for Help</strong><br>
                                    Have a trusted friend or family member assist with the payment
                                </div>
                            </li>
                        </ul>
                        <div class="card bg-light border-0 mt-3">
                            <div class="card-body">
                                <h5 class="h6 mb-2">Need more help?</h5>
                                <p class="mb-0">Our support team is ready for you! Use the chat pop-up at the bottom-right corner or email us at <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>.</p>
                            </div>
                        </div>
                    `,
                    category: 'Payments',
                },
                {
                    question: 'Why Sell Notes on Gradesworld?',
                    answer: `
                        <div class="d-flex mb-3">
                            <div class="me-3 text-primary">
                                <i class="bi bi-currency-dollar fs-4"></i>
                            </div>
                            <div>
                                <h5 class="h6 mb-1">Earn Passive Income</h5>
                                <p class="mb-0">Turn your study efforts into a revenue stream</p>
                            </div>
                        </div>
                        <div class="d-flex mb-3">
                            <div class="me-3 text-primary">
                                <i class="bi bi-people fs-4"></i>
                            </div>
                            <div>
                                <h5 class="h6 mb-1">Help Fellow Students</h5>
                                <p class="mb-0">Your notes can help others succeed in their studies</p>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="me-3 text-primary">
                                <i class="bi bi-award fs-4"></i>
                            </div>
                            <div>
                                <h5 class="h6 mb-1">Build Your Reputation</h5>
                                <p class="mb-0">Top contributors get featured and earn badges</p>
                            </div>
                        </div>
                    `,
                    category: 'Uploading',
                },
                {
                    question: 'In What Format are Documents Downloaded from Gradesworld?',
                    answer: `
                        <p>Documents are typically downloaded in PDF format for consistency and compatibility across devices.</p>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body text-center">
                                        <i class="bi bi-file-earmark-pdf text-danger fs-1 mb-3"></i>
                                        <h5 class="h6 mb-2">Standard Documents</h5>
                                        <p class="small mb-0">Word files, study notes, and essays are converted to PDF</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100 border-0 shadow-sm mt-3 mt-md-0">
                                    <div class="card-body text-center">
                                        <i class="bi bi-file-earmark-ppt text-warning fs-1 mb-3"></i>
                                        <h5 class="h6 mb-2">Special Formats</h5>
                                        <p class="small mb-0">PowerPoint files and ZIP folders retain their original format</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="alert alert-light mt-3">
                            <i class="bi bi-question-circle me-2"></i>
                            Need assistance with your download? <a href="#contact" class="alert-link">Contact our support team</a>.
                        </div>
                    `,
                    category: 'Downloading',
                },
                {
                    question: 'In What Format Should I Upload Documents to Gradesworld?',
                    answer: `
                        <div class="alert alert-success">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            For best results, we recommend converting your files to PDF before uploading.
                        </div>
                        <h5 class="h6 mt-4">Benefits of PDF Uploads:</h5>
                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i> Preserves your original formatting</li>
                            <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i> Ensures professional presentation</li>
                            <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i> Compatible with all devices</li>
                            <li><i class="bi bi-check2 text-success me-2"></i> Prevents accidental editing by others</li>
                        </ul>
                        <div class="card bg-light border-0 mt-3">
                            <div class="card-body py-2">
                                <p class="small mb-0"><i class="bi bi-info-circle me-2"></i> We accept Word (.docx), PowerPoint (.pptx), and PDF files, but PDF is strongly recommended.</p>
                            </div>
                        </div>
                    `,
                    category: 'Uploading',
                },
                {
                    question: 'Can I Print the Documents I Purchased on Gradesworld?',
                    answer: `
                        <p>Absolutely! You can print any document you've purchased for your personal study use.</p>
                        <h5 class="h6 mt-4">Printing Instructions:</h5>
                        <div class="steps">
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">1</div>
                                <span>Log in to your Gradesworld account</span>
                            </div>
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">2</div>
                                <span>Click your profile icon and select "Downloads"</span>
                            </div>
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">3</div>
                                <span>Download the file to your device</span>
                            </div>
                            <div class="step">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">4</div>
                                <span>Press <kbd>Ctrl</kbd> + <kbd>P</kbd> (Windows) or <kbd>Cmd</kbd> + <kbd>P</kbd> (Mac) to print</span>
                            </div>
                        </div>
                    `,
                    category: 'Documents',
                },
                {
                    question: "Can I Distribute Documents I've Purchased on Gradesworld?",
                    answer: `
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            <strong>Important:</strong> Purchased documents are for personal study only.
                        </div>
                        <p>Sharing documents you've purchased violates:</p>
                        <ul>
                            <li>Gradesworld's Terms of Service</li>
                            <li>Copyright laws protecting the original authors</li>
                            <li>Our community guidelines</li>
                        </ul>
                        <div class="card border-danger mt-3">
                            <div class="card-header bg-danger bg-opacity-10 text-danger">
                                <i class="bi bi-shield-lock me-2"></i> Consequences of Unauthorized Distribution
                            </div>
                            <div class="card-body">
                                <ul class="mb-0">
                                    <li>Account suspension or termination</li>
                                    <li>Legal action from copyright holders</li>
                                    <li>Removal of all your purchased materials</li>
                                </ul>
                            </div>
                        </div>
                    `,
                    category: 'Documents',
                },
                {
                    question: 'Can Everyone Upload Documents to Gradesworld?',
                    answer: `
                        <div class="alert alert-info">
                            <i class="bi bi-upload me-2"></i>
                            Yes! We welcome all students to share their knowledge.
                        </div>
                        <h5 class="h6 mt-3">Upload Guidelines:</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card border-success border-opacity-25 mb-3 mb-md-0">
                                    <div class="card-header bg-success bg-opacity-10 text-success">
                                        <i class="bi bi-check-circle me-2"></i> Do Upload
                                    </div>
                                    <div class="card-body">
                                        <ul class="mb-0">
                                            <li>Your original lecture notes</li>
                                            <li>Self-created study guides</li>
                                            <li>Personal essay outlines</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card border-danger border-opacity-25">
                                    <div class="card-header bg-danger bg-opacity-10 text-danger">
                                        <i class="bi bi-x-circle me-2"></i> Don't Upload
                                    </div>
                                    <div class="card-body">
                                        <ul class="mb-0">
                                            <li>Copyrighted textbooks</li>
                                            <li>Other users' materials</li>
                                            <li>Plagiarized content</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                    category: 'Uploading',
                },
                {
                    question: 'How Do I Download a Document on Gradesworld?',
                    answer: `
                        <div class="steps">
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">1</div>
                                <span>Log in to your Gradesworld account</span>
                            </div>
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">2</div>
                                <span>Purchase the document (if not free)</span>
                            </div>
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">3</div>
                                <span>Go to "Downloads" in your profile menu</span>
                            </div>
                            <div class="step">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">4</div>
                                <span>Click "Open", accept the terms, and the download will begin</span>
                            </div>
                        </div>
                        <div class="alert alert-warning mt-3">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Note:</strong> Once downloaded, refunds are not available. Contact support if you encounter issues.
                        </div>
                    `,
                    category: 'Downloading',
                },
                {
                    question:
                        'The Layout of my Document Has Changed After Downloading—How Can I Fix This?',
                    answer: `
                        <p>If you experience formatting issues with your downloaded document:</p>
                        <div class="d-flex mb-3">
                            <div class="me-3 text-primary">
                                <i class="bi bi-person-lines-fill fs-4"></i>
                            </div>
                            <div>
                                <h5 class="h6 mb-1">Contact the Seller</h5>
                                <p class="mb-0">Use the document page's "Message Seller" feature to request a corrected version</p>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="me-3 text-primary">
                                <i class="bi bi-headset fs-4"></i>
                            </div>
                            <div>
                                <h5 class="h6 mb-1">Contact Support</h5>
                                <p class="mb-0">If unresolved, email <a href="mailto:support@gradesworld.com">support@gradesworld.com</a> with details</p>
                            </div>
                        </div>
                        <div class="card bg-light border-0 mt-3">
                            <div class="card-body py-2">
                                <p class="small mb-0"><i class="bi bi-lightbulb me-2"></i> Tip: Try opening the file in different PDF viewers like Adobe Acrobat Reader for best results.</p>
                            </div>
                        </div>
                    `,
                    category: 'Downloading',
                },
                {
                    question: 'What Can I Do if I Have a Question About the Content of a Document?',
                    answer: `
                        <div class="d-flex mb-4">
                            <div class="me-3 text-primary">
                                <i class="bi bi-chat-left-dots fs-1"></i>
                            </div>
                            <div>
                                <h5 class="h6 mb-1">Direct Message the Seller</h5>
                                <p>Use the "send the seller a message" link on the document page to ask specific questions about the content.</p>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="me-3 text-primary">
                                <i class="bi bi-headset fs-1"></i>
                            </div>
                            <div>
                                <h5 class="h6 mb-1">Contact Gradesworld Support</h5>
                                <p>If you can't resolve the issue with the seller, our support team can mediate. Use the chat pop-up or email <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>.</p>
                            </div>
                        </div>
                    `,
                    category: 'Documents',
                },
                {
                    question:
                        "What Should I Do if I Can't Find My Purchased Document in My Account?",
                    answer: `
                        <div class="alert alert-info">
                            <i class="bi bi-hourglass-split me-2"></i>
                            First, wait up to 10 minutes after purchase—processing sometimes takes a moment.
                        </div>
                        <h5 class="h6 mt-3">Troubleshooting Steps:</h5>
                        <div class="steps">
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">1</div>
                                <span>Check your email for a purchase confirmation</span>
                            </div>
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">2</div>
                                <span>Verify your payment was successful</span>
                            </div>
                            <div class="step mb-3">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">3</div>
                                <span>Check your account's "Downloads" section again</span>
                            </div>
                            <div class="step">
                                <div class="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style="width: 24px; height: 24px;">4</div>
                                <span>If still missing, contact support via chat or email</span>
                            </div>
                        </div>
                        <div class="card border-primary mt-3">
                            <div class="card-header bg-primary bg-opacity-10 text-primary">
                                <i class="bi bi-envelope me-2"></i> Support Email
                            </div>
                            <div class="card-body">
                                <a href="mailto:support@gradesworld.com" class="text-decoration-none">support@gradesworld.com</a>
                            </div>
                        </div>
                    `,
                    category: 'Account',
                },
            ],
            filteredFAQs: [],
        };
    },
    created() {
        this.filteredFAQs = [...this.faqs];
    },
    methods: {
        filterFAQs() {
            if (!this.searchQuery) {
                this.filteredFAQs = [...this.faqs];
                return;
            }
            const query = this.searchQuery.toLowerCase();
            this.filteredFAQs = this.faqs.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(query) ||
                    faq.answer.toLowerCase().includes(query),
            );
        },
        filterByCategory(category) {
            this.activeCategory = category;
            if (category === 'All') {
                this.filteredFAQs = [...this.faqs];
                return;
            }
            this.filteredFAQs = this.faqs.filter((faq) => faq.category === category);
        },
        resetFilters() {
            this.searchQuery = '';
            this.activeCategory = 'All';
            this.filteredFAQs = [...this.faqs];
        },
    },
};
</script>

<style scoped>
.faq-section {
    min-height: calc(100vh - 120px); /* Adjust based on header/footer height */
}

.accordion-button:not(.collapsed) {
    background-color: rgba(13, 110, 253, 0.05);
    color: var(--bs-primary);
}

.accordion-button:focus {
    box-shadow: none;
    border-color: rgba(13, 110, 253, 0.25);
}

.accordion-button::after {
    display: none; /* Hide default Bootstrap icon */
}

.accordion-button .bi-chevron-down {
    transition: transform 0.2s ease;
}

.accordion-button:not(.collapsed) .bi-chevron-down {
    transform: rotate(180deg);
}

.step {
    display: flex;
    align-items: center;
}

.step-number {
    font-size: 0.75rem;
    font-weight: 600;
}

.card {
    border-radius: 0.5rem;
}

.alert {
    border-left: 4px solid;
}

.input-group-text,
.form-control {
    height: 46px;
}

.input-group-text {
    border-right: none;
}

.form-control {
    border-left: none;
}

.form-control:focus {
    box-shadow: none;
    border-color: #ced4da;
}
</style>
