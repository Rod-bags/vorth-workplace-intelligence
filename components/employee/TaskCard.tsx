interface TaskCardProps {
  title: string;
  status: string;
}

export function TaskCard({ title, status }: TaskCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 flex justify-between items-center">
      <p className="font-medium text-gray-900 dark:text-white">{title}</p>
      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{status}</span>
    </div>
  );
}