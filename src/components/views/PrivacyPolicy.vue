<template>
    <Navbar />
    <section class="privacy-policy py-5">
        <!-- Hero Section -->
        <div class="container py-4">
            <div class="row justify-content-center">
                <div class="col-lg-10 text-center">
                    <h1 class="display-4 fw-bold text-primary mb-4">Privacy Policy</h1>
                    <div class="lead text-muted mb-4 mx-auto" style="max-width: 800px">
                        <p>
                            Gradesworld values your privacy and is committed to handling your
                            personal data responsibly and securely. This statement outlines how we
                            collect, use, and protect your information when you use our platform.
                        </p>
                        <p>
                            For any questions regarding your data, please contact us at
                            <a
                                href="mailto:support@gradesworld.com"
                                class="text-primary text-decoration-underline"
                                >support@gradesworld.com</a
                            >.
                        </p>
                    </div>
                    <div class="d-flex gap-2 justify-content-center flex-wrap">
                        <a href="#last-updated" class="btn btn-sm btn-outline-secondary">
                            <i class="bi bi-calendar me-1"></i>Last Updated: July 8, 2025
                        </a>
                        <a href="#contact" class="btn btn-sm btn-outline-secondary">
                            <i class="bi bi-envelope me-1"></i>Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <!-- Quick Navigation -->
                    <div class="card mb-5 shadow-sm">
                        <div class="card-header bg-light">
                            <h2 class="h5 mb-0">Quick Navigation</h2>
                        </div>
                        <div class="card-body">
                            <div class="d-flex flex-wrap gap-2">
                                <a
                                    v-for="(item, index) in privacySections"
                                    :key="index"
                                    :href="`#section-${index}`"
                                    class="btn btn-sm btn-outline-primary"
                                >
                                    {{ item.title }}
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Policy Sections -->
                    <div class="privacy-sections">
                        <div
                            v-for="(item, index) in privacySections"
                            :key="index"
                            :id="`section-${index}`"
                            class="mb-5"
                        >
                            <div class="d-flex align-items-center mb-4">
                                <div
                                    class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style="width: 36px; height: 36px"
                                >
                                    {{ index + 1 }}
                                </div>
                                <h2 class="h4 mb-0">{{ item.title }}</h2>
                            </div>
                            <div class="ps-5" v-html="item.content"></div>
                        </div>
                    </div>

                    <!-- Contact Card -->
                    <div id="contact" class="card border-primary mt-5">
                        <div class="card-header bg-primary text-white">
                            <h2 class="h5 mb-0">Need Further Assistance?</h2>
                        </div>
                        <div class="card-body">
                            <p>
                                If you have any questions about our privacy practices or would like
                                to exercise your data rights, please contact our Data Protection
                                Officer:
                            </p>
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-envelope-fill text-primary me-2"></i>
                                <a
                                    href="mailto:support@gradesworld.com"
                                    class="text-decoration-none"
                                    >support@gradesworld.com</a
                                >
                            </div>
                            <p class="small text-muted mb-0">
                                We typically respond to inquiries within 1-2 business days.
                            </p>
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
    name: 'PrivacyPolicy',
    components: {
        Footer,
        Navbar,
    },
    data() {
        return {
            privacySections: [
                {
                    title: 'Who is Gradesworld?',
                    content: `
                        <p>Gradesworld is an online educational marketplace operated by Gradesworld. We provide a platform where users can buy, sell, and share academic revision documents and study materials. Gradesworld is responsible for collecting and handling your data submitted through the platform.</p>
                        <div class="alert alert-info mt-3">
                            <strong>Note:</strong> Financial information is handled exclusively by our payment processor, Stripe. Please refer to Stripe's privacy policy for financial data handling.
                        </div>
                    `,
                },
                {
                    title: 'What Data Does Gradesworld Collect?',
                    content: `
                        <h3 class="h5 mt-3">Gradesworld Profile</h3>
                        <p>To upload or download documents, you must create a Profile. The following information is required:</p>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <strong>For uploading:</strong>
                                    </div>
                                    <div class="card-body">
                                        <ul class="mb-0">
                                            <li>Valid email address</li>
                                            <li>Username</li>
                                            <li>Password</li>
                                            <li>Full name</li>
                                            <li>PayPal address (to process earnings)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <strong>For downloading:</strong>
                                    </div>
                                    <div class="card-body">
                                        <ul class="mb-0">
                                            <li>Valid email address</li>
                                            <li>Username</li>
                                            <li>Password</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="mt-3">We use the data you provide to create your account, allow access to features, and occasionally send personal offers or notifications related to your use of the platform.</p>
                        <p>You also give Gradesworld permission to display your username and profile picture (with your consent) as part of promoting top users or popular materials on the platform. You can withdraw this permission at any time by contacting <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>.</p>

                        <h3 class="h5 mt-4">Automatically Collected Data</h3>
                        <p>Gradesworld gathers information about your use of the platform, including pages visited, download history, IP address, browser type, and cookies. This helps us improve your user experience and address technical issues.</p>

                        <h3 class="h5 mt-4">Newsletters</h3>
                        <p>If you opt into our newsletter, we may send updates or promotions to your email. You may unsubscribe at any time via your profile settings or the unsubscribe link in any email.</p>

                        <h3 class="h5 mt-4">Personal Offers</h3>
                        <p>With your permission, we may use your purchase history, browsing behavior, and cookie data to personalize offers. You can withdraw consent by emailing <a href="mailto:support@gradesworld.com">support@gradesworld.com</a> or adjusting your profile settings.</p>

                        <h3 class="h5 mt-4">Statistical Surveys</h3>
                        <p>We may use anonymized, aggregated data to improve the platform through analytics and user behavior studies. This processing is based on Gradesworld's legitimate interest in improving services.</p>
                    `,
                },
                {
                    title: 'What Are Cookies and How Does Gradesworld Use Them?',
                    content: `
                        <p>Cookies are small data files stored on your device to help Gradesworld recognize returning users and tailor services.</p>
                        
                        <h3 class="h5 mt-4">Types of Cookies:</h3>
                        <div class="table-responsive">
                            <table class="table">
                                <thead class="table-light">
                                    <tr>
                                        <th>Type</th>
                                        <th>Purpose</th>
                                        <th>Can be disabled?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Functional Cookies</strong></td>
                                        <td>Enable essential features like login</td>
                                        <td>No (required for basic functionality)</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Analytic Cookies</strong></td>
                                        <td>Help us understand platform usage via tools like Google Analytics</td>
                                        <td>Yes</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Social Media Plug-ins</strong></td>
                                        <td>Allow sharing on platforms like Facebook or Twitter</td>
                                        <td>Yes</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <p class="mt-3">We also use Facebook Pixel to display targeted ads on Facebook, but this data is never linked to your Gradesworld account.</p>
                        <div class="alert alert-warning mt-3">
                            You may disable cookies via your browser, though this may affect site functionality.
                        </div>
                    `,
                },
                {
                    title: 'Disclosure to Third Parties',
                    content: `
                        <p>We do not share your personal data for third-party marketing without your explicit permission. However, to operate our services, we may share information with trusted service providers (e.g., hosting providers like Amazon). Contracts with these parties require strict data protection practices.</p>
                        <p>In the case of legal obligations, intellectual property complaints, or suspected misconduct, we may disclose limited data to authorities or involved users as required.</p>
                        <div class="alert alert-info mt-3">
                            Please note: Gradesworld is not responsible for the privacy practices of third-party websites linked from our platform.
                        </div>
                    `,
                },
                {
                    title: 'How Does Gradesworld Protect Personal Data?',
                    content: `
                        <p>We implement several security measures to protect your information:</p>
                        <ul>
                            <li>Secure servers with enterprise-grade firewalls</li>
                            <li>End-to-end encryption (HTTPS) for all data transmissions</li>
                            <li>Secure account authentication (username/password)</li>
                            <li>Regular security audits and vulnerability testing</li>
                        </ul>
                        <div class="alert alert-warning mt-3">
                            <strong>Important:</strong> Always log out when using a shared computer to prevent misuse of your account.
                        </div>
                    `,
                },
                {
                    title: 'Retention of Data',
                    content: `
                        <p>Gradesworld retains your data only as long as necessary to:</p>
                        <ul>
                            <li>Provide the services you requested</li>
                            <li>Comply with legal obligations</li>
                            <li>Resolve disputes</li>
                            <li>Enforce our agreements</li>
                        </ul>
                        <p>Once no longer needed, data is either anonymized or securely deleted.</p>
                    `,
                },
                {
                    title: 'Transfer of Business Ownership',
                    content: `
                        <p>If Gradesworld undergoes a business transition (such as a merger, acquisition, or sale of assets), your personal data may be transferred as part of that deal. You will be notified via email and/or a prominent notice on our website of any such change in ownership or control of your personal information.</p>
                        <p>In such cases, you will have the opportunity to:</p>
                        <ul>
                            <li>Request deletion of your data before the transfer</li>
                            <li>Opt-out of having your data transferred</li>
                            <li>Review the new owner's privacy policy</li>
                        </ul>
                    `,
                },
                {
                    title: 'Your Rights',
                    content: `
                        <p>Under data privacy laws, you have the following rights regarding your personal data:</p>
                        
                        <div class="table-responsive">
                            <table class="table">
                                <thead class="table-light">
                                    <tr>
                                        <th>Right</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Right of Access</strong></td>
                                        <td>You can request a copy of the personal data we hold about you</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Right to Rectification</strong></td>
                                        <td>You can request corrections or updates to inaccurate data</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Right to Erasure</strong></td>
                                        <td>You can request that your data be deleted ("Right to be Forgotten")</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Right to Restrict Processing</strong></td>
                                        <td>You may request a temporary halt to data processing under certain conditions</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Right to Object</strong></td>
                                        <td>You can object to processing based on our legitimate interests</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Right to Data Portability</strong></td>
                                        <td>You can request your data in a structured, machine-readable format</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <p class="mt-3">To exercise any of these rights, please email <a href="mailto:support@gradesworld.com">support@gradesworld.com</a> with:</p>
                        <ul>
                            <li>A clear description of your request</li>
                            <li>A copy of your ID (with sensitive information redacted)</li>
                        </ul>
                        <p>We typically respond within one month, or will inform you if more time is needed.</p>
                    `,
                },
                {
                    title: 'Changes to This Privacy Statement',
                    content: `
                        <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. When we post changes, we will revise the "last updated" date at the top of this policy.</p>
                        <p>For significant changes, we will:</p>
                        <ul>
                            <li>Post a prominent notice on our website</li>
                            <li>Send an email notification to registered users</li>
                            <li>Provide a summary of the key changes</li>
                        </ul>
                        <p>We encourage you to periodically review this page for the latest information on our privacy practices.</p>
                    `,
                },
                {
                    title: 'Questions or Complaints?',
                    content: `
                        <p>If you have any concerns about our privacy practices or wish to file a complaint, please contact our Data Protection Officer:</p>
                        <div class="card bg-light">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-envelope-fill text-primary me-2"></i>
                                    <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>
                                </div>
                                <p class="mb-0 small">We take all privacy concerns seriously and will respond promptly to your inquiry.</p>
                            </div>
                        </div>
                        <p class="mt-3">If you're not satisfied with our response, you may contact your local data protection authority.</p>
                    `,
                },
            ],
        };
    },
};
</script>

<style scoped>
.privacy-policy {
    background-color: #f8f9fa;
}

.privacy-sections {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.table th {
    font-weight: 600;
}

.alert {
    border-left: 4px solid;
}

.card {
    border: none;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
    font-weight: 600;
}

h2,
h3,
h4 {
    color: #2c3e50;
}

a {
    transition: color 0.2s ease;
}

a:hover {
    color: var(--bs-primary);
}
</style>
