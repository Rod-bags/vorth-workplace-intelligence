import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <main className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Vorth Workplace Intelligence
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your workspace platform.
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
        >
          Go to Login
        </Link>
      </main>
    </div>
  );
}