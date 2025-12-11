export interface SelectOption {
  name: string;
  value: string;
}

export interface CustomSelectProps {
  options: SelectOption[] | [];
  placeholder?: string;
  onChange?: (value: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  error?: string | null;
}