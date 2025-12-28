 
import { defineStore } from 'pinia';
import { httpRequest } from '~/services';
import { useAlertStore } from '~/stores/alert.store'; // Adjust path if needed

// Types
type TransactionStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
type PaymentType = 'ELECTRICITY' | 'AIRTIME' | 'WATER' | 'INTERNET' | 'RRA';

interface UserSummary {
  fullName: string;
  phoneNumber: string;
  lastLoginAt: string | null;
}

interface TransactionItem {
  id: number;
  reference: string;
  amount: number;
  paymentType: PaymentType;
  deliverTo: string;
  status: TransactionStatus;
  createdAt: string;
  completedAt: string | null;
}

interface TransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalSpent: number;
}

interface DashboardData {
  userSummary: UserSummary;
  recentTransactions: TransactionItem[];
  stats: TransactionStats;
}

interface Filters {
  status: TransactionStatus | null;
  paymentType: PaymentType | null;
  dateFrom: string | null; // ISO date string, e.g., '2025-12-01'
  dateTo: string | null;
  search: string;
}

interface FetchTransactionsParams {
  limit?: number;
  offset?: number;
}

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const dashboard = ref<DashboardData | null>(null);
  const userSummary = ref<UserSummary | null>(null);
  const recentTransactions = ref<TransactionItem[]>([]);
  const transactions = ref<TransactionItem[]>([]);
  const transaction = ref<TransactionItem | null>(null);
  const stats = ref<TransactionStats>({
    totalTransactions: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    totalSpent: 0,
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filters = ref<Filters>({
    status: null,
    paymentType: null,
    dateFrom: null,
    dateTo: null,
    search: '',
  });

  // Alert store
  const alert = useAlertStore();

  // Setters
  const setDashboard = (data: DashboardData) => (dashboard.value = data);
  const setUserSummary = (data: UserSummary) => (userSummary.value = data);
  const setRecentTransactions = (data: TransactionItem[]) => (recentTransactions.value = data);
  const setTransactions = (data: TransactionItem[]) => (transactions.value = data);
  const setTransaction = (data: TransactionItem | null) => (transaction.value = data);
  const setStats = (data: TransactionStats) => (stats.value = data);
  const setLoading = (value: boolean) => (loading.value = value);
  const setError = (message: string | null) => (error.value = message);
  const setFilters = (data: Partial<Filters>) => (filters.value = { ...filters.value, ...data });
  const resetFilters = () => {
    filters.value = {
      status: null,
      paymentType: null,
      dateFrom: null,
      dateTo: null,
      search: '',
    };
  };

  // Getters (computed)
  const getDashboard = computed(() => dashboard.value);
  const getUserSummary = computed(() => userSummary.value);
  const getRecentTransactions = computed(() => recentTransactions.value);
  const getTransactions = computed(() => transactions.value);
  const getTransaction = computed(() => transaction.value);
  const getStats = computed(() => stats.value);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);
  const getFilters = computed(() => filters.value);

  // Computed - Stats rates
  const successRate = computed(() => {
    if (stats.value.totalTransactions === 0) return '0';
    return ((stats.value.successfulTransactions / stats.value.totalTransactions) * 100).toFixed(1);
  });

  const pendingRate = computed(() => {
    if (stats.value.totalTransactions === 0) return '0';
    return ((stats.value.pendingTransactions / stats.value.totalTransactions) * 100).toFixed(1);
  });

  const failureRate = computed(() => {
    if (stats.value.totalTransactions === 0) return '0';
    return ((stats.value.failedTransactions / stats.value.totalTransactions) * 100).toFixed(1);
  });

  // Filtered transactions
  const filteredTransactions = computed(() => {
    let result = transactions.value.length > 0 ? transactions.value : recentTransactions.value;

    // Filter by status
    if (filters.value.status) {
      result = result.filter((t) => t.status === filters.value.status);
    }

    // Filter by payment type (uncomment if needed)
    // if (filters.value.paymentType) {
    //   result = result.filter((t) => t.paymentType === filters.value.paymentType);
    // }

    // Filter by date range (uncomment if needed)
    // if (filters.value.dateFrom) {
    //   result = result.filter((t) => new Date(t.createdAt) >= new Date(filters.value.dateFrom));
    // }
    // if (filters.value.dateTo) {
    //   result = result.filter((t) => new Date(t.createdAt) <= new Date(filters.value.dateTo));
    // }

    // Filter by search (reference, deliverTo, paymentType)
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.reference.toLowerCase().includes(search) ||
          t.deliverTo.toLowerCase().includes(search) ||
          t.paymentType.toLowerCase().includes(search)
      );
    }

    return result;
  });

  // Transactions grouped by status
  const successfulTransactions = computed(() =>
    filteredTransactions.value.filter((t) => t.status === 'SUCCESS')
  );
  const pendingTransactions = computed(() =>
    filteredTransactions.value.filter((t) => t.status === 'PENDING')
  );
  const failedTransactions = computed(() =>
    filteredTransactions.value.filter((t) => t.status === 'FAILED')
  );

  // Transactions grouped by payment type
  const transactionsByType = computed(() => {
    const types: Record<string, TransactionItem[]> = {};
    filteredTransactions.value.forEach((t) => {
      const type = t.paymentType || 'UNKNOWN';
      if (!types[type]) {
        types[type] = [];
      }
      types[type].push(t);
    });
    return types;
  });

  // Helper to format date (ISO string → YYYY-MM-DD)
  const formatDate = (date: string | null) => {
    return date ? new Date(date).toISOString().split('T')[0] : null;
  };

  /**
   * Fetch dashboard data
   */
  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpRequest.get('/dashboard');
      if (response.success && response.data) {
        setDashboard(response.data);
        if (response.data.userSummary) setUserSummary(response.data.userSummary);
        if (response.data.recentTransactions) setRecentTransactions(response.data.recentTransactions);
        if (response.data.stats) setStats(response.data.stats);
      } else {
        const message = response.message || 'Failed to fetch dashboard data';
        setError(message);
        alert.error(message);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch dashboard data';
      setError(message);
      alert.error(message);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all transactions (with optional filters/pagination)
   */
  const fetchTransactions = async (params?: FetchTransactionsParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();

      if (filters.value.status) queryParams.append('status', filters.value.status);
      if (filters.value.paymentType) queryParams.append('paymentType', filters.value.paymentType);
      // if (filters.value.dateFrom) queryParams.append('dateFrom', formatDate(filters.value.dateFrom)!);
      // if (filters.value.dateTo) queryParams.append('dateTo', formatDate(filters.value.dateTo)!);
      if (filters.value.search) queryParams.append('search', filters.value.search);

      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `/dashboard/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await httpRequest.get(url);

      if (response.success && response.data) {
        setTransactions(response.data);
      } else {
        const message = response.message || 'Failed to fetch transactions';
        setError(message);
        alert.error(message);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch transactions';
      setError(message);
      alert.error(message);
      console.error('Transactions fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    dashboard,
    userSummary,
    recentTransactions,
    transactions,
    transaction,
    stats,
    loading: isLoading,
    error: getError,
    filters: getFilters,

    getDashboard,
    getUserSummary,
    getRecentTransactions,
    getTransactions,
    getTransaction,
    getStats,
    // Computed
    successRate,
    pendingRate,
    failureRate,
    filteredTransactions,
    successfulTransactions,
    pendingTransactions,
    failedTransactions,
    transactionsByType,

    // Actions
    setFilters,
    resetFilters,
    fetchDashboard,
    fetchTransactions,
  };
});

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
}
 