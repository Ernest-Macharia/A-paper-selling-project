<template>
    <section
        class="contact-form-section d-flex align-items-center justify-content-center py-5"
        data-aos="fade-up"
    >
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6 col-md-8">
                    <div class="card p-4 shadow-sm rounded-4">
                        <h2 class="text-center text-primary-emphasis mb-4 fw-bold">
                            We would Love to Hear from You
                        </h2>
                        <form @submit.prevent="submitContactForm">
                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name</label>
                                <input
                                    v-model="form.name"
                                    type="text"
                                    class="form-control"
                                    @input="clearFormErrors('name')"
                                    id="name"
                                    required
                                />
                                <div v-if="formErrors.name" class="text-danger mt-1">
                                    {{ formErrors.name }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email Address</label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    class="form-control"
                                    @input="clearFormErrors('email')"
                                    id="email"
                                    required
                                />
                                <div v-if="formErrors.email" class="text-danger mt-1">
                                    {{ formErrors.email }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="message" class="form-label">Message</label>
                                <textarea
                                    v-model="form.message"
                                    class="form-control"
                                    id="message"
                                    rows="5"
                                    required
                                ></textarea>
                                <div v-if="formErrors.message" class="text-danger mt-1">
                                    {{ formErrors.message }}
                                </div>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-outline-primary px-5">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'ContactForm',
    data() {
        return {
            form: {
                name: '',
                email: '',
                message: '',
            },
            formErrors: {
                name: '',
                email: '',
                message: '',
            },
        };
    },
    methods: {
        ...mapActions('communications', ['sendContactMessage']),
        clearFormErrors(field) {
            this.formErrors[field] = '';
        },
        validateContactForm() {
            this.formErrors = { name: '', email: '', message: '' };
            let valid = true;

            if (!this.form.name.trim()) {
                this.formErrors.name = 'Full name is required.';
                valid = false;
            }

            if (!this.form.email.trim()) {
                this.formErrors.email = 'Email is required.';
                valid = false;
            } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
                this.formErrors.email = 'Enter a valid email address.';
                valid = false;
            }

            if (!this.form.message.trim()) {
                this.formErrors.message = 'Message cannot be empty.';
                valid = false;
            }

            return valid;
        },
        async submitContactForm() {
            if (!this.validateContactForm()) return;

            try {
                await this.sendContactMessage(this.form);
                toast.success('Message sent successfully!');
                this.form = { name: '', email: '', message: '' };
            } catch (err) {
                const errors = err.response?.data;
                if (errors?.email) {
                    this.formErrors.email = errors.email[0];
                } else {
                    toast.error(errors?.detail || 'Failed to send message.');
                }
            }
        },
    },
};
</script>

<style scoped>
.contact-form-section {
    background-color: #f4f6fc;
}
.contact-form-section .card {
    border: none;
    background-color: #fff;
    border-radius: 16px;
}
.contact-form-section .form-control {
    border-radius: 12px;
    padding: 0.75rem 1rem;
}
.contact-form-section .btn-accent {
    color: #fff;
    border-radius: 30px;
}
.contact-form-section .btn-accent:hover {
    background-color: #3e44b1;
}
</style>
