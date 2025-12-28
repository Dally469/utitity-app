// ============================================================================
// Alert Component - components/Alert.vue
// ============================================================================

/*
<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
    <TransitionGroup name="alert">
      <div v-for="alert in activeAlerts" :key="alert.id" :class="[
        'p-4 rounded-lg shadow-lg flex items-start gap-3',
        alertClasses[alert.type]
      ]">
        <i :class="['text-xl', alertIcons[alert.type]]"></i>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ alert.message }}</p>
        </div>
        <button @click="alertStore.dismiss(alert.id)"
          class="text-current opacity-70 hover:opacity-100 transition-opacity">
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAlertStore } from '~/stores/alert.store';

const alertStore = useAlertStore();

const activeAlerts = computed(() => alertStore.activeAlerts);

const alertClasses = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200'
};

const alertIcons = {
  success: 'pi pi-check-circle text-green-600',
  error: 'pi pi-times-circle text-red-600',
  warning: 'pi pi-exclamation-triangle text-yellow-600',
  info: 'pi pi-info-circle text-blue-600'
};
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.alert-move {
  transition: transform 0.3s ease;
}
</style>