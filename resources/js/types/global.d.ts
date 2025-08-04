import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

// Export job orders types globally
export * from './joborders';
