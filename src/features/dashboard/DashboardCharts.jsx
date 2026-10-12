import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#64748b', '#ef4444'];

export function DashboardCharts({ byStatus, byPriority }) {
  const hasStatus = byStatus.length > 0;
  const hasPriority = byPriority.length > 0;

  if (!hasStatus && !hasPriority) {
    return (
      <EmptyState
        title="No chart data yet"
        description="Dashboard statistics will appear once tickets are created."
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Tickets by status</h2>
        {hasStatus ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {byStatus.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-500">No status breakdown available.</p>
        )}
      </Card>
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Tickets by priority</h2>
        {hasPriority ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byPriority}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-500">No priority breakdown available.</p>
        )}
      </Card>
    </div>
  );
}
