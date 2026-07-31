export default function AdminLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-64" />
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-32" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}