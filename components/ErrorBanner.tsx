interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="bg-red-600 text-white px-3 py-2 rounded-md flex items-center gap-2">
      <span className="text-sm">⚠️</span>
      <span className="text-sm">{message}</span>
    </div>
  );
}