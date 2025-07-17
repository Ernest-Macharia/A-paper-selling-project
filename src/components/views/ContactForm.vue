<template>
    <div class="contact-form">
        <form @submit.prevent="submitContactForm" class="needs-validation" novalidate>
            <div class="mb-4">
                <label for="name" class="form-label fw-semibold"
                    >Full Name <span class="text-danger">*</span></label
                >
                <div class="input-group">
                    <span class="input-group-text bg-light">
                        <i class="bi bi-person text-muted"></i>
                    </span>
                    <input
                        v-model="form.name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.name }"
                        @input="clearFormErrors('name')"
                        id="name"
                        placeholder="John Doe"
                        required
                    />
                    <div v-if="formErrors.name" class="invalid-feedback">
                        {{ formErrors.name }}
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <label for="email" class="form-label fw-semibold"
                    >Email Address <span class="text-danger">*</span></label
                >
                <div class="input-group">
                    <span class="input-group-text bg-light">
                        <i class="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                        v-model="form.email"
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': formErrors.email }"
                        @input="clearFormErrors('email')"
                        id="email"
                        placeholder="example@domain.com"
                        required
                    />
                    <div v-if="formErrors.email" class="invalid-feedback">
                        {{ formErrors.email }}
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <label for="message" class="form-label fw-semibold"
                    >Your Message <span class="text-danger">*</span></label
                >
                <textarea
                    v-model="form.message"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.message }"
                    id="message"
                    rows="5"
                    placeholder="Type your message here..."
                    required
                ></textarea>
                <div v-if="formErrors.message" class="invalid-feedback">
                    {{ formErrors.message }}
                </div>
            </div>

            <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary btn-lg py-3 fw-semibold">
                    <span v-if="!isSubmitting"> <i class="bi bi-send me-2"></i>Send Message </span>
                    <span
                        v-else
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    ></span>
                </button>
            </div>
        </form>
    </div>
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
            isSubmitting: false,
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
                this.formErrors.name = 'Full name is required';
                valid = false;
            }

            if (!this.form.email.trim()) {
                this.formErrors.email = 'Email is required';
                valid = false;
            } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
                this.formErrors.email = 'Please enter a valid email address';
                valid = false;
            }

            if (!this.form.message.trim()) {
                this.formErrors.message = 'Message cannot be empty';
                valid = false;
            } else if (this.form.message.trim().length < 10) {
                this.formErrors.message = 'Message should be at least 10 characters';
                valid = false;
            }

            return valid;
        },
        async submitContactForm() {
            if (!this.validateContactForm()) return;

            this.isSubmitting = true;

            try {
                await this.sendContactMessage(this.form);
                toast.success('Your message has been sent successfully!', {
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'colored',
                });
                this.form = { name: '', email: '', message: '' };
            } catch (err) {
                const errors = err.response?.data;
                if (errors?.email) {
                    this.formErrors.email = errors.email[0];
                } else {
                    toast.error(
                        errors?.detail || 'Failed to send message. Please try again later.',
                        {
                            position: toast.POSITION.TOP_CENTER,
                            theme: 'colored',
                        },
                    );
                }
            } finally {
                this.isSubmitting = false;
            }
        },
    },
};
</script>

<style scoped>
.contact-form .form-control {
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    border: 1px solid #dee2e6;
    transition: all 0.2s ease;
}

.contact-form .form-control:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.contact-form .input-group-text {
    border-radius: 0.375rem 0 0 0.375rem;
    border-right: none;
}

.contact-form .is-invalid {
    border-color: #dc3545;
}

.contact-form .is-invalid:focus {
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.contact-form textarea.form-control {
    min-height: 150px;
}

.btn-primary {
    background-color: #0d6efd;
    border: none;
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background-color: #0b5ed7;
    transform: translateY(-1px);
}

.btn-primary:active {
    transform: translateY(0);
}
</style>
