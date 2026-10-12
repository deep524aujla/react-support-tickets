import { Button } from '@/components/ui/Button';

export function Pagination({ page, lastPage, total, onPageChange }) {
  if (!lastPage || lastPage <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <p className="text-sm text-slate-600">
        Page {page} of {lastPage}
        {total !== undefined ? ` · ${total} total` : ''}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
