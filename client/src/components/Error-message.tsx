interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="text-red-500 text-center">{message}</div>
);

export default ErrorMessage;
