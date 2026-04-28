export const API_BASE = (() => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  return import.meta.env.DEV ? '/api' : 'http://localhost:3001'
})()

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)
  return res
}

export async function getCustomers() {
  const res = await request('/customers')
  if (!res.ok) throw new Error(`Server error ${res.status}`)
  return res.json()
}

export async function createCustomer(payload) {
  const res = await request('/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res
}

export async function updateCustomer(id, payload) {
  const res = await request(`/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res
}

export async function deleteCustomer(id) {
  const res = await request(`/customers/${id}`, { method: 'DELETE' })
  return res
}
