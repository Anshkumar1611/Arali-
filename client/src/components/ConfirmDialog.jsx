export default function ConfirmDialog({ customerName, onConfirm, onCancel }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="modal confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <div className="modal__header">
          <h2 id="confirm-title">Delete Customer</h2>
          <button className="modal__close" onClick={onCancel} aria-label="Cancel">
            ✕
          </button>
        </div>

        <div className="confirm-dialog__body">
          <span className="confirm-dialog__icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </span>
          <p id="confirm-desc">
            Are you sure you want to delete{' '}
            <strong>{customerName}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="modal__footer">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger-solid" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
