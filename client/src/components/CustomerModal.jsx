import { useState } from 'react'
import { validate } from '../utils/validate'

const EMPTY_FORM = { name: '', email: '', phone: '' }

export default function CustomerModal({ modal, onClose, onAdd, onEdit, showToast }) {
  const [form, setForm] = useState(
    modal.mode === 'edit'
      ? { name: modal.customer.name, email: modal.customer.email, phone: modal.customer.phone }
      : EMPTY_FORM
  )
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleFieldChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }

    setSubmitting(true)
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    }

    try {
      if (modal.mode === 'add') {
        const result = await onAdd(payload)
        if (result.ok) {
          showToast('Customer added successfully.')
          onClose()
        } else {
          showToast(result.error ?? 'Something went wrong.', 'error')
        }
      } else {
        const result = await onEdit(modal.customer.id, payload)
        if (result.ok) {
          showToast('Customer updated successfully.')
          onClose()
        } else {
          showToast(result.error ?? 'Something went wrong.', 'error')
          if (result.error?.includes('no longer exists')) onClose()
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal__header">
          <h2 id="modal-title">
            {modal.mode === 'add' ? 'Add Customer' : 'Edit Customer'}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            <div className="field">
              <label htmlFor="m-name">Name</label>
              <input
                id="m-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleFieldChange}
                placeholder="Jane Doe"
                autoComplete="name"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'err-name' : undefined}
              />
              {fieldErrors.name && (
                <span id="err-name" className="field__error" role="alert">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="m-email">Email</label>
              <input
                id="m-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFieldChange}
                placeholder="jane@example.com"
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'err-email' : undefined}
              />
              {fieldErrors.email && (
                <span id="err-email" className="field__error" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="m-phone">Phone Number</label>
              <input
                id="m-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleFieldChange}
                    placeholder="10-digit number, e.g. 9876543210"
                autoComplete="tel"
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
              />
              {fieldErrors.phone && (
                <span id="err-phone" className="field__error" role="alert">
                  {fieldErrors.phone}
                </span>
              )}
            </div>
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting
                ? 'Saving…'
                : modal.mode === 'add'
                ? 'Add Customer'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
