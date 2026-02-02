import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
    // Format Indian phone numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return phone;
}

export function generateReceipt(): string {
    return `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
