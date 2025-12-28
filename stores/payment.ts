// stores/payment.js
import { defineStore } from 'pinia';
import { httpRequest } from '~/services';

export const usePaymentStore = defineStore('payment', () => {
  // State
  const payment = ref(null);
  const transaction = ref(null);
  const paymentStatus = ref(null);
  const paymentHistory = ref([]);
  const paymentTypes = ref([
    { value: 'airtime', label: 'Airtime', icon: 'pi-mobile' },
    { value: 'electricity', label: 'Electricity', icon: 'pi-bolt' },
    { value: 'water', label: 'Water', icon: 'pi-tint' },
    { value: 'internet', label: 'Internet', icon: 'pi-wifi' }
  ]);
  const loading = ref(false);
  const error = ref(null);
  const processingPayment = ref(false);
  const mopayTransactionId = ref(null);

  // Alert store
  const alert = useAlertStore();
  const dashboardStore = useDashboardStore();

  // Setters
  const setPayment = (data: any) => (payment.value = data);
  const setTransaction = (data: any) => (transaction.value = data);
  const setPaymentStatus = (data: any) => (paymentStatus.value = data);
  const setPaymentHistory = (data: any) => (paymentHistory.value = data);
  const setPaymentTypes = (data: any) => (paymentTypes.value = data);
  const setLoading = (value: any) => (loading.value = value);
  const setError = (message: any) => (error.value = message);
  const setProcessingPayment = (value: any) => (processingPayment.value = value);
  const setMopayTransactionId = (id: any) => (mopayTransactionId.value = id);

  // Getters
  const getPayment = computed(() => payment.value);
  const getTransaction = computed(() => transaction.value);
  const getPaymentStatus = computed(() => paymentStatus.value);
  const getPaymentHistory = computed(() => paymentHistory.value);
  const getPaymentTypes = computed(() => paymentTypes.value);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);
  const isProcessing = computed(() => processingPayment.value);
  const getMopayTransactionId = computed(() => mopayTransactionId.value);

  /**
   * Process payment
   */
  const processPayment = async (paymentData: any) => {
    setLoading(true);
    setProcessingPayment(true);
    setError(null);

    try {
      // Validate payment data
      if (!paymentData.payType || !paymentData.deliverTo || !paymentData.amount) {
        throw new Error('Please fill in all required fields');
      }

      if (paymentData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Prepare request payload
      const payload = {
        reference: paymentData.reference || paymentData.deliverTo,
        amount: parseFloat(paymentData.amount),
        payType: paymentData.payType.toLowerCase(),
        deliverTo: paymentData.deliverTo
      };

      const response = await httpRequest.post('/payments/process', payload);

      if (response.success && response.data) {
        setPayment(response.data);

        // Extract transaction details
        if (response.data.transaction) {
          setTransaction(response.data.transaction);
        }

        // Store MoPay transaction ID
        if (response.data.mopayTransactionId) {
          setMopayTransactionId(response.data.mopayTransactionId);
        }

        // Show success message
        alert.success(response.data.message || 'Payment processed successfully!');

        return response.data;
      } else {
        throw new Error(response.message || 'Payment processing failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to process payment';
      setError(message);
      alert.error(message);
      console.error('Payment processing error:', err);
      throw err;
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  /**
   * Check payment status by reference
   */
  const checkPaymentStatus = async (reference: any) => {
    setLoading(true);
    setError(null);

    try {
      if (!reference) {
        throw new Error('Payment reference is required');
      }

      const response = await httpRequest.get(`/payments/status/${reference}`);

      if (response.success && response.data) {
        setPaymentStatus(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to check payment status');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to check payment status';
      setError(message);
      alert.error(message);
      console.error('Payment status check error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch transaction by reference
   */
  const fetchTransactionByReference = async (reference: any) => {
    setLoading(true);
    setError(null);

    try {
      if (!reference) {
        throw new Error('Transaction reference is required');
      }

      const response = await httpRequest.get(`/dashboard/transactions/${reference}`);

      if (response.success && response.data) {
        setTransaction(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch transaction');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch transaction';
      setError(message);
      alert.error(message);
      console.error('Transaction fetch error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch payment history/transactions
   */
  const fetchPaymentHistory = async (params: any) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (params?.paymentType)
        queryParams.append('paymentType', params.paymentType);

      if (params?.status)
        queryParams.append('status', params.status);

      if (params?.dateFrom)
        queryParams.append('dateFrom', params.dateFrom);

      if (params?.dateTo)
        queryParams.append('dateTo', params.dateTo);

      if (params?.limit)
        queryParams.append('limit', params.limit.toString());

      const url = `/dashboard/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await httpRequest.get(url);

      if (response.success) {
        setPaymentHistory(response.data);
      } else {
        const message = response.message || 'Failed to fetch payment history';
        setError(message);
        alert.error(message);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch payment history';
      setError(message);
      alert.error(message);
      console.error('Payment history fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retry failed payment
   */
  const retryPayment = async (reference: any) => {
    setLoading(true);
    setProcessingPayment(true);
    setError(null);

    try {
      const response = await httpRequest.post(`/payments/retry/${reference}`);

      if (response.success && response.data) {
        setPayment(response.data);

        if (response.data.transaction) {
          setTransaction(response.data.transaction);
        }

        alert.success('Payment retry initiated successfully');

        // Refresh payment history
        // await fetchPaymentHistory();

        return response.data;
      } else {
        throw new Error(response.message || 'Payment retry failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to retry payment';
      setError(message);
      alert.error(message);
      console.error('Payment retry error:', err);
      throw err;
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  /**
   * Cancel pending payment
   */
  const cancelPayment = async (reference: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpRequest.post(`/payments/cancel/${reference}`);

      if (response.success) {
        alert.success('Payment cancelled successfully');

        // Refresh payment history
        // await fetchPaymentHistory();

        return true;
      } else {
        throw new Error(response.message || 'Payment cancellation failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to cancel payment';
      setError(message);
      alert.error(message);
      console.error('Payment cancellation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get payment receipt
   */
  const getPaymentReceipt = async (reference: any, type: any) => {
    setLoading(true);
    setError(null);
    console.log('Downloading receipt for reference:', reference, type);
    try {
      const response = await httpRequest.get(`/payments/receipt/${reference}`);

      // Handle blob response for file download
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}-INVOICE-${reference}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        alert.success('Receipt downloaded successfully');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to download receipt';
      setError(message);
      alert.error(message);
      console.error('Receipt download error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate phone number for airtime
   */
  const validatePhoneNumber = (phoneNumber: any) => {
    // Remove any spaces or special characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if it's a valid Rwanda number (starts with 250 and has 12 digits)
    if (cleaned.startsWith('250') && cleaned.length === 12) {
      return true;
    }

    // Check if it's 9 digits (local format)
    if (cleaned.length === 9) {
      return true;
    }

    return false;
  };

  /**
   * Format phone number
   */
  const formatPhoneNumber = (phoneNumber: any) => {
    const cleaned = phoneNumber.replace(/\D/g, '');

    // If it's 9 digits, add country code
    if (cleaned.length === 9) {
      return '250' + cleaned;
    }

    return cleaned;
  };

  /**
   * Get payment type label
   */
  const getPaymentTypeLabel = (payType: any) => {
    const type = paymentTypes.value.find(t => t.value === payType.toLowerCase());
    return type ? type.label : payType.toUpperCase();
  };

  /**
   * Get payment type icon
   */
  const getPaymentTypeIcon = (payType: any) => {
    const type = paymentTypes.value.find(t => t.value === payType.toLowerCase());
    return type ? type.icon : 'pi-circle';
  };

  /**
   * Calculate transaction duration
   */
  const calculateDuration = (createdAt: any, completedAt: any) => {
    if (!completedAt) return null;

    const start = new Date(createdAt);
    const end = new Date(completedAt);
    const diff = end - start;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes} min ${seconds % 60} sec`;
    }

    return `${seconds} sec`;
  };

  /**
   * Get status badge class
   */
  const getStatusBadgeClass = (status: any) => {
    const classes = {
      SUCCESS: 'bg-green-100 text-green-800 border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  /**
   * Reset payment state
   */
  const resetPaymentState = () => {
    setPayment(null);
    setTransaction(null);
    setPaymentStatus(null);
    setError(null);
    setMopayTransactionId(null);
  };

  return {
    // State
    payment,
    transaction,
    paymentStatus,
    paymentHistory,
    paymentTypes,
    loading,
    error,
    processingPayment,
    mopayTransactionId,

    // Setters
    setPayment,
    setTransaction,
    setPaymentStatus,
    setPaymentHistory,
    setPaymentTypes,
    setLoading,
    setError,
    setProcessingPayment,
    setMopayTransactionId,

    // Getters
    getPayment,
    getTransaction,
    getPaymentStatus,
    getPaymentHistory,
    getPaymentTypes,
    isLoading,
    getError,
    isProcessing,
    getMopayTransactionId,

    // Actions
    processPayment,
    checkPaymentStatus,
    fetchTransactionByReference,
    fetchPaymentHistory,
    retryPayment,
    cancelPayment,
    getPaymentReceipt,
    validatePhoneNumber,
    formatPhoneNumber,
    getPaymentTypeLabel,
    getPaymentTypeIcon,
    calculateDuration,
    getStatusBadgeClass,
    resetPaymentState
  };
});

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePaymentStore, import.meta.hot));
}