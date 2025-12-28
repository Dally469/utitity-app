export interface PaymentRequest {
    utilityType: 'ELECTRICITY' | 'WATER' | 'INTERNET' | 'CABLE_TV';
    meterNumber: string;
    amount: number;
    description?: string;
}

export interface PaymentResponse {
    reference: string;
    amount: number;
    utilityType: string;
    meterNumber: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    transactionId: string;
    cashback: number;
    message: string;
    createdAt: string;
}

export interface PaymentStatus {
    reference: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    amount: number;
    transactionId: string;
    message: string;
    updatedAt: string;
}

export interface UtilityOption {
    value: 'ELECTRICITY' | 'WATER' | 'INTERNET' | 'CABLE_TV';
    label: string;
    icon: string;
}

export interface MeterValidationResponse {
    valid: boolean;
    customerName: string;
    meterNumber: string;
    balance?: number;
    message: string;
}

export interface PaymentHistoryParams {
    utilityType?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
}

export interface PaymentState {
    payment: PaymentResponse | null;
    paymentStatus: PaymentStatus | null;
    paymentHistory: PaymentResponse[];
    utilities: UtilityOption[];
    loading: boolean;
    error: string | null;
    processingPayment: boolean;
}