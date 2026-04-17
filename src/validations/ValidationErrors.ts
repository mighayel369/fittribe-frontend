

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};