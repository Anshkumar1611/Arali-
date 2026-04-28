function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) {
    return <span className="sort-icon sort-icon--inactive" aria-hidden="true">↕</span>
  }
  return (
    <span className="sort-icon sort-icon--active" aria-hidden="true">
      {sortConfig.dir === 'asc' ? '↑' : '↓'}
    </span>
  )
}

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
]

export default function CustomerTable({
  customers,
  sortConfig,
  onSort,
  rowLoading,
  onEdit,
  onDelete,
  globalIndex,
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              {COLUMNS.map(({ key, label }) => (
                <th key={key}>
                  <button
                    className="sort-btn"
                    onClick={() => onSort(key)}
                    aria-sort={
                      sortConfig.key === key
                        ? sortConfig.dir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    {label}
                    <SortIcon column={key} sortConfig={sortConfig} />
                  </button>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id} className={rowLoading[c.id] ? 'row--loading' : ''}>
                <td className="row__num">{globalIndex + i + 1}</td>
                <td className="row__name">{c.name}</td>
                <td className="row__email">
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </td>
                <td>{c.phone}</td>
                <td className="row__actions">
                  <button
                    className="btn btn--sm btn--ghost"
                    onClick={() => onEdit(c)}
                    disabled={!!rowLoading[c.id]}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn--sm btn--danger"
                    onClick={() => onDelete(c)}
                    disabled={!!rowLoading[c.id]}
                  >
                    {rowLoading[c.id] === 'deleting' ? '…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <ul className="cards" aria-label="Customer list">
        {customers.map((c, i) => (
          <li
            key={c.id}
            className={`card ${rowLoading[c.id] ? 'row--loading' : ''}`}
          >
            <div className="card__badge">{globalIndex + i + 1}</div>
            <div className="card__body">
              <p className="card__name">{c.name}</p>
              <p className="card__detail">
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </p>
              <p className="card__detail">{c.phone}</p>
            </div>
            <div className="card__actions">
              <button
                className="btn btn--sm btn--ghost"
                onClick={() => onEdit(c)}
                disabled={!!rowLoading[c.id]}
              >
                Edit
              </button>
              <button
                className="btn btn--sm btn--danger"
                onClick={() => onDelete(c)}
                disabled={!!rowLoading[c.id]}
              >
                {rowLoading[c.id] === 'deleting' ? '…' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
