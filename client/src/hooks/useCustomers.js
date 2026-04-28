import { useCallback, useState } from 'react'
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../utils/api'

export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [netError, setNetError] = useState(null)
  const [rowLoading, setRowLoading] = useState({})

  const load = useCallback(async () => {
    try {
      setNetError(null)
      const data = await getCustomers()
      setCustomers(data)
    } catch {
      setNetError('Could not reach the server. Make sure it is running on port 3001.')
    } finally {
      setPageLoading(false)
    }
  }, [])

  async function addCustomer(payload) {
    const res = await createCustomer(payload)
    if (!res.ok) return { ok: false, error: 'Failed to add customer.' }
    const data = await res.json()
    setCustomers((prev) => [...prev, data])
    return { ok: true, data }
  }

  async function editCustomer(id, payload) {
    setRowLoading((r) => ({ ...r, [id]: 'editing' }))
    try {
      const res = await updateCustomer(id, payload)
      if (res.status === 404) {
        setCustomers((prev) => prev.filter((c) => c.id !== id))
        return { ok: false, error: 'Customer no longer exists.' }
      }
      if (!res.ok) return { ok: false, error: 'Failed to update customer.' }
      const data = await res.json()
      setCustomers((prev) => prev.map((c) => (c.id === id ? data : c)))
      return { ok: true, data }
    } finally {
      setRowLoading((r) => {
        const next = { ...r }
        delete next[id]
        return next
      })
    }
  }

  async function removeCustomer(id) {
    setRowLoading((r) => ({ ...r, [id]: 'deleting' }))
    try {
      const res = await deleteCustomer(id)
      if (res.status === 204) {
        setCustomers((prev) => prev.filter((c) => c.id !== id))
        return { ok: true }
      }
      if (res.status === 404) {
        await load()
        return { ok: false, error: 'Customer not found — list refreshed.' }
      }
      return { ok: false, error: 'Failed to delete customer.' }
    } catch {
      return { ok: false, error: 'Failed to delete customer. Please try again.' }
    } finally {
      setRowLoading((r) => {
        const next = { ...r }
        delete next[id]
        return next
      })
    }
  }

  return {
    customers,
    pageLoading,
    netError,
    rowLoading,
    load,
    addCustomer,
    editCustomer,
    removeCustomer,
  }
}
