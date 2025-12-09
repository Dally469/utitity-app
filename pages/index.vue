<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Content -->
    <div class="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div class="w-full max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-12 items-center">

          <!-- Left Pane - Login Form -->
          <div class="order-2 lg:order-1">
            <div class="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">

              <!-- Logo & Brand -->
              <div class="mb-10">
                <div class="flex items-center gap-3 mb-8">
                  <div
                    class="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <i class="pi pi-bolt text-white text-3xl"></i>
                  </div>
                  <div>
                    <h1 class="text-3xl font-bold text-gray-900 tracking-tight">UtiliPay</h1>
                    <p class="text-blue-600 text-sm font-medium">Smart Utility Management</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Welcome Back</h2>
                  <p class="text-gray-600 text-lg">Sign in to continue your journey</p>
                </div>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleLogin" class="space-y-6">

                <!-- Email Field -->
                <div class="space-y-2">
                  <label for="email" class="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i class="pi pi-envelope text-gray-400"></i>
                    </div>
                    <InputText   v-model="email" type="email" placeholder="your@email.com"
                      class="w-full pl-12 pr-4 py-3.5 bg-gray-50   rounded-xl text-gray-900 transition-all duration-200"
                      required />
                  </div>
                </div>

                <!-- Password Field -->
                <div class="space-y-2">
                  <label for="password" class="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <i class="pi pi-lock text-gray-400"></i>
                    </div>
                    <Password id="password" v-model="password" placeholder="Enter your password" :feedback="false"
                      toggleMask class="w-full password-input-light"
                      inputClass="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      required />
                  </div>
                </div>

                <!-- Remember & Forgot -->
                <div class="flex items-center justify-between text-sm">
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500 transition-all">
                    <span class="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <a href="#" class="text-blue-600 hover:text-blue-700 font-semibold transition-colors relative group">
                    Forgot Password?
                    <span
                      class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </a>
                </div>

                <!-- Submit Button -->
                <button type="submit"
                  class="w-full relative group overflow-hidden rounded-xl py-4 px-6 font-semibold text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700">
                  <span class="relative flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <i class="pi pi-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </button>

                

                <!-- Sign Up Link -->
                <p class="text-center text-gray-600 text-sm mt-8">
                  Don't have an account?
                  <a href="#"
                    class="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors relative group">
                    Sign up
                    <span
                      class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </a>
                </p>
              </form>
            </div>

            <!-- Trust Indicators -->
            <div class="mt-8 flex items-center justify-center gap-8 text-gray-500 text-sm">
              <div class="flex items-center gap-2">
                <i class="pi pi-shield text-blue-600"></i>
                <span>Secure Login</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-lock text-blue-600"></i>
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>

          <!-- Right Pane - Enhanced Carousel -->
          <div class="order-1 lg:order-2 hidden lg:block">
            <div class="bg-white rounded-3xl p-8     border-gray-200">
              <Carousel :value="slides" :numVisible="1" :numScroll="1" :circular="true" :autoplayInterval="5000"
                class="custom-carousel-light">
                <template #item="slotProps">
                  <div class="space-y-8">
                    <!-- Image with Overlay -->
                    <div class="relative rounded-2xl overflow-hidden shadow-lg group">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10">
                      </div>
                      <img :src="slotProps.data.image" :alt="slotProps.data.title"
                        class="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700" />
                      <!-- Floating Badge -->
                      <div class="absolute top-6 right-6 z-20">
                        <div
                          class="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          <i :class="slotProps.data.badge.icon" class="mr-2 text-blue-600"></i>
                          {{ slotProps.data.badge.text }}
                        </div>
                      </div>
                    </div>

                    <!-- Content -->
                    <div class="space-y-4 px-2">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                          <i :class="slotProps.data.icon" class="text-white text-xl"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-gray-900">{{ slotProps.data.title }}</h3>
                      </div>

                      <p class="text-gray-600 text-sm leading-relaxed">
                        {{ slotProps.data.content }}
                      </p>

                      <!-- Features -->
                      <div class="grid grid-cols-2 gap-3 pt-4">
                        <div v-for="feature in slotProps.data.features" :key="feature"
                          class="flex items-center gap-2 text-sm text-gray-700">
                          <i class="pi pi-check-circle text-blue-600"></i>
                          <span>{{ feature }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </Carousel>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const slides = ref([
  {
    title: "Pay Your Bills Seamlessly",
    content: "Manage all your utility payments in one secure platform with real-time tracking and instant confirmations. Experience the future of bill management.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop",
    icon: "pi pi-bolt",
    badge: { icon: "pi pi-star-fill", text: "Most Popular" },
    features: ["Real-time tracking", "Instant confirmations", "Auto-pay setup", "Payment history"]
  },
  {
    title: "Smart Payment Solutions",
    content: "Set up automatic payments, track your usage patterns, and never miss a due date with our intelligent reminder system and predictive analytics.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    icon: "pi pi-chart-line",
    badge: { icon: "pi pi-sparkles", text: "AI Powered" },
    features: ["Smart reminders", "Usage analytics", "Budget insights", "Cost predictions"]
  },
  {
    title: "Secure & Fast Transactions",
    content: "Bank-level security with instant payment processing. Your financial data is always protected with military-grade encryption and multi-factor authentication.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    icon: "pi pi-shield",
    badge: { icon: "pi pi-verified", text: "Verified Secure" },
    features: ["256-bit encryption", "2FA security", "Fraud protection", "Instant processing"]
  }
]);

const handleLogin = () => {
  if (authStore.login(email.value, password.value)) {
    router.push('/dashboard');
  }
};
</script>

<style scoped>
/* Social Buttons */
.social-btn-light {
  @apply p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md;
}

/* Input Styles */
:deep(.p-password) {
  width: 100%;
}

:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  border-color: #3b82f6 !important;
}

/* Carousel Custom Styles */
:deep(.p-carousel-indicators) {
  padding: 1.5rem 0 0;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

:deep(.p-carousel-indicator button) {
  width: 2.5rem;
  height: 0.5rem;
  border-radius: 1rem;
  background: #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.p-carousel-indicator button:hover) {
  background: #d1d5db;
  transform: scaleX(1.2);
}

:deep(.p-carousel-indicator.p-highlight button) {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  width: 3rem;
}

:deep(.p-carousel-prev),
:deep(.p-carousel-next) {
  display: none;
}
</style>