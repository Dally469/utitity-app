<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-bolt text-white text-2xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">UtiliPay</h1>
              <p class="text-xs text-gray-500">Real-time Cashback Platform</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right hidden sm:block">
              <p class="text-sm text-gray-600">Welcome back,</p>
              <p class="text-sm font-semibold text-gray-900">
                {{ authStore.user?.fullName }} - Account No: {{ authStore.user?.phoneNumber }}
              </p>
            </div>
            <Button label="Logout" icon="pi pi-sign-out" class="p-button-outlined p-button-sm" @click="handleLogout" />
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="dashboardStore.loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <i class="pi pi-spin pi-spinner text-5xl text-blue-600 mb-4"></i>
      <p class="text-lg text-gray-600">Loading your dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="dashboardStore.error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <i class="pi pi-exclamation-triangle text-5xl text-red-600 mb-4"></i>
      <p class="text-lg text-red-700">{{ dashboardStore.error }}</p>
      <Button label="Retry" class="mt-4" @click="dashboardStore.fetchDashboard()" />
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Spent -->
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
              <h3 class="text-3xl font-bold text-gray-900">
                {{ (dashboardStore.stats.totalSpent ?? 0).toLocaleString() }} RWF
              </h3>
              <p class="text-xs text-gray-500 mt-2">All time payments</p>
            </div>
            <div
              class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-wallet text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <!-- Pending -->
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ dashboardStore.stats.pendingTransactions }}</h3>
              <p class="text-xs text-gray-500 mt-2">Awaiting processing</p>
            </div>
            <div
              class="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-clock text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <!-- Successful -->
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Successful</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ dashboardStore.stats.successfulTransactions }}</h3>
              <p class="text-xs text-gray-500 mt-2">Completed payments</p>
            </div>
            <div
              class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-check-circle text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <!-- Failed -->
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Failed</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ dashboardStore.stats.failedTransactions }}</h3>
              <p class="text-xs text-gray-500 mt-2">Unsuccessful payments</p>
            </div>
            <div
              class="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-times-circle text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Services Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Pay Utilities</h2>
            <p class="text-gray-600">Select a service to make instant payment with cashback rewards</p>
          </div>
        </div>

        <!-- Utility Payment Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div v-for="utility in utilities" :key="utility.id"
            class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
            @click="openPaymentModal(utility)">
            <div class="flex flex-col items-center text-center space-y-4">
              <div
                class="w-20 h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                :style="{ background: utility.gradient }">
                <i :class="`${utility.icon} text-white text-3xl`"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">{{ utility.name }}</h3>
                <p class="text-sm text-gray-500 font-medium">{{ utility.provider }}</p>
              </div>
              <div class="w-full pt-2">
                <button
                  class="w-full py-3 px-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg text-sm">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Recent Transactions</h2>
        </div>

        <div v-if="dashboardStore.recentTransactions.length === 0" class="text-center py-12 text-gray-500">
          <i class="pi pi-inbox text-5xl mb-4"></i>
          <p class="text-lg">No transactions yet. Make your first payment!</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="transaction in dashboardStore.recentTransactions" :key="transaction.id"
            class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-4 transition-colors">
            <div class="flex items-center gap-4 flex-1">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                :style="{ background: getUtilityByType(transaction.paymentType)?.gradient || 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }">
                <i
                  :class="`${getUtilityByType(transaction.paymentType)?.icon || 'pi pi-money-bill'} text-white text-lg`"></i>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900">
                  {{ getUtilityByType(transaction.paymentType)?.name || transaction.paymentType }}
                </p>
                <p class="text-sm text-gray-500">
                  <span class="inline-block bg-gray-100 text-xs py-1 px-3 rounded-full mr-2">{{ transaction.reference
                  }}</span>
                  {{ formatDate(transaction.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="font-bold text-gray-900 text-lg">RWF {{ transaction.amount.toLocaleString() }}</p>
                <span class="inline-block text-xs px-3 py-1 rounded-full font-semibold" :class="[
                  transaction.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                    transaction.status === 'FAILED' || transaction.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                ]">
                  {{ transaction.status }}
                </span>
              </div>
              <!-- Download Receipt Button -->
              <Button v-if="transaction.status === 'SUCCESS'" icon="pi pi-download"
                class="p-button-rounded p-button-text p-button-success" v-tooltip.top="'Download Receipt'"
                :loading="downloadingReceipt === transaction.reference"
                @click="handleDownloadReceipt(transaction.reference, transaction.paymentType)" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Payment Modal -->
    <Dialog v-model:visible="showPaymentModal" modal :style="{ width: '90vw', maxWidth: '520px' }"
      :dismissableMask="!preventClose" :closable="!preventClose">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
            :style="{ background: selectedUtility?.gradient }">
            <i :class="`${selectedUtility?.icon} text-white text-xl`"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ selectedUtility?.name }}</h3>
            <p class="text-sm text-gray-500">{{ selectedUtility?.provider }}</p>
          </div>
        </div>
      </template>

      <div class="py-6">
        <!-- Error Alert -->
        <div v-if="paymentStore.error"
          class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <i class="pi pi-exclamation-circle text-red-600 text-xl mt-0.5"></i>
          <div>
            <p class="font-semibold text-red-900">Payment Error</p>
            <p class="text-sm text-red-700">{{ paymentStore.error }}</p>
          </div>
        </div>

        <!-- Success View -->
        <div v-if="paymentSuccess && paymentStore.transaction" class="text-center">
          <i class="pi text-8xl mb-6" :class="successIcon"
            :style="{ color: transactionStatus === 'SUCCESS' ? '#10b981' : '#f97316' }"></i>

          <h3 class="text-2xl font-bold mb-3"
            :class="transactionStatus === 'SUCCESS' ? 'text-green-600' : 'text-orange-600'">
            {{ transactionStatus === 'SUCCESS' ? 'Payment Successful!' : 'Payment Processing' }}
          </h3>

          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            {{ transactionStatus === 'SUCCESS'
              ? 'Your payment has been completed successfully.'
              : 'Your payment is being processed. You will be notified when it\'s complete.'
            }}
          </p>

          <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-md mx-auto text-left">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                :style="{ background: selectedUtility?.gradient }">
                <i :class="`${selectedUtility?.icon} text-white text-2xl`"></i>
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ selectedUtility?.name }}</p>
                <p class="text-sm text-gray-600">{{ paymentStore.transaction?.deliverTo }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Reference</span>
                <span class="font-semibold">{{ paymentStore.transaction?.reference }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Amount Paid</span>
                <span class="font-semibold">RWF {{ paymentStore.transaction?.amount?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Cashback Earned (2%)</span>
                <span class="font-semibold text-green-700">
                  RWF {{ (paymentStore.transaction?.amount * 0.02).toFixed(0).toLocaleString() }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Status</span>
                <span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold border"
                  :class="paymentStore.getStatusBadgeClass(transactionStatus)">
                  {{ transactionStatus }}
                </span>
              </div>
              <div v-if="paymentStore.transaction?.completedAt" class="flex justify-between">
                <span class="text-gray-600">Processed in</span>
                <span class="font-semibold">
                  {{ paymentStore.calculateDuration(paymentStore.transaction.createdAt,
                    paymentStore.transaction.completedAt)
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 space-y-3">
            <!-- Download Receipt Button - Primary Action -->
            <Button v-if="transactionStatus === 'SUCCESS'" label="Download Receipt" icon="pi pi-download"
              class="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all"
              @click="handleDownloadReceipt(paymentStore.transaction?.reference, paymentStore.transaction?.paymentType)"
              :loading="downloadingReceipt === paymentStore.transaction?.reference"
              :disabled="!paymentStore.transaction?.reference" />

            <!-- Secondary Actions -->
            <div class="flex gap-3">
              <Button label="New Payment" icon="pi pi-plus" class="flex-1 p-button-outlined"
                @click="resetForNewPayment" />
              <Button label="Close" icon="pi pi-times" class="flex-1 p-button-outlined p-button-secondary"
                @click="closePaymentModal" />
            </div>
          </div>
        </div>

        <!-- Payment Form (shown when not in success view) -->
        <form v-else @submit.prevent="handlePaymentSubmit" class="space-y-6">
          <!-- Reference / Meter (hidden for phone-based services) -->
          <div v-if="!isPhoneBased" class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">
              {{ selectedUtility?.referenceLabel || 'Reference Number' }}
            </label>
            <InputText v-model="paymentForm.reference"
              :placeholder="selectedUtility?.referencePlaceholder || 'Enter reference'"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required />
          </div>

          <!-- Delivery / Phone Number -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">
              {{ isPhoneBased ? (selectedUtility?.referenceLabel || 'Phone Number') : 'Delivery Phone Number' }}
            </label>
            <InputText v-model="paymentForm.deliverTo" placeholder="e.g. 0788318067"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required />
          </div>

          <!-- Amount -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Amount (RWF)</label>
            <InputNumber v-model="paymentForm.amount" :min="100" :useGrouping="true" class="w-full"
              inputClass="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required />
          </div>

          <!-- Summary -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-700">Subtotal</span>
              <span class="font-semibold text-gray-900">RWF {{ paymentForm.amount?.toLocaleString() || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-green-700 font-medium">Cashback (2%)</span>
              <span class="font-semibold text-green-700">
                RWF {{ ((paymentForm.amount || 0) * 0.02).toFixed(0).toLocaleString() }}
              </span>
            </div>
            <div class="border-t border-blue-300 pt-3 flex justify-between">
              <span class="font-bold text-gray-900">Total to Pay</span>
              <span class="font-bold text-gray-900 text-xl">RWF {{ paymentForm.amount?.toLocaleString() || 0 }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <Button label="Cancel" type="button" class="flex-1 p-button-outlined" @click="closePaymentModal"
              :disabled="paymentStore.isProcessing" />
            <Button type="submit" label="Pay Now" class="flex-1" :loading="paymentStore.isProcessing"
              :disabled="paymentStore.isProcessing" />
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { usePaymentStore } from '~/stores/payment'
import { useDashboardStore } from '~/stores/dashboard.store'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const paymentStore = usePaymentStore()
const dashboardStore = useDashboardStore()
const router = useRouter()

const downloadingReceipt = ref(null)

const utilities = ref([
  {
    id: 1,
    name: 'Electricity',
    provider: 'REG - Rwanda Energy Group',
    icon: 'pi pi-bolt',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    payType: 'ELECTRICITY',
    referenceLabel: 'Meter Number',
    referencePlaceholder: 'Enter your meter number'
  },
  {
    id: 2,
    name: 'Airtime',
    provider: 'MTN / Airtel',
    icon: 'pi pi-phone',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    payType: 'AIRTIME',
    referenceLabel: 'Phone Number',
    referencePlaceholder: 'e.g. 0788318067'
  },
  {
    id: 3,
    name: 'Water',
    provider: 'WASAC',
    icon: 'pi pi-tint',
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    payType: 'WATER',
    referenceLabel: 'Meter Number',
    referencePlaceholder: 'Enter water meter number'
  },
  {
    id: 4,
    name: 'Internet',
    provider: 'Data Bundles',
    icon: 'pi pi-wifi',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    payType: 'INTERNET',
    referenceLabel: 'Phone Number',
    referencePlaceholder: 'e.g. 0788318067'
  },
  {
    id: 5,
    name: 'TV Subscription',
    provider: 'Canal+ / Startimes',
    icon: 'pi pi-desktop',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    payType: 'TV',
    referenceLabel: 'Smart Card Number',
    referencePlaceholder: 'Enter smart card number'
  },
  {
    id: 6,
    name: 'RRA Payment',
    provider: 'Rwanda Revenue Authority',
    icon: 'pi pi-building',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    payType: 'RRA',
    referenceLabel: 'TIN Number',
    referencePlaceholder: 'Enter TIN number'
  }
])

const showPaymentModal = ref(false)
const selectedUtility = ref(null)
const paymentForm = ref({
  reference: '',
  amount: null,
  deliverTo: ''
})
const paymentSuccess = ref(false)

const preventClose = computed(() => paymentStore.isProcessing)
const isPhoneBased = computed(() => ['AIRTIME', 'INTERNET'].includes(selectedUtility.value?.payType))
const transactionStatus = computed(() => paymentStore.transaction?.status || 'PENDING')
const successIcon = computed(() =>
  transactionStatus.value === 'SUCCESS' ? 'pi pi-check-circle' : 'pi pi-clock'
)

const handleDownloadReceipt = async (reference, type) => {
  if (!reference) return

  downloadingReceipt.value = reference
  try {
    await paymentStore.getPaymentReceipt(reference, type)
  } finally {
    downloadingReceipt.value = null
  }
}

const openPaymentModal = (utility) => {
  selectedUtility.value = utility
  paymentSuccess.value = false
  paymentStore.setError(null)
  paymentForm.value = {
    reference: '',
    amount: null,
    deliverTo: authStore.user?.phoneNumber || ''
  }
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedUtility.value = null
  paymentSuccess.value = false
  paymentStore.resetPaymentState()
}

const resetForNewPayment = () => {
  paymentSuccess.value = false
  paymentStore.setError(null)
  paymentForm.value = {
    reference: '',
    amount: null,
    deliverTo: authStore.user?.phoneNumber || ''
  }
}

const handlePaymentSubmit = async () => {
  if (isPhoneBased.value) {
    if (!paymentStore.validatePhoneNumber(paymentForm.value.deliverTo)) {
      paymentStore.setError('Please enter a valid Rwandan phone number')
      return
    }
    paymentForm.value.deliverTo = paymentStore.formatPhoneNumber(paymentForm.value.deliverTo)
  }

  const payload = {
    payType: selectedUtility.value.payType,
    reference: isPhoneBased.value ? paymentForm.value.deliverTo : paymentForm.value.reference,
    amount: paymentForm.value.amount,
    deliverTo: paymentForm.value.deliverTo
  }

  try {
    const result = await paymentStore.processPayment(payload)
    if (result) {
      paymentSuccess.value = true
      dashboardStore.fetchDashboard()
    }
  } catch {
    // Error already handled in store
  }
}

const getUtilityByType = (payType) => {
  return utilities.value.find(u => u.payType === payType)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  dashboardStore.fetchDashboard()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
:deep(.p-dialog .p-dialog-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 0 1.5rem 1.5rem;
}

:deep(.p-inputnumber-input) {
  width: 100%;
}

:deep(.p-button-rounded) {
  width: 2.5rem;
  height: 2.5rem;
}
</style>