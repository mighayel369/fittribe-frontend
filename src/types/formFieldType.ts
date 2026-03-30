export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "file";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}