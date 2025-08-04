export interface Notification {
    id: number;
    title: string;
    body: string;
    read: boolean;
    time: string;
    type?: string;
} 