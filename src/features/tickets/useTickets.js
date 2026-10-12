import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTicket, getTickets } from '@/api/ticketApi';
import { queryKeys } from '@/app/queryKeys';

export function useTickets(filters) {
  return useQuery({
    queryKey: queryKeys.tickets.list(filters),
    queryFn: () => getTickets(filters),
    placeholderData: keepPreviousData,
  });
}

export function useTicket(id) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn: () => getTicket(id),
    enabled: id > 0,
  });
}
