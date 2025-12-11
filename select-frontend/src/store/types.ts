export interface CustomSelectOption {
  name: string;
  value: string;
}

export interface AppState {
  options: CustomSelectOption[];
  selectedValue: string;
  messages: string[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export interface ApiResponse {
  message: string;
}

export interface SelectState {
  selectedValue: string;
  isSubmitting: boolean;
  messages: string[];
}
