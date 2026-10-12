import { Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { AttachmentUpload } from '@/features/attachments/AttachmentUpload';
import { downloadFile, useAttachments, useDeleteAttachment } from '@/features/attachments/useAttachments';
import { formatFileSize } from '@/utils/formatFileSize';
import { formatDate } from '@/utils/formatDate';

export function AttachmentList({ ticketId }) {
  const { data, isLoading } = useAttachments(ticketId);
  const deleteAction = useDeleteAttachment(ticketId);

  return (
    <section className="space-y-4" aria-label="Attachments">
      <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
      <AttachmentUpload ticketId={ticketId} />
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : null}
      {!isLoading && (!data || data.length === 0) ? (
        <EmptyState title="No files" description="Upload documents or images related to this ticket." />
      ) : null}
      {!isLoading && data && data.length > 0 ? (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {data.map((file) => (
            <li key={file.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{file.filename ?? file.name ?? 'File'}</p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(file.size)} · {formatDate(file.created_at)}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  aria-label="Download file"
                  onClick={() => downloadFile(ticketId, file.id, file.filename ?? file.name ?? 'download')}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  aria-label="Delete file"
                  isLoading={deleteAction.isPending}
                  onClick={() => deleteAction.mutate(file.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
