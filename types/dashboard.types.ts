export interface DashboardData {
    balance: number;
    totalCashback: number;
    transactionCount: number;
    pendingPayments: number;
    recentTransactions: Transaction[];
}

export interface DashboardStats {
    totalBalance: number;
    totalCashback: number;
    transactionCount: number;
    pendingTransactions: number;
    completedTransactions: number;
    failedTransactions: number;
}

export interface Transaction {
    id: number;
    reference: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    description: string;
    utilityType?: string;
    meterNumber?: string;
    cashback?: number;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionFilters {
    status?: 'SUCCESS' | 'PENDING' | 'FAILED' | null;
    type?: 'DEBIT' | 'CREDIT' | null;
    dateFrom?: string | null;
    dateTo?: string | null;
    search?: string;
}

export interface DashboardState {
    dashboard: DashboardData | null;
    transactions: Transaction[];
    transaction: Transaction | null;
    stats: DashboardStats;
    loading: boolean;
    error: string | null;
    filters: TransactionFilters;
}