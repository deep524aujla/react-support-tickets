import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export function FileInput({ onFileSelect, accept, disabled = false }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function pickFile(files) {
    const file = files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) {
      return;
    }
    pickFile(event.dataTransfer.files);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) {
          setIsDragging(true);
        }
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50'} ${disabled ? 'opacity-60' : 'cursor-pointer hover:border-brand-400'}`}
      onClick={() => {
        if (!disabled) {
          inputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      aria-label="Upload file"
    >
      <Upload className="mb-2 h-8 w-8 text-slate-400" />
      <p className="text-sm font-medium text-slate-700">Drop a file here or click to browse</p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        disabled={disabled}
        onChange={(event) => pickFile(event.target.files)}
      />
    </div>
  );
}
