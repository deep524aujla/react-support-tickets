import { useState } from 'react';
import { FileInput } from '@/components/ui/FileInput';
import { useUploadAttachment } from '@/features/attachments/useAttachments';

export function AttachmentUpload({ ticketId }) {
  const uploadAction = useUploadAttachment(ticketId);
  const [progress, setProgress] = useState(null);

  return (
    <div className="space-y-2">
      <FileInput
        disabled={uploadAction.isPending}
        onFileSelect={(file) => {
          setProgress(0);
          uploadAction.mutate(
            { file, onProgress: setProgress },
            { onSettled: () => setProgress(null) },
          );
        }}
      />
      {progress !== null ? (
        <div className="space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-brand-600 transition-all"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-xs text-slate-500">{progress}% uploaded</p>
        </div>
      ) : null}
    </div>
  );
}
