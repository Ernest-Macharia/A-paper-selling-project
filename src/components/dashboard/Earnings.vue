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
                        <td>{{ earning.account }}</td>
                        <td>{{ earning.currency }}</td>
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
                        <button type="button" class="btn btn-primary" @click="submitWithdrawal">
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
                currency: '',
            },
        };
    },
    computed: {
        ...mapState({
            earnings: (state) => state.papers?.earnings || [],
            withdrawals: (state) => state.papers?.withdrawals || [],
        }),
        filteredEarnings() {
            const source = this.withdrawals || [];

            if (this.activeTab === 'Withdrawals') {
                return source.filter((e) => e.status === 'withdrawn');
            } else if (this.activeTab === 'Unpaid') {
                return source.filter((e) => e.status === 'unpaid');
            } else {
                return source;
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
    methods: {
        ...mapActions('papers', ['fetchEarnings', 'fetchWithdrawals', 'submitWithdrawal']),
        async loadDashboardData() {
            try {
                await Promise.all([this.fetchEarnings(), this.fetchWithdrawals()]);
            } catch (error) {
                console.error('Dashboard load error:', error);
            }
        },
        async submitWithdrawal() {
            try {
                const payload = { ...this.withdrawalForm };
                await this.submitWithdrawal(payload);
                this.showModal = false;
                this.withdrawalForm = {
                    method: '',
                    account: '',
                    amount: null,
                    currency: '',
                };
                await this.loadDashboardData();
            } catch (error) {
                console.error('Withdrawal failed:', error);
                alert(error?.response?.data?.detail || 'Withdrawal request failed');
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
