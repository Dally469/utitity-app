// stores/alert.js
import { defineStore } from 'pinia';

interface Alert {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: any;
  dismissed: boolean;
  createdAt: number;
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alerts: [] as Alert[],
    nextId: 1
  }),

  getters: {
    activeAlerts: (state) => state.alerts.filter(alert => !alert.dismissed)
  },

  actions: {
    /**
     * Show success alert
     */
    success(message: any, duration = 5000) {
      this.addAlert({
        type: 'success',
        message,
        duration
      });
    },

    /**
     * Show error alert
     */
    error(message: any, duration = 7000) {
      this.addAlert({
        type: 'error',
        message,
        duration
      });
    },

    /**
     * Show warning alert
     */
    warning(message: any, duration = 6000) {
      this.addAlert({
        type: 'warning',
        message,
        duration
      });
    },

    /**
     * Show info alert
     */
    info(message: any, duration = 5000) {
      this.addAlert({
        type: 'info',
        message,
        duration
      });
    },

    /**
     * Add alert to store
     */
    addAlert({ type, message, duration }: { type: 'success' | 'error' | 'warning' | 'info'; message: any; duration: number }) {
      const id = this.nextId++;

      const alert = {
        id,
        type,
        message,
        dismissed: false,
        createdAt: Date.now()
      };

      this.alerts.push(alert);

      // Auto dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          this.dismiss(id);
        }, duration);
      }

      return id;
    },

    /**
     * Dismiss alert by id
     */
    dismiss(id: number) {
      const alert = this.alerts.find(a => a.id === id);
      if (alert) {
        alert.dismissed = true;

        // Remove from array after animation
        setTimeout(() => {
          this.remove(id);
        }, 300);
      }
    },

    /**
     * Remove alert from store
     */
    remove(id: number) {
      const index = this.alerts.findIndex(a => a.id === id);
      if (index !== -1) {
        this.alerts.splice(index, 1);
      }
    },

    /**
     * Clear all alerts
     */
    clear() {
      this.alerts = [];
    }
  }
});