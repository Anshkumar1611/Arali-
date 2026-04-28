export default function SearchBar({ query, onChange, totalCount, filteredCount }) {
  const isFiltering = query.length > 0

  return (
    <div className="toolbar">
      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path strokeLinecap="round" d="M15 15l-3-3" />
          </svg>
        </span>
        <input
          className="search-input"
          type="text"
          role="searchbox"
          inputMode="search"
          autoComplete="off"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, email or phone…"
          aria-label="Search customers"
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {isFiltering && (
        <p className="search-result-count" role="status" aria-live="polite">
          {filteredCount === 0
            ? 'No results'
            : `${filteredCount} of ${totalCount} customer${totalCount !== 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  )
}
