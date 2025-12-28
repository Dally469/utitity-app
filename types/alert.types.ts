export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
    id: number;
    type: AlertType;
    message: string;
    dismissed: boolean;
    createdAt: number;
}

export interface AlertState {
    alerts: Alert[];
    nextId: number;
}
