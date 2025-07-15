<template>
    <div class="container my-4">
        <!-- Tabs and Withdrawal Button -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="btn-group">
                <button
                    v-for="tab in tabs"
                    :key="tab"
                    class="btn"
                    :class="activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'"
                    @click="activeTab = tab"
                >
                    {{ tab }}
                </button>
            </div>
            <button class="btn btn-success" @click="showModal = true">Request Withdrawal</button>
        </div>

        <div class="alert alert-info">
            Wallet Balance: <strong>${{ walletSummary.balance?.toFixed(2) || '0.00' }}</strong>
        </div>

        <!-- Earnings Table -->
        <div class="table-responsive bg-white p-3 rounded shadow">
            <table class="table table-striped table-hover">
                <thead class="table-light">
                    <tr>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Account</th>
                        <th>Currency</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="earning in filteredEarnings" :key="earning.id">
                        <td>${{ earning.amount }}</td>
                        <td>{{ earning.method }}</td>
                        <td>{{ earning.destination || '-' }}</td>
                        <td>{{ earning.currency || 'USD' }}</td>
                        <td>
                            <span
                                class="badge"
                                :class="
                                    earning.status === 'withdrawn'
                                        ? 'bg-success'
                                        : 'bg-warning text-dark'
                                "
                            >
                                {{ earning.status }}
                            </span>
                        </td>
                        <td>{{ new Date(earning.created_at).toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Withdrawal Modal -->
        <div
            class="modal fade show d-block"
            tabindex="-1"
            v-if="showModal"
            style="background: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Request Withdrawal</h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Method</label>
                            <select v-model="withdrawalForm.method" class="form-select">
                                <option value="" disabled>Select method</option>
                                <option value="mpesa">M-PESA</option>
                                <option value="paypal">PayPal</option>
                                <option value="visa">Visa</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Account</label>
                            <input
                                type="text"
                                v-model="withdrawalForm.account"
                                :placeholder="getAccountPlaceholder"
                                class="form-control"
                                disabled
                            />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Amount</label>
                            <input
                                type="number"
                                v-model="withdrawalForm.amount"
                                class="form-control"
                            />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Currency</label>
                            <input
                                type="text"
                                v-model="withdrawalForm.currency"
                                class="form-control"
                                placeholder="e.g., USD"
                            />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showModal = false">
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            :disabled="
                                isSubmitting ||
                                !withdrawalForm.amount ||
                                !withdrawalForm.method ||
                                withdrawalForm.amount <= 0
                            "
                            @click="submitWithdrawal"
                        >
                            <span
                                v-if="isSubmitting"
                                class="spinner-border spinner-border-sm me-2"
                            />
                            Submit
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
    name: 'Earnings',
    data() {
        return {
            activeTab: 'Withdrawals',
            showModal: false,
            tabs: ['Withdrawals', 'Unpaid', 'All Earnings'],
            withdrawalForm: {
                method: '',
                account: '',
                amount: null,
                currency: 'USD',
            },
            isSubmitting: false,
        };
    },
    computed: {
        ...mapState({
            earnings: (state) => state.papers?.earnings || [],
            withdrawals: (state) => state.papers?.withdrawals || [],
            payoutInfo: (state) => state.papers?.payoutInfo || {},
            walletSummary: (state) => state.papers?.walletSummary || {},
        }),
        filteredEarnings() {
            if (this.activeTab === 'Withdrawals') {
                return this.withdrawals.filter(
                    (e) => e.status === 'paid' || e.status === 'approved',
                );
            } else if (this.activeTab === 'Unpaid') {
                return this.withdrawals.filter((e) => e.status !== 'paid');
            } else {
                return this.withdrawals;
            }
        },
        getAccountPlaceholder() {
            switch (this.withdrawalForm.method) {
                case 'mpesa':
                    return 'e.g., +254712345678';
                case 'paypal':
                    return 'e.g., user@example.com';
                case 'visa':
                    return 'e.g., 4111 1111 1111 1111';
                default:
                    return '';
            }
        },
    },
    watch: {
        'withdrawalForm.method'(val) {
            // Auto-fill account from payoutInfo
            if (val && this.payoutInfo) {
                if (val === 'paypal') {
                    this.withdrawalForm.account = this.payoutInfo.paypal_email || '';
                } else if (val === 'stripe') {
                    this.withdrawalForm.account = this.payoutInfo.stripe_account_id || '';
                } else if (val === 'mpesa') {
                    this.withdrawalForm.account = this.payoutInfo.mpesa_phone || '';
                } else {
                    this.withdrawalForm.account = '';
                }
            }
        },
    },
    methods: {
        ...mapActions('papers', [
            'fetchEarnings',
            'fetchWithdrawalRequests',
            'requestWithdrawal',
            'fetchPayoutInfo',
            'fetchWalletSummary',
        ]),
        async loadDashboardData() {
            try {
                await Promise.all([
                    this.fetchEarnings(),
                    this.fetchWithdrawalRequests(),
                    this.fetchPayoutInfo(),
                    this.fetchWalletSummary(),
                ]);
            } catch (error) {
                console.error('Dashboard load error:', error);
            }
        },
        async submitWithdrawal() {
            this.isSubmitting = true;
            try {
                const { amount, method } = this.withdrawalForm;
                if (!amount || amount < 10) {
                    toast.warning('Minimum withdrawal is $10');
                    return;
                }
                if (amount > (this.walletSummary?.balance || 0)) {
                    toast.error('Insufficient wallet balance');
                    return;
                }

                await this.requestWithdrawal({ amount, method });

                this.showModal = false;
                this.withdrawalForm = {
                    method: '',
                    account: '',
                    amount: null,
                    currency: 'USD',
                };
                toast.success('Withdrawal request submitted successfully');
                await this.loadDashboardData();
            } catch {
                toast.error('Withdrawal failed');
            } finally {
                this.isSubmitting = false;
            }
        },
    },
    mounted() {
        this.loadDashboardData();
    },
};
</script>

<style scoped>
.modal {
    display: block;
}
</style>
