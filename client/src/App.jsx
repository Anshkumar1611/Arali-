import { useEffect, useMemo, useState } from 'react'
import ConfirmDialog from './components/ConfirmDialog'
import CustomerModal from './components/CustomerModal'
import CustomerTable from './components/CustomerTable'
import Pagination from './components/Pagination'
import SearchBar from './components/SearchBar'
import Toast from './components/Toast'
import { useCustomers } from './hooks/useCustomers'
import { useDebounce } from './hooks/useDebounce'
import { useToast } from './hooks/useToast'
import './App.css'

const PAGE_SIZE = 10

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  )
}

export default function App() {
  const {
    customers,
    pageLoading,
    netError,
    rowLoading,
    load,
    addCustomer,
    editCustomer,
    removeCustomer,
  } = useCustomers()

  const { toast, showToast, dismissToast } = useToast()

  // Search
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  // Sort: key = null | 'name' | 'email' | 'phone'; dir = 'asc' | 'desc'
  const [sortConfig, setSortConfig] = useState({ key: null, dir: 'asc' })

  // Pagination
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever search or sort changes
  useEffect(() => { setPage(1) }, [debouncedQuery, sortConfig])

  // Modal: null = closed; { mode: 'add'|'edit', customer: null|{...} }
  const [modal, setModal] = useState(null)

  // Delete confirmation: null = closed; { id, name }
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => { load() }, [load])

  function handleSort(key) {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
  }

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return customers
    const q = debouncedQuery.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    )
  }, [customers, debouncedQuery])

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered
    return [...filtered].sort((a, b) => {
      const valA = a[sortConfig.key].toLowerCase()
      const valB = b[sortConfig.key].toLowerCase()
      const cmp = valA.localeCompare(valB)
      return sortConfig.dir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortConfig])

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page]
  )

  function requestDelete(customer) {
    setDeleteConfirm({ id: customer.id, name: customer.name })
  }

  async function confirmDelete() {
    const { id } = deleteConfirm
    setDeleteConfirm(null)
    const result = await removeCustomer(id)
    if (result.ok) {
      showToast('Customer deleted.')
    } else {
      showToast(result.error ?? 'Failed to delete customer.', 'error')
    }
  }

  const hasCustomers = customers.length > 0
  const hasResults = filtered.length > 0

  return (
    <div className="dash">
      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Header */}
      <header className="dash__header">
        <div className="dash__title-wrap">
          <h1 className="dash__title">Customers</h1>
          {!pageLoading && (
            <span className="dash__count">{customers.length} total</span>
          )}
        </div>
        <button className="btn btn--primary" onClick={() => setModal({ mode: 'add', customer: null })}>
          + Add Customer
        </button>
      </header>

      {/* Network error */}
      {netError && (
        <div className="banner banner--error" role="alert">
          <span>{netError}</span>
          <button className="btn btn--sm btn--ghost" onClick={load}>
            Retry
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="dash__main">
        {pageLoading ? (
          <div className="dash__spinner-wrap" aria-label="Loading customers">
            <span className="spinner" />
            <span>Loading customers…</span>
          </div>
        ) : !hasCustomers ? (
          <div className="dash__empty">
            <span className="dash__empty-icon">
              <PersonIcon />
            </span>
            <p>No customers yet. Add your first one!</p>
            <button
              className="btn btn--primary"
              onClick={() => setModal({ mode: 'add', customer: null })}
            >
              Add Customer
            </button>
          </div>
        ) : (
          <>
            <SearchBar
              query={query}
              onChange={setQuery}
              totalCount={customers.length}
              filteredCount={filtered.length}
            />

            {!hasResults ? (
              <div className="dash__empty dash__empty--search">
                <p>No customers match &ldquo;{debouncedQuery}&rdquo;.</p>
                <button className="btn btn--ghost btn--sm" onClick={() => setQuery('')}>
                  Clear search
                </button>
              </div>
            ) : (
              <>
                <CustomerTable
                  customers={paginated}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  rowLoading={rowLoading}
                  onEdit={(c) => setModal({ mode: 'edit', customer: c })}
                  onDelete={(c) => requestDelete(c)}
                  globalIndex={(page - 1) * PAGE_SIZE}
                />
                <Pagination
                  page={page}
                  pageCount={pageCount}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* Add / Edit modal */}
      {modal && (
        <CustomerModal
          modal={modal}
          onClose={() => setModal(null)}
          onAdd={addCustomer}
          onEdit={editCustomer}
          showToast={showToast}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          customerName={deleteConfirm.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}
