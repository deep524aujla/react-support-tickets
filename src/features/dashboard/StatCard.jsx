import { Card } from '@/components/ui/Card';

export function StatCard({ label, value }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value ?? '—'}</p>
    </Card>
  );
}
