<template>
    <div class="container my-5">
        <!-- <div v-if="hasPendingWithdrawals" class="alert alert-warning text-center mb-4">
      💰 You have a pending or processing withdrawal. Payout is on the way!
    </div> -->
        <h3 class="text-center mb-4">Earnings Summary</h3>

        <!-- Wallet Summary -->
        <div class="row text-center">
            <div class="col-md-4 mb-3" v-for="(label, key) in summaryFields" :key="key">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5>{{ label }}</h5>
                        <p :class="summaryClass(key)" class="fs-4">
                            {{ formatCurrency(walletSummary[key], walletSummary.currency) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdraw Button -->
        <div class="text-center mt-4">
            <button class="btn btn-success" @click="showModal = true">Request Withdrawal</button>
        </div>

        <!-- Withdrawal Modal -->
        <div
            v-if="showModal"
            class="modal fade show d-block"
            tabindex="-1"
            style="background: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Request Withdrawal</h5>
                        <button class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Method -->
                        <div class="mb-3">
                            <label class="form-label">Method</label>
                            <select v-model="withdrawalForm.method" class="form-select">
                                <option value="" disabled>Select method</option>
                                <option value="mpesa">M-PESA</option>
                                <option value="paypal">PayPal</option>
                                <option value="stripe">Stripe</option>
                            </select>
                        </div>

                        <!-- Account -->
                        <div class="mb-3">
                            <label class="form-label">Account</label>
                            <input
                                type="text"
                                v-model="withdrawalForm.account"
                                :placeholder="getAccountPlaceholder"
                                class="form-control"
                            />
                            <div class="text-danger small" v-if="accountError">
                                {{ accountError }}
                            </div>
                        </div>

                        <!-- Amount -->
                        <div class="mb-3">
                            <label class="form-label">Amount (min $10)</label>
                            <input
                                type="number"
                                v-model.number="withdrawalForm.amount"
                                class="form-control"
                                min="10"
                            />
                            <div class="text-danger small" v-if="amountError">
                                {{ amountError }}
                            </div>
                        </div>

                        <!-- Currency -->
                        <div class="mb-3">
                            <label class="form-label">Currency</label>
                            <input
                                type="text"
                                v-model="withdrawalForm.currency"
                                class="form-control"
                            />
                        </div>

                        <!-- Stripe Warning -->
                        <div
                            class="alert alert-warning"
                            v-if="
                                withdrawalForm.method === 'stripe' &&
                                (!payoutInfo || !payoutInfo.stripe_account_id)
                            "
                        >
                            <p>You haven't connected your Stripe account yet.</p>
                            <a class="btn btn-outline-primary btn-sm" :href="stripeConnectUrl"
                                >Connect Stripe</a
                            >
                        </div>
                    </div>

                    <div class="modal-footer">
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
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdrawals Table -->
        <div class="mt-5">
            <h5>Withdrawal History</h5>

            <!-- Filters & Sort -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <select class="form-select w-auto" v-model="filterMethod">
                    <option value="">All Methods</option>
                    <option value="mpesa">M-PESA</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                </select>

                <select class="form-select w-auto" v-model="sortOption">
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="amount_desc">Amount (High → Low)</option>
                    <option value="amount_asc">Amount (Low → High)</option>
                </select>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Date</th>
                            <th>Method</th>
                            <th>Account</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredWithdrawals.length === 0">
                            <td colspan="5" class="text-center">No withdrawals found.</td>
                        </tr>
                        <tr v-for="w in paginatedWithdrawals" :key="w.id">
                            <td>{{ formatDate(w.created_at) }}</td>
                            <td class="text-uppercase">{{ w.method }}</td>
                            <td>{{ w.destination }}</td>
                            <td>{{ formatCurrency(w.amount) }}</td>
                            <td>
                                <span :class="getStatusClass(w.status)">{{ w.status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
                <small
                    >Showing {{ paginatedWithdrawals.length }} of
                    {{ filteredWithdrawals.length }} withdrawals</small
                >
                <div>
                    <button
                        class="btn btn-sm btn-outline-secondary me-2"
                        @click="prevPage"
                        :disabled="currentPage === 1"
                    >
                        Prev
                    </button>
                    <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="nextPage"
                        :disabled="currentPage >= totalPages"
                    >
                        Next
                    </button>
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
                total_earned: 'Total Earned',
                total_withdrawn: 'Total Withdrawn',
                available_balance: 'Available Balance',
            };
        },
        canSubmit() {
            return (
                this.withdrawalForm.amount &&
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
        hasPendingWithdrawals() {
            return this.withdrawals?.some((w) => ['pending', 'processing'].includes(w.status));
        },
        getAccountPlaceholder() {
            switch (this.withdrawalForm.method) {
                case 'paypal':
                    return 'e.g., user@example.com';
                case 'mpesa':
                    return 'e.g., +254712345678';
                case 'stripe':
                    return 'e.g., acct_123ABC456';
                default:
                    return '';
            }
        },
    },
    watch: {
        'withdrawalForm.method'(val) {
            if (!val || !this.payoutInfo) return;
            if (val === 'paypal') this.withdrawalForm.account = this.payoutInfo.paypal_email || '';
            else if (val === 'stripe')
                this.withdrawalForm.account = this.payoutInfo.stripe_account_id || '';
            else if (val === 'mpesa')
                this.withdrawalForm.account = this.payoutInfo.mpesa_phone || '';
        },
        'withdrawalForm.amount'(val) {
            const available = this.walletSummary?.available_balance || 0;
            this.amountError =
                !val || val < 10
                    ? 'Minimum withdrawal is $10'
                    : val > available
                      ? 'Amount exceeds available balance'
                      : '';
        },
        'withdrawalForm.account'(val) {
            const method = this.withdrawalForm.method;
            if (method === 'paypal' && !this.validateEmail(val)) {
                this.accountError = 'Invalid PayPal email';
            } else if (method === 'mpesa' && !this.validatePhone(val)) {
                this.accountError = 'Phone must be in format +2547XXXXXXX';
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
                if (method === 'paypal') await this.updatePayoutInfo({ paypal_email: destination });
                else if (method === 'mpesa')
                    await this.updatePayoutInfo({ mpesa_phone: destination });

                await this.requestWithdrawal({ amount, method, destination, currency });
                toast.success('Withdrawal submitted');
                this.closeModal();
                await this.loadSummary();
            } catch (err) {
                toast.error(err?.response?.data?.non_field_errors?.[0] || 'Withdrawal failed');
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
            if (!amount) return `${currency} 0.00`;
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                minimumFractionDigits: 2,
            }).format(amount);
        },
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        },
        getStatusClass(status) {
            switch (status) {
                case 'approved':
                    return 'badge bg-success';
                case 'pending':
                    return 'badge bg-warning text-dark';
                case 'rejected':
                    return 'badge bg-danger';
                default:
                    return 'badge bg-secondary';
            }
        },
        summaryClass(key) {
            if (key === 'total_earned') return 'text-primary';
            if (key === 'total_withdrawn') return 'text-danger';
            if (key === 'available_balance') return 'text-success';
            return '';
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },

        async loadSummary() {
            await Promise.all([
                this.fetchWalletSummary(),
                this.fetchPayoutInfo(),
                this.fetchWithdrawalRequests(),
            ]);
        },
    },
    mounted() {
        this.loadSummary();
    },
};
</script>

<style scoped>
.modal {
    display: block;
}
</style>
