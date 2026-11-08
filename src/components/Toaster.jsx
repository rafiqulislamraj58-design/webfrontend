export function Toaster({ message }) {
  return (
    <div className={`toast ${message ? "toast-show" : ""}`}>{message}</div>
  );
}
