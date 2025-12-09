<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i class="pi pi-bolt text-white text-xl"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">UtiliPay</h1>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right hidden sm:block">
              <p class="text-sm text-gray-600">Welcome back,</p>
              <p class="text-sm font-semibold text-gray-800">{{ authStore.user?.name }}</p>
            </div>
            <Button label="Logout" icon="pi pi-sign-out" class="p-button-outlined p-button-sm" @click="handleLogout" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Payments</p>
              <h3 class="text-2xl font-bold text-gray-800">$1,245</h3>
              <p class="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-dollar text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Active Services</p>
              <h3 class="text-2xl font-bold text-gray-800">8</h3>
              <p class="text-xs text-gray-500 mt-1">4 due this week</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-list text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">This Month</p>
              <h3 class="text-2xl font-bold text-gray-800">$425</h3>
              <p class="text-xs text-orange-600 mt-1">3 pending payments</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-calendar text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Saved</p>
              <h3 class="text-2xl font-bold text-gray-800">$180</h3>
              <p class="text-xs text-green-600 mt-1">↑ $45 this month</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-chart-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Title -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Pay Utilities</h2>
        <p class="text-gray-600">Quick access to your utility payment options</p>
      </div>

      <!-- Utility Payment Cards -->
      <div class="grid grid-cols-1 max-sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div v-for="utility in utilities" :key="utility.id"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          @click="handlePayment(utility)">
          <div class="flex flex-col items-center text-center space-y-4">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              :style="{ background: utility.gradient }">
              <i :class="`${utility.icon} text-white text-2xl`"></i>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ utility.name }}</h3>
              <p class="text-sm text-gray-500">{{ utility.provider }}</p>
            </div>

      

            <Button :label="`Pay ${utility.name}`"
              class="w-full   text-white font-medium py-2 rounded-lg transition"
              size="small" />
          </div>
        </div>

      </div>

      <!-- Recent Transactions -->
      <div class="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
        <div class="space-y-4">
          <div v-for="transaction in recentTransactions" :key="transaction.id"
            class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                :style="{ background: transaction.gradient }">
                <i :class="`${transaction.icon} text-white`"></i>
              </div>
              <div>
                <p class="font-medium text-gray-800">{{ transaction.name }}</p>
                <p class="text-sm text-gray-500">{{ transaction.date }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-800">{{ transaction.amount }}</p>
              <span class="inline-block text-xs px-2 py-1 rounded-full"
                :class="transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                {{ transaction.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth'
});

const authStore = useAuthStore();
const router = useRouter();

const utilities = ref([
  {
    id: 1,
    name: 'Electricity',
    provider: 'REG',
  
    dueStatus: 'normal',
    icon: 'pi pi-bolt',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  
  {
    id: 3,
    name: 'Airtime & Internet',
    provider: 'Airtel / MTN',
    dueStatus: 'normal',
    icon: 'pi pi-phone',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 4,
    name: 'TV Subscription',
    provider: 'Canal+ / DSTV',
    dueStatus: 'normal',
    icon: 'pi pi-desktop',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 5,
    name: 'RRA Payment',
    provider: 'Rwanda Revenue Authority',
    dueStatus: 'normal',
    icon: 'pi pi-image',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
   
]);

const recentTransactions = ref([
  {
    id: 1,
    name: 'Electricity Payment',
    date: 'Dec 5, 2025',
    amount: '-$125.50',
    status: 'completed',
    icon: 'pi pi-bolt',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: 'Water Bill',
    date: 'Dec 3, 2025',
    amount: '-$45.20',
    status: 'completed',
    icon: 'pi pi-info-circle',
    gradient: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)'
  },
  {
    id: 3,
    name: 'Internet Subscription',
    date: 'Nov 28, 2025',
    amount: '-$79.99',
    status: 'completed',
    icon: 'pi pi-wifi',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
]);

const handlePayment = (utility) => {
  alert(`Processing payment for ${utility.name}`);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>