import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function usePagination(initialPage = 1, perPage = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(initialPage);

  function resetPage() {
    setPage(1);
  }

  return { page, perPage, setPage, resetPage };
}
