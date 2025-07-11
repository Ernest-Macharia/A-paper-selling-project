<template>
    <Navbar />
    <section class="page-section py-5 bg-light">
        <div class="container">
            <h1 class="fw-bold text-primary-emphasis mb-4 text-center">Privacy Statement</h1>
            <p class="text-muted text-center mb-5">
                Gradesworld values your privacy and is committed to handling your personal data
                responsibly and securely. We recommend reviewing this Privacy Statement thoroughly.
                Gradesworld values your privacy and is committed to handling your personal data
                responsibly and securely. When you use Gradesworld, you expect that your personal
                information will be treated with care and not shared improperly with third parties.
                This statement outlines the types of personal data we collect and how we use it. In
                short, your data helps us offer academic materials, keep you informed about our
                services, and provide personalized offers. If you have questions regarding your
                data, contact us at support@gradesworld.com. If you have questions, contact us at
                <a href="mailto:support@gradesworld.com" class="text-decoration-none"
                    >support@gradesworld.com</a
                >.
            </p>

            <div class="accordion" id="privacyAccordion">
                <div v-for="(item, index) in privacySections" :key="index" class="accordion-item">
                    <h2 class="accordion-header" :id="`heading-${index}`">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`#collapse-${index}`"
                            aria-expanded="false"
                            :aria-controls="`collapse-${index}`"
                        >
                            {{ item.title }}
                        </button>
                    </h2>
                    <div
                        :id="`collapse-${index}`"
                        class="accordion-collapse collapse"
                        :aria-labelledby="`heading-${index}`"
                        data-bs-parent="#privacyAccordion"
                    >
                        <div class="accordion-body" v-html="item.content"></div>
                    </div>
                </div>
            </div>

            <p class="text-muted text-center mt-5 small">
                <a href="mailto:support@gradesworld.com" class="text-decoration-none"
                    >support@gradesworld.com</a
                >
            </p>
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
                    title: '1. Who is Gradesworld?',
                    content: `
            Gradesworld is an online educational marketplace operated by Gradesworld. We provide a platform where users can buy, sell, and share academic revision documents and study materials. Gradesworld is responsible for collecting and handling your data submitted through the platform.<br><br>
            <strong>Note:</strong> Financial information is handled exclusively by our payment processor, Stripe. Please refer to Stripe’s privacy policy for financial data handling.
          `,
                },
                {
                    title: '2. What Data Does Gradesworld Collect?',
                    content: `
            <strong>Gradesworld Profile</strong><br>
            To upload or download documents, you must create a Profile. The following information is required:<br>
            <ul>
              <li><strong>For uploading:</strong> Valid email address, username, password, full name, and PayPal address (to process earnings)</li>
              <li><strong>For downloading:</strong> Valid email address, username, and password</li>
            </ul>
            We use the data you provide to create your account, allow access to features, and occasionally send personal offers or notifications related to your use of the platform.<br><br>

            You also give Gradesworld permission to display your username and profile picture (with your consent) as part of promoting top users or popular materials on the platform. You can withdraw this permission at any time by contacting <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>.<br><br>

            <strong>Automatically Collected Data</strong><br>
            Gradesworld gathers information about your use of the platform, including pages visited, download history, IP address, browser type, and cookies. This helps us improve your user experience and address technical issues.<br><br>

            <strong>Newsletters</strong><br>
            If you opt into our newsletter, we may send updates or promotions to your email. You may unsubscribe at any time via your profile settings or the unsubscribe link in any email.<br><br>

            <strong>Personal Offers</strong><br>
            With your permission, we may use your purchase history, browsing behavior, and cookie data to personalize offers. You can withdraw consent by emailing <a href="mailto:support@gradesworld.com">support@gradesworld.com</a> or adjusting your profile settings.<br><br>

            <strong>Statistical Surveys</strong><br>
            We may use anonymized, aggregated data to improve the platform through analytics and user behavior studies. This processing is based on Gradesworld’s legitimate interest in improving services.
          `,
                },
                {
                    title: '3. What Are Cookies and How Does Gradesworld Use Them?',
                    content: `
            Cookies are small data files stored on your device to help Gradesworld recognize returning users and tailor services.<br><br>
            <strong>Types of Cookies:</strong>
            <ul>
              <li><strong>Functional Cookies:</strong> Enable essential features like login. These cannot be disabled.</li>
              <li><strong>Analytic Cookies:</strong> Help us understand platform usage via tools like Google Analytics.</li>
              <li><strong>Social Media Plug-ins:</strong> Allow sharing on platforms like Facebook or Twitter; these services may install third-party cookies.</li>
            </ul>
            We also use Facebook Pixel to display targeted ads on Facebook, but this data is never linked to your Gradesworld account.<br><br>
            You may disable cookies via your browser, though this may affect site functionality.
          `,
                },
                {
                    title: '4. Disclosure to Third Parties',
                    content: `
            We do not share your personal data for third-party marketing without your explicit permission. However, to operate our services, we may share information with trusted service providers (e.g., hosting providers like Amazon). Contracts with these parties require strict data protection practices.<br><br>
            In the case of legal obligations, intellectual property complaints, or suspected misconduct, we may disclose limited data to authorities or involved users as required.<br><br>
            Please note: Gradesworld is not responsible for the privacy practices of third-party websites linked from our platform.
          `,
                },
                {
                    title: '5. How Does Gradesworld Protect Personal Data?',
                    content: `
            We use secure servers, encryption (HTTPS), and account login credentials (username/password) to protect your data from unauthorized access. Always log out when using a shared computer to prevent misuse.
          `,
                },
                {
                    title: '6. Retention of Data',
                    content: `
            Gradesworld retains your data only as long as necessary to provide services or meet legal obligations.
          `,
                },
                {
                    title: '7. Transfer of Business Ownership',
                    content: `
            If Gradesworld is acquired or merged with another entity, your data may be transferred to the new owner. We will notify you in advance, and you may choose to opt out if you wish.
          `,
                },
                {
                    title: '8. Your Rights',
                    content: `
            Under data privacy laws, you have the following rights:
            <ul>
              <li><strong>Right of Access:</strong> You can request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> You can request corrections or updates to inaccurate data.</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You can request that your data be deleted.</li>
              <li><strong>Right to Restrict Processing:</strong> You may request a temporary halt to data processing under certain conditions.</li>
              <li><strong>Right to Object:</strong> You can object to processing based on our legitimate interests.</li>
              <li><strong>Right to Data Portability:</strong> You can request your data in a structured, machine-readable format.</li>
            </ul>
            To make a request, email <a href="mailto:support@gradesworld.com">support@gradesworld.com</a> with a copy of your ID (redact ID number). We typically respond within one month, or inform you if more time is needed.
          `,
                },
                {
                    title: '9. Changes to This Privacy Statement',
                    content: `
            This policy may be updated periodically. Any significant changes will be posted on the platform. Last updated: July 8, 2025.
          `,
                },
                {
                    title: '10. Questions or Complaints?',
                    content: `
            If you have any concerns or inquiries about this Privacy Statement, please contact us at:
            <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>
          `,
                },
            ],
        };
    },
};
</script>
