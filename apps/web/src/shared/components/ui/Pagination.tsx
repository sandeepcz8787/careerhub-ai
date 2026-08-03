import { cn } from '@shared/utils/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={cn(
            'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium border border-transparent transition-colors',
            currentPage === 1
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)]'
          )}
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(
          <span key="dots-start" className="px-1 text-[color:var(--text-muted)] text-sm">
            ...
          </span>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium border border-transparent transition-colors',
            currentPage === i
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)]'
          )}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="dots-end" className="px-1 text-[color:var(--text-muted)] text-sm">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={cn(
            'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium border border-transparent transition-colors',
            currentPage === totalPages
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)]'
          )}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <nav
      className={cn('flex items-center justify-center gap-1.5 py-4', className)}
      aria-label="Pagination Navigation"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous Page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next Page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
