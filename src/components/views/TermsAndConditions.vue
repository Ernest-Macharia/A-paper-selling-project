<template>
    <Navbar />
    <section class="py-5 bg-white">
        <div class="container">
            <h1 class="text-center text-primary-emphasis mb-4">Terms & Conditions</h1>
            <div class="accordion mt-4" id="termsAccordion">
                <div v-for="(item, index) in termsSections" :key="index" class="accordion-item">
                    <h2 class="accordion-header" :id="`term-heading-${index}`">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`#term-collapse-${index}`"
                            aria-expanded="false"
                            :aria-controls="`term-collapse-${index}`"
                        >
                            {{ item.title }}
                        </button>
                    </h2>
                    <div
                        :id="`term-collapse-${index}`"
                        class="accordion-collapse collapse"
                        :aria-labelledby="`term-heading-${index}`"
                        data-bs-parent="#termsAccordion"
                    >
                        <div class="accordion-body" v-html="item.content"></div>
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
    name: 'TermsAndConditions',
    components: {
        Footer,
        Navbar,
    },
    data() {
        return {
            termsSections: [
                {
                    title: '1. Introduction',
                    content: `
              These Terms and Conditions govern your use of the Gradesworld platform. By accessing the website, you agree to abide by these Terms.
              <ul>
                <li>Creating and managing your Profile (Article 3)</li>
                <li>Platform features (Articles 4, 5, and 6)</li>
                <li>Payment and transactions (Article 7)</li>
                <li>Reporting/removing infringing content (Article 8)</li>
                <li>Liability limitations (Article 11)</li>
              </ul>
            `,
                },
                {
                    title: '2. Applicability',
                    content: `
              <p>2.1 These Terms apply to all users.</p>
              <p>2.2 We may update these Terms at any time. Continued use implies acceptance. Disagree? Discontinue use and delete your profile.</p>
            `,
                },
                {
                    title: '3. Profile',
                    content: `
              <ul>
                <li>3.1 Users must create a Profile and provide accurate information.</li>
                <li>3.2 Under 18? You need parental consent.</li>
                <li>3.3 Update your info to avoid payout issues.</li>
                <li>3.4 Your data is handled per our Privacy Policy.</li>
                <li>3.5 Keep your login credentials secure.</li>
                <li>3.6 Gradesworld can modify/discontinue platform features at any time.</li>
                <li>3.7 We may alter usernames or registration steps as needed.</li>
                <li>3.8 We aren’t liable for unauthorized account use.</li>
                <li>3.9 By creating a profile, you allow limited use of your profile data for platform purposes. You can withdraw this consent anytime.</li>
              </ul>
            `,
                },
                {
                    title: '4. Platform Features',
                    content: `
              <p>4.1 Users can upload/download study materials. Gradesworld doesn’t endorse or validate content.</p>
              <p>4.2 The platform is provided “as is,” with no guarantees unless explicitly stated.</p>
            `,
                },
                {
                    title: '5. Uploading Study Materials',
                    content: `
              <ul>
                <li>5.1 Uploads can be free or paid. Your profile tracks your uploads and earnings.</li>
                <li>5.2 You manage your content via platform instructions.</li>
                <li>5.3 Set your own prices. First page may be previewed for free.</li>
                <li>5.4 We may insert ads automatically.</li>
                <li>5.5 Files may be converted or watermarked.</li>
                <li>5.6 You retain IP unless stated otherwise.</li>
                <li>5.7 By uploading, you confirm:
                  <ul>
                    <li>You own or have permission to upload the content</li>
                    <li>Content is legal and non-infringing</li>
                    <li>No payment is due to you from Gradesworld for uploads</li>
                    <li>You handle all third-party licensing</li>
                  </ul>
                </li>
                <li>5.8 You indemnify Gradesworld for IP or content-related claims.</li>
                <li>5.9 You grant a global license to operate the content until it’s deleted.</li>
                <li>5.10 For flashcards, all IP is transferred to Gradesworld or licensed exclusively if full transfer isn’t allowed.</li>
              </ul>
            `,
                },
                {
                    title: '6. Downloading Study Material',
                    content: `
              <ul>
                <li>6.1 Downloads require a profile. Deleted files must be re-downloaded.</li>
                <li>6.2 Content can be rated.</li>
                <li>6.3 Paid downloads require payment via listed methods.</li>
                <li>6.4 Refunds are only available for failed/defective downloads.</li>
              </ul>
            `,
                },
                {
                    title: '7. Payments',
                    content: `
              <ul>
                <li>7.1 Gradesworld facilitates payments but isn’t a contract party between users.</li>
                <li>7.2 Payments via PayPal/Stripe. Their terms apply.</li>
                <li>7.3 Service fees apply. Payout previews are real-time.</li>
                <li>7.4 Disputes require proof contradicting our records.</li>
                <li>7.5 Withdrawals allowed at $5 minimum. Weekly payouts. No interest on balances.</li>
                <li>7.6 Purchases are final; errors are your responsibility.</li>
                <li>7.7 You’re responsible for tax compliance.</li>
                <li>7.8 You authorize us to share info with payment providers.</li>
              </ul>
            `,
                },
                {
                    title: '8. Notice and Takedown Procedure',
                    content: `
              <ul>
                <li>8.1 Report copyright violations to <a href="mailto:abuse@gradesworld.com">abuse@gradesworld.com</a>.</li>
                <li>8.2 Include evidence, your contact info, and specific URL.</li>
                <li>8.3 Clearly infringing content will be removed.</li>
                <li>8.4 Weak or vague claims may be denied.</li>
                <li>8.5 Complainants indemnify Gradesworld.</li>
                <li>8.6 We don’t mediate user disputes.</li>
              </ul>
            `,
                },
                {
                    title: '9. Platform Availability',
                    content: `
              <ul>
                <li>9.1 Downtime may occur. No compensation guaranteed.</li>
                <li>9.2 Platform changes can be made without notice.</li>
                <li>9.3 We don’t guarantee uninterrupted service.</li>
              </ul>
            `,
                },
                {
                    title: '10. Intellectual Property Rights',
                    content: `
              <ul>
                <li>10.1 All content (except user uploads) belongs to Gradesworld or its licensors.</li>
                <li>10.2 You receive limited, non-transferable rights to use it.</li>
                <li>10.3 You may not alter/remove IP notices or branding.</li>
                <li>10.4 No ownership is transferred by these Terms.</li>
                <li>10.5 Scraping or reuse of content is prohibited.</li>
                <li>10.6 Study materials are for educational use only, not for academic submission.</li>
              </ul>
            `,
                },
                {
                    title: '11. Liability',
                    content: `
              <ul>
                <li>11.1 We aren’t liable for damages unless legally required.</li>
                <li>11.2 If liable, max compensation = insurance coverage or $500.</li>
                <li>11.3 Only direct damages are compensable.</li>
                <li>11.4 We’re not liable for lost profits/data unless due to gross misconduct.</li>
                <li>11.5 You’re responsible for complying with your school’s academic rules.</li>
              </ul>
            `,
                },
                {
                    title: '12. Force Majeure',
                    content: `
              <p>Gradesworld is not responsible for performance issues due to external factors like natural disasters, outages, or strikes.</p>
            `,
                },
                {
                    title: '13. Termination',
                    content: `
              <ul>
                <li>13.1 You may close your account anytime.</li>
                <li>13.2 We may suspend/delete accounts for violations.</li>
                <li>13.3 If banned, we may withhold part/all of your balance.</li>
                <li>13.4 Inactive accounts for 12 months may be deactivated.</li>
              </ul>
            `,
                },
                {
                    title: '14. Governing Law and Jurisdiction',
                    content: `
              <p>These Terms are governed by Kenyan law. Disputes will be resolved by Kenyan courts unless another jurisdiction is required by law.</p>
            `,
                },
                {
                    title: '15. Miscellaneous',
                    content: `
              <ul>
                <li>15.1 Invalid provisions will be replaced with enforceable ones reflecting the same intent.</li>
                <li>15.2 Gradesworld may assign its rights/obligations. Users will be notified.</li>
              </ul>
            `,
                },
            ],
        };
    },
};
</script>
