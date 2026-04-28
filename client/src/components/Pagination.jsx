const MAX_VISIBLE_PAGES = 5

function pageRange(current, total) {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const half = Math.floor(MAX_VISIBLE_PAGES / 2)
  let start = Math.max(1, current - half)
  let end = start + MAX_VISIBLE_PAGES - 1
  if (end > total) {
    end = total
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  const pages = pageRange(page, pageCount)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="btn btn--sm btn--ghost pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <ul className="pagination__pages">
        {pages[0] > 1 && (
          <>
            <li>
              <button className="pagination__page" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {pages[0] > 2 && <li className="pagination__ellipsis">…</li>}
          </>
        )}

        {pages.map((p) => (
          <li key={p}>
            <button
              className={`pagination__page ${p === page ? 'pagination__page--active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          </li>
        ))}

        {pages[pages.length - 1] < pageCount && (
          <>
            {pages[pages.length - 1] < pageCount - 1 && (
              <li className="pagination__ellipsis">…</li>
            )}
            <li>
              <button
                className="pagination__page"
                onClick={() => onPageChange(pageCount)}
              >
                {pageCount}
              </button>
            </li>
          </>
        )}
      </ul>

      <button
        className="btn btn--sm btn--ghost pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  )
}
