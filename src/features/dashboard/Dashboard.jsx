import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/api/dashboardApi';
import { queryKeys } from '@/app/queryKeys';
import { useAuth } from '@/features/auth/useAuth';
import { StatCard } from '@/features/dashboard/StatCard';
import { DashboardCharts } from '@/features/dashboard/DashboardCharts';
import { getPriorityChart, getStats, getStatusChart } from '@/features/dashboard/dashboardStats';
import { Skeleton } from '@/components/ui/Skeleton';
import { getError } from '@/utils/errors';

export function Dashboard() {
  const { role } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: getDashboard,
  });

  const stats = getStats(data, role);
  const byStatus = getStatusChart(data);
  const byPriority = getPriorityChart(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Overview of support activity</p>
      </div>
      {isError ? (
        <p className="text-sm text-red-600" role="alert">
          {getError(error, 'Failed to load dashboard')}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24 w-full" />)
          : stats.map((stat) => <StatCard key={stat.key ?? stat.label} label={stat.label} value={stat.value} />)}
      </div>
      {isLoading ? <Skeleton className="h-72 w-full" /> : <DashboardCharts byStatus={byStatus} byPriority={byPriority} />}
    </div>
  );
}
