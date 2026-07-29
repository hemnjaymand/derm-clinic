import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({
  className,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div role="status" className="flex items-center justify-center">
      <svg
        className={cn(
          "animate-spin text-muted-foreground",
          sizeMap[size],
          className,
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">در حال بارگذاری...</span>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}
