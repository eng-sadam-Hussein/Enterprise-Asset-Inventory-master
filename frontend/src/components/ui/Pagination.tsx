import Button from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  alwaysShow?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize = 10,
  onPageChange,
  alwaysShow = false,
}: PaginationProps) {
  if (!alwaysShow && totalPages <= 1) {
    return null;
  }

  const safeTotalPages = Math.max(totalPages, 1);
  const start = totalElements === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row">
      <p className="text-sm text-slate-500">
        Showing {start} to {end} of {totalElements} results
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 0}>
          Prev
        </Button>
        <span className="text-sm text-slate-600">
          Page {page + 1} of {safeTotalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
