<template>
  <div class="min-h-screen bg-white">
    <!-- Split Screen Layout -->
    <div class="min-h-screen grid lg:grid-cols-2">

      <!-- Left Pane - Image/Illustration -->
      <div class="hidden lg:flex items-center justify-center bg-gray-50 p-12">
        <div class="max-w-lg space-y-8">
          <div class="text-center space-y-4">
            <div class="inline-block">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop&crop=face"
                alt="Professional" class="w-64 h-64 rounded-full object-cover shadow-2xl mx-auto" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900">Manage Your Utilities</h2>
            <p class="text-lg text-gray-600">Pay bills seamlessly with real-time cashback on every payment</p>
          </div>

          <!-- Features -->
          <div class="space-y-4">
            <div class="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-check text-green-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Instant Payments</h4>
                <p class="text-sm text-gray-600">Process payments in seconds</p>
              </div>
            </div>

            <div class="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-shield text-blue-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Secure Transactions</h4>
                <p class="text-sm text-gray-600">Bank-level security guaranteed</p>
              </div>
            </div>

            <div class="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-gift text-orange-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Earn Cashback</h4>
                <p class="text-sm text-gray-600">Get rewards on every payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Pane - Login Form -->
      <div class="flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-blue-500 to-blue-600">
        <div class="w-full max-w-md">

          <!-- Logo & Header -->
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-2 mb-6">
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <i class="pi pi-bolt text-blue-600 text-2xl"></i>
              </div>
              <h1 class="text-3xl font-bold text-white">BeSoft</h1>
            </div>
            <p class="text-blue-100 text-sm">only if you want the best</p>
            <h2 class="text-2xl font-bold text-white mt-6">Real-time Cashback on Every Payment</h2>
          </div>

          <!-- Login Card -->
          <div class="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 class="text-3xl font-bold text-blue-600 text-center mb-2">Sign In</h3>
            <p class="text-center text-gray-600 text-sm mb-8">Enter your phone number to continue</p>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <i class="pi pi-exclamation-circle text-red-500 text-lg mt-0.5"></i>
              <div class="flex-1">
                <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
              </div>
              <button @click="errorMessage = ''" class="text-red-400 hover:text-red-600">
                <i class="pi pi-times text-sm"></i>
              </button>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">

              <!-- Phone Number -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">
                  Phone number
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <div class="relative w-32">
                    <select v-model="countryCode"
                      class="w-full px-3 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 appearance-none pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                      <option value="+250">🇷🇼 +250</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+256">🇺🇬 +256</option>
                      <option value="+255">🇹🇿 +255</option>
                    </select>
                    <i
                      class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                  </div>
                  <InputText v-model="phoneNumber" type="tel" placeholder="785194263"
                    class="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/20': phoneError }"
                    @input="phoneError = ''" required />
                </div>
                <p v-if="phoneError" class="text-sm text-red-600 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>
                  {{ phoneError }}
                </p>
                <p v-else class="text-xs text-gray-500">
                  Enter your phone number without country code
                </p>
              </div>

              <!-- Submit Button -->
              <button type="submit" :disabled="isLoading"
                class="w-full py-4 px-6 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
                <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
                <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
              </button>

              <!-- Register Link -->
              <p class="text-center text-gray-700 text-sm pt-4">
                Don't have an account?
                <a href="#"
                  class="font-medium text-gray-900 hover:text-blue-600 transition-colors italic underline ml-1">
                  Register
                </a>
              </p>
            </form>
          </div>

          <!-- Privacy Info -->
          <p class="text-center text-white/80 text-xs mt-6">
            By signing in, you agree to our
            <a href="#" class="underline hover:text-white">Terms of Service</a> and
            <a href="#" class="underline hover:text-white">Privacy Policy</a>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const countryCode = ref('+250');
const phoneNumber = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const phoneError = ref('');

// Computed full phone number
const fullPhoneNumber = computed(() => {
  const cleaned = phoneNumber.value.replace(/\D/g, '');
  return countryCode.value.replace('+', '') + cleaned;
});

const validatePhoneNumber = () => {
  const cleaned = phoneNumber.value.replace(/\D/g, '');

  if (!cleaned) {
    phoneError.value = 'Phone number is required';
    return false;
  }

  if (cleaned.length < 9) {
    phoneError.value = 'Phone number is too short';
    return false;
  }

  if (cleaned.length > 12) {
    phoneError.value = 'Phone number is too long';
    return false;
  }

  phoneError.value = '';
  return true;
};

const handleLogin = async () => {
  // Reset errors
  errorMessage.value = '';
  phoneError.value = '';

  // Validate phone number
  if (!validatePhoneNumber()) {
    return;
  }

  isLoading.value = true;

  try {
    const success = await authStore.login(fullPhoneNumber.value);

    if (success) {
      // Show success message briefly before redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      errorMessage.value = 'Login failed. Please check your phone number and try again.';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.message || 'An unexpected error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Custom styling */
:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  border-color: #3b82f6 !important;
}

/* Error state styling */
:deep(.p-inputtext.border-red-500:focus) {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
  border-color: #ef4444 !important;
}

/* Spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.pi-spin {
  animation: spin 1s linear infinite;
}
</style>