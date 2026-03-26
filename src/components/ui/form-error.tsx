interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return <p className="text-xs text-rose-500 font-medium mt-1">{message}</p>;
}
