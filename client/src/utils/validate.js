// Letters (basic Latin + accented), spaces, hyphens, apostrophes only.
const NAME_RE = /^[a-zA-Z\u00C0-\u024F\s'\-]+$/

// Standard email: letters/digits/dots/+/_ in local part; proper domain + TLD.
// Rejects characters like #, !, etc. in the local part.
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

export function validate(form) {
  const errs = {}
  const name = form.name.trim()
  const email = form.email.trim()
  const phone = form.phone.trim()

  // ── Name ──────────────────────────────────────────────────────────────────
  if (!name) {
    errs.name = 'Name is required.'
  } else if (name.length < 2) {
    errs.name = 'Name must be at least 2 characters.'
  } else if (!NAME_RE.test(name)) {
    errs.name = 'Name must contain letters only (no numbers or symbols).'
  }

  // ── Email ─────────────────────────────────────────────────────────────────
  if (!email) {
    errs.email = 'Email is required.'
  } else if (!EMAIL_RE.test(email)) {
    errs.email = 'Enter a valid email address (e.g. jane@example.com).'
  }

  // ── Phone — exactly 10 digits (formatting characters are stripped first) ──
  if (!phone) {
    errs.phone = 'Phone number is required.'
  } else {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      errs.phone = `Phone must be exactly 10 digits (${digits.length} entered).`
    }
  }

  return errs
}
