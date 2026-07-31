export default function EmployeeLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800" />
        ))}
      </div>
    </div>
  );
}