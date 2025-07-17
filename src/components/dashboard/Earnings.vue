<template>
    <div class="container py-4">
        <!-- Earnings Summary Cards -->
        <div class="row mb-5">
            <div class="col-12">
                <h2 class="fw-bold mb-4">Earnings Dashboard</h2>

                <!-- Summary Cards -->
                <div class="row g-4">
                    <div class="col-md-4" v-for="(label, key) in summaryFields" :key="key">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center p-4">
                                <h6 class="text-muted mb-3">{{ label }}</h6>
                                <h3 :class="summaryClass(key)" class="fw-bold">
                                    {{ formatCurrency(walletSummary[key], walletSummary.currency) }}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Withdraw Button -->
                <div class="text-center mt-4">
                    <button
                        class="btn btn-primary btn-lg"
                        @click="showModal = true"
                        :disabled="walletSummary?.available_balance < 10"
                    >
                        <i class="bi bi-cash-stack me-2"></i>Request Withdrawal
                    </button>
                    <p v-if="walletSummary?.available_balance < 10" class="text-muted mt-2 small">
                        Minimum withdrawal amount is $10
                    </p>
                </div>
            </div>
        </div>

        <!-- Withdrawal Modal -->
        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div
            v-if="showModal"
            class="modal fade show d-block"
            tabindex="-1"
            aria-modal="true"
            role="dialog"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header border-0">
                        <h5 class="modal-title fw-bold">Request Withdrawal</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Method Selection -->
                        <div class="mb-4">
                            <label class="form-label fw-semibold">Payment Method</label>
                            <div class="btn-group w-100" role="group">
                                <button
                                    v-for="method in paymentMethods"
                                    :key="method.value"
                                    type="button"
                                    class="btn btn-outline-primary"
                                    :class="{ active: withdrawalForm.method === method.value }"
                                    @click="withdrawalForm.method = method.value"
                                >
                                    <i :class="method.icon" class="me-2"></i>{{ method.label }}
                                </button>
                            </div>
                        </div>

                        <!-- Account Details -->
                        <div class="mb-4">
                            <label class="form-label fw-semibold">
                                {{ methodLabels[withdrawalForm.method] || 'Account Details' }}
                            </label>
                            <input
                                type="text"
                                v-model="withdrawalForm.account"
                                :placeholder="getAccountPlaceholder"
                                class="form-control form-control-lg"
                                :class="{ 'is-invalid': accountError }"
                            />
                            <div class="invalid-feedback" v-if="accountError">
                                {{ accountError }}
                            </div>
                        </div>

                        <!-- Amount -->
                        <div class="mb-4">
                            <label class="form-label fw-semibold">Amount</label>
                            <div class="input-group">
                                <span class="input-group-text">{{ withdrawalForm.currency }}</span>
                                <input
                                    type="number"
                                    v-model.number="withdrawalForm.amount"
                                    class="form-control form-control-lg"
                                    :class="{ 'is-invalid': amountError }"
                                    min="10"
                                    :max="walletSummary?.available_balance"
                                />
                            </div>
                            <div class="invalid-feedback" v-if="amountError">
                                {{ amountError }}
                            </div>
                            <small class="text-muted">
                                Available: {{ formatCurrency(walletSummary?.available_balance) }}
                            </small>
                        </div>

                        <!-- Stripe Connect Notice -->
                        <div
                            v-if="
                                withdrawalForm.method === 'stripe' && !payoutInfo?.stripe_account_id
                            "
                            class="alert alert-warning"
                        >
                            <div class="d-flex align-items-center">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>
                                    <p class="mb-1">
                                        You need to connect your Stripe account first
                                    </p>
                                    <a :href="stripeConnectUrl" class="btn btn-sm btn-warning">
                                        Connect Stripe
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button class="btn btn-secondary" @click="closeModal">Cancel</button>
                        <button
                            class="btn btn-primary"
                            :disabled="isSubmitting || !canSubmit"
                            @click="submitWithdrawal"
                        >
                            <span
                                v-if="isSubmitting"
                                class="spinner-border spinner-border-sm me-2"
                            ></span>
                            Submit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdrawal History -->
        <div class="card border-0 shadow-sm mt-5">
            <div class="card-body">
                <div
                    class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4"
                >
                    <h5 class="fw-bold mb-3 mb-md-0">Withdrawal History</h5>

                    <!-- Filters -->
                    <div class="d-flex gap-2">
                        <select v-model="filterMethod" class="form-select form-select-sm w-auto">
                            <option value="">All Methods</option>
                            <option
                                v-for="method in paymentMethods"
                                :value="method.value"
                                :key="method.value"
                            >
                                {{ method.label }}
                            </option>
                        </select>

                        <select v-model="sortOption" class="form-select form-select-sm w-auto">
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                            <option value="amount_desc">Amount (High → Low)</option>
                            <option value="amount_asc">Amount (Low → High)</option>
                        </select>
                    </div>
                </div>

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Account</th>
                                <th class="text-end">Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredWithdrawals.length === 0">
                                <td colspan="5" class="text-center py-4 text-muted">
                                    No withdrawal history found
                                </td>
                            </tr>
                            <tr v-for="w in paginatedWithdrawals" :key="w.id">
                                <td>{{ formatDate(w.created_at) }}</td>
                                <td>
                                    <span class="badge bg-light text-dark text-uppercase">
                                        {{ w.method }}
                                    </span>
                                </td>
                                <td class="text-truncate" style="max-width: 150px">
                                    {{ w.destination }}
                                </td>
                                <td class="text-end fw-bold">
                                    {{ formatCurrency(w.amount) }}
                                </td>
                                <td>
                                    <span :class="getStatusClass(w.status)" class="badge">
                                        {{ w.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small class="text-muted">
                        Showing {{ paginatedWithdrawals.length }} of
                        {{ filteredWithdrawals.length }} records
                    </small>
                    <div class="btn-group">
                        <button
                            class="btn btn-sm btn-outline-primary"
                            @click="prevPage"
                            :disabled="currentPage === 1"
                        >
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <button
                            class="btn btn-sm btn-outline-primary"
                            @click="nextPage"
                            :disabled="currentPage >= totalPages"
                        >
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'EarningsSummary',
    data() {
        return {
            showModal: false,
            withdrawalForm: {
                method: '',
                account: '',
                amount: null,
                currency: 'USD',
            },
            paymentMethods: [
                { value: 'mpesa', label: 'M-Pesa', icon: 'bi bi-phone' },
                { value: 'paypal', label: 'PayPal', icon: 'bi bi-paypal' },
                { value: 'stripe', label: 'Stripe', icon: 'bi bi-credit-card' },
            ],
            methodLabels: {
                mpesa: 'M-Pesa Phone Number',
                paypal: 'PayPal Email',
                stripe: 'Stripe Account',
            },
            isSubmitting: false,
            amountError: '',
            accountError: '',
            currentPage: 1,
            perPage: 10,
            filterMethod: '',
            sortOption: 'date_desc',
        };
    },
    computed: {
        ...mapState('payment', ['payoutInfo', 'walletSummary', 'withdrawals']),
        stripeConnectUrl() {
            const clientId = import.meta.env.VITE_STRIPE_CLIENT_ID;
            const redirectUri = encodeURIComponent(import.meta.env.VITE_STRIPE_REDIRECT_URI);
            return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUri}`;
        },
        summaryFields() {
            return {
                total_earned: 'Total Earnings',
                total_withdrawn: 'Total Withdrawn',
                available_balance: 'Available Balance',
            };
        },
        canSubmit() {
            return (
                this.withdrawalForm.amount >= 10 &&
                this.withdrawalForm.account &&
                this.withdrawalForm.method &&
                !this.amountError &&
                !this.accountError
            );
        },
        filteredWithdrawals() {
            const list = this.withdrawals?.results || [];
            let filtered = [...list];

            if (this.filterMethod) {
                filtered = filtered.filter((w) => w.method === this.filterMethod);
            }

            switch (this.sortOption) {
                case 'date_desc':
                    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'date_asc':
                    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    break;
                case 'amount_desc':
                    filtered.sort((a, b) => b.amount - a.amount);
                    break;
                case 'amount_asc':
                    filtered.sort((a, b) => a.amount - b.amount);
                    break;
            }

            return filtered;
        },
        paginatedWithdrawals() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredWithdrawals.slice(start, start + this.perPage);
        },
        totalPages() {
            return Math.ceil(this.filteredWithdrawals.length / this.perPage);
        },
        getAccountPlaceholder() {
            switch (this.withdrawalForm.method) {
                case 'paypal':
                    return 'your@email.com';
                case 'mpesa':
                    return 'e.g. +254712345678';
                case 'stripe':
                    return 'Stripe account ID';
                default:
                    return 'Enter account details';
            }
        },
    },
    watch: {
        'withdrawalForm.method'(val) {
            if (!val || !this.payoutInfo) return;
            this.withdrawalForm.account =
                val === 'paypal'
                    ? this.payoutInfo.paypal_email || ''
                    : val === 'stripe'
                      ? this.payoutInfo.stripe_account_id || ''
                      : val === 'mpesa'
                        ? this.payoutInfo.mpesa_phone || ''
                        : '';
        },
        'withdrawalForm.amount'(val) {
            const available = this.walletSummary?.available_balance || 0;
            this.amountError =
                val < 10
                    ? 'Minimum withdrawal is $10'
                    : val > available
                      ? 'Exceeds available balance'
                      : '';
        },
        'withdrawalForm.account'(val) {
            const method = this.withdrawalForm.method;
            if (method === 'paypal' && !this.validateEmail(val)) {
                this.accountError = 'Please enter a valid email';
            } else if (method === 'mpesa' && !this.validatePhone(val)) {
                this.accountError = 'Please include country code (e.g. +254...)';
            } else {
                this.accountError = '';
            }
        },
    },
    methods: {
        ...mapActions('payment', [
            'fetchWalletSummary',
            'fetchPayoutInfo',
            'fetchWithdrawalRequests',
            'requestWithdrawal',
            'updatePayoutInfo',
        ]),
        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        validatePhone(phone) {
            return /^\+\d{10,15}$/.test(phone);
        },
        async submitWithdrawal() {
            this.isSubmitting = true;
            try {
                const { amount, method, account: destination, currency } = this.withdrawalForm;

                // Update payout info if needed
                if (method === 'paypal') {
                    await this.updatePayoutInfo({ paypal_email: destination });
                } else if (method === 'mpesa') {
                    await this.updatePayoutInfo({ mpesa_phone: destination });
                }

                await this.requestWithdrawal({ amount, method, destination, currency });
                toast.success('Withdrawal request submitted successfully');
                this.closeModal();
                await this.loadSummary();
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Withdrawal request failed');
                console.error(err);
            } finally {
                this.isSubmitting = false;
            }
        },
        closeModal() {
            this.showModal = false;
            this.withdrawalForm = { method: '', account: '', amount: null, currency: 'USD' };
            this.amountError = '';
            this.accountError = '';
        },
        formatCurrency(amount, currency = 'USD') {
            if (amount === null || amount === undefined) return `${currency} 0.00`;
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                minimumFractionDigits: 2,
            }).format(amount);
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
        getStatusClass(status) {
            switch (status?.toLowerCase()) {
                case 'approved':
                    return 'bg-success';
                case 'pending':
                    return 'bg-warning text-dark';
                case 'processing':
                    return 'bg-info';
                case 'rejected':
                    return 'bg-danger';
                default:
                    return 'bg-secondary';
            }
        },
        summaryClass(key) {
            return {
                'text-primary': key === 'total_earned',
                'text-danger': key === 'total_withdrawn',
                'text-success': key === 'available_balance',
            };
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        async loadSummary() {
            try {
                await Promise.all([
                    this.fetchWalletSummary(),
                    this.fetchPayoutInfo(),
                    this.fetchWithdrawalRequests(),
                ]);
            } catch (error) {
                toast.error('Failed to load earnings data');
                console.error(error);
            }
        },
    },
    mounted() {
        this.loadSummary();
    },
};
</script>

<style scoped>
.modal-backdrop {
    opacity: 0.5;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000;
}

.modal {
    z-index: 1050;
}

.card {
    border-radius: 0.75rem;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
}

.table {
    --bs-table-hover-bg: rgba(var(--bs-primary-rgb), 0.05);
}

.badge {
    padding: 0.5em 0.75em;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.btn-group .btn {
    transition: all 0.2s ease;
}

.btn-group .btn.active {
    background-color: var(--bs-primary);
    color: white;
    border-color: var(--bs-primary);
}

.form-control-lg {
    padding: 0.75rem 1rem;
}
</style>
