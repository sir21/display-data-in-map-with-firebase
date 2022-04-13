export interface Snack {
    message: string;
    type: ErrorType;
}

export type ErrorType = 'error' | 'success';
