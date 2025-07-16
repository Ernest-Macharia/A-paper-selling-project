<template>
    <div class="container my-5">
        <h3 class="text-center mb-4">Earnings Summary</h3>

        <div class="row text-center">
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5>Total Earned</h5>
                        <p class="fs-4 text-primary">
                            {{ formatCurrency(walletSummary.total_earned, walletSummary.currency) }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5>Total Withdrawn</h5>
                        <p class="fs-4 text-danger">
                            {{
                                formatCurrency(
                                    walletSummary.total_withdrawn,
                                    walletSummary.currency,
                                )
                            }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5>Available Balance</h5>
                        <p class="fs-4 text-success">
                            {{
                                formatCurrency(
                                    walletSummary.available_balance,
                                    walletSummary.currency,
                                )
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-4">
            <button class="btn btn-success" @click="showModal = true">Request Withdrawal</button>
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
                                <option value="stripe">Stripe</option>
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
                            />
                        </div>
                    </div>
                    <div class="mb-3" v-if="!payoutInfo.stripe_account_id">
                        <p>You haven't connected your Stripe account yet.</p>
                        <a class="btn btn-outline-primary" :href="stripeConnectUrl">
                            Connect Stripe
                        </a>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="showModal = false">Cancel</button>
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
        };
    },
    computed: {
        ...mapState({
            payoutInfo: (state) => state.payment?.payoutInfo || {},
            walletSummary: (state) => state.payment?.walletSummary || {},
        }),
        getAccountPlaceholder() {
            switch (this.withdrawalForm.method) {
                case 'mpesa':
                    return 'e.g., +254712345678';
                case 'paypal':
                    return 'e.g., user@example.com';
                case 'stripe':
                    return 'e.g., acct_1234ABCDEF';
                default:
                    return '';
            }
        },
        canSubmit() {
            const { amount, method, account } = this.withdrawalForm;
            return amount && method && amount > 0 && account;
        },

        stripeConnectUrl() {
            const clientId = import.meta.env.VITE_STRIPE_CLIENT_ID;
            const redirectUri = encodeURIComponent(import.meta.env.VITE_STRIPE_REDIRECT_URI);
            return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUri}`;
        },
    },
    watch: {
        'withdrawalForm.method'(val) {
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
        ...mapActions('payment', ['fetchWalletSummary', 'fetchPayoutInfo', 'requestWithdrawal']),
        async loadSummary() {
            try {
                await Promise.all([this.fetchWalletSummary(), this.fetchPayoutInfo()]);
            } catch (err) {
                console.error('Error loading summary:', err);
            }
        },
        async submitWithdrawal() {
            this.isSubmitting = true;
            try {
                const { amount, method, account: destination, currency } = this.withdrawalForm;

                if (!amount || amount < 10) {
                    toast.warning('Minimum withdrawal is $10');
                    return;
                }

                if (amount > (this.walletSummary?.available_balance || 0)) {
                    toast.error('Insufficient wallet balance');
                    return;
                }

                await this.requestWithdrawal({ amount, method, destination, currency });

                toast.success('Withdrawal request submitted successfully');

                this.withdrawalForm = {
                    method: '',
                    account: '',
                    amount: null,
                    currency: 'USD',
                };
                this.showModal = false;
                await this.loadSummary();
            } catch (error) {
                toast.error('Withdrawal failed');
                console.error('Withdrawal error:', error);
            } finally {
                this.isSubmitting = false;
            }
        },
        formatCurrency(amount, currency = 'USD') {
            if (!amount) return `${currency} 0.00`;
            try {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency,
                    minimumFractionDigits: 2,
                }).format(amount);
            } catch {
                return `${currency} ${parseFloat(amount).toFixed(2)}`;
            }
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
