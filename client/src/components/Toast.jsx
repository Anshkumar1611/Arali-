export default function Toast({ toast, onDismiss }) {
  if (!toast) return null
  return (
    <div
      className={`toast toast--${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <span>{toast.msg}</span>
      <button className="toast__close" onClick={onDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}
