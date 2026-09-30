import type { ReactNode } from "react";

interface ResponseDisplayProps {
  title: string;
  data: any;
  isLoading?: boolean;
  error?: string;
  children?: ReactNode;
}

export default function ResponseDisplay({
  title,
  data,
  isLoading = false,
  error,
  children,
}: ResponseDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="border border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg p-4 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 text-center text-slate-600 dark:text-slate-400">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-6">
          {children || (
            <pre className="bg-slate-50 dark:bg-slate-800 p-4 rounded text-sm overflow-auto text-slate-700 dark:text-slate-300 font-mono max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
