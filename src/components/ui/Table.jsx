export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }) {
  return <thead className="bg-slate-50">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr className="hover:bg-slate-50/80">{children}</tr>;
}

export function TableHeaderCell({ children }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</th>;
}

export function TableCell({ children, className = '' }) {
  return <td className={`px-4 py-3 text-slate-700 ${className}`}>{children}</td>;
}
