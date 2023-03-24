export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type Modify<T, R> = Omit<T, keyof R> & R;
