<template>
    <Navbar />
    <section class="page-section py-5">
        <div class="container">
            <h1 class="fw-bold text-primary-emphasis mb-4 text-center">
                Frequently Asked Questions
            </h1>
            <div class="accordion" id="faqAccordion">
                <div class="accordion-item" v-for="(item, index) in faqs" :key="index">
                    <h2 class="accordion-header" :id="`heading${index}`">
                        <button
                            class="accordion-button collapsed d-flex justify-content-between align-items-center"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`#collapse${index}`"
                            aria-expanded="false"
                            :aria-controls="`collapse${index}`"
                        >
                            {{ item.question }}
                        </button>
                    </h2>
                    <div
                        :id="`collapse${index}`"
                        class="accordion-collapse collapse"
                        :aria-labelledby="`heading${index}`"
                        data-bs-parent="#faqAccordion"
                    >
                        <div class="accordion-body" v-html="item.answer"></div>
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
            faqs: [
                {
                    question: 'I Don’t Have a Credit Card—How Can I Pay?',
                    answer: `
              <p>No Credit Card? No Worries! At Gradesworld, payment methods differ depending on your country. When you're ready to check out, you’ll see the available payment options specific to your region.</p>
              <ul>
                <li>Select one of the other payment methods shown during checkout.</li>
                <li>Ask a trusted friend or family member to assist with the payment.</li>
              </ul>
              <p>Need more help? Our support team is ready for you! Just use the chat pop-up at the bottom-right corner of the Gradesworld website or send us an email at <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>.</p>
            `,
                },
                {
                    question: 'Why Sell Notes on Gradesworld?',
                    answer: `
              <p>Selling your notes on Gradesworld is a win for everyone! You get to earn extra money while helping fellow students succeed.</p>
              <p>Whether it's exam prep, essay outlines, or textbook summaries, your effort can help others excel. You’ll build a stream of passive income while contributing to a thriving learning community.</p>
            `,
                },
                {
                    question: 'In What Format are Documents Downloaded from Gradesworld?',
                    answer: `
              <p>Documents are downloaded in PDF format for consistency. Exceptions include PowerPoint presentations and ZIP folders, which retain their original format.</p>
              <p>Need assistance with your download? Reach out—we’re here to help!</p>
            `,
                },
                {
                    question: 'In What Format Should I Upload Documents to Gradesworld?',
                    answer: `
              <p>For best results, convert your files to PDF before uploading. This keeps your formatting intact and presents your work professionally.</p>
            `,
                },
                {
                    question: 'Can I Print the Documents I Purchased on Gradesworld?',
                    answer: `
              <p>Absolutely! Just follow these steps:</p>
              <ol>
                <li>Log in to your account.</li>
                <li>Click your profile icon > Downloads.</li>
                <li>Download the file and press Ctrl + P (Windows) or Cmd + P (Mac) to print.</li>
              </ol>
            `,
                },
                {
                    question: "Can I Distribute Documents I've Purchased on Gradesworld?",
                    answer: `
              <p>No. Purchased documents are for personal study only. Sharing them violates copyright laws and can result in legal consequences.</p>
              <p>Respect content creators by using materials ethically.</p>
            `,
                },
                {
                    question: 'Can Everyone Upload Documents to Gradesworld?',
                    answer: `
              <p>Yes! Anyone can upload their original content. Just make sure you’re not uploading someone else’s work.</p>
            `,
                },
                {
                    question: 'How Do I Download a Document on Gradesworld?',
                    answer: `
              <ol>
                <li>Log in to your account.</li>
                <li>Purchase the document.</li>
                <li>Go to Downloads in your profile menu.</li>
                <li>Click “Open” next to the document, accept the terms, and the download will begin.</li>
              </ol>
              <p>Note: Once downloaded, refunds are not available. Contact support if you have issues.</p>
            `,
                },
                {
                    question:
                        'The Layout of my Document Has Changed After Downloading—How Can I Fix This?',
                    answer: `
              <p>If formatting issues occur:</p>
              <ul>
                <li>Contact the seller for a corrected version.</li>
                <li>If unresolved, email <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>.</li>
              </ul>
            `,
                },
                {
                    question: 'What Can I Do if I Have a Question About the Content of a Document?',
                    answer: `
              <p>Reach out to the seller directly via the “send the seller a message” link on the document page. If needed, contact our support team through chat or email.</p>
            `,
                },
                {
                    question:
                        'What Should I Do if I Can’t Find My Purchased Document in My Account?',
                    answer: `
              <ul>
                <li>Wait up to 10 minutes after purchase.</li>
                <li>Verify your payment succeeded.</li>
                <li>If it's still missing, use the chat pop-up or email <a href="mailto:support@gradesworld.com">support@gradesworld.com</a>.</li>
              </ul>
            `,
                },
            ],
        };
    },
};
</script>
