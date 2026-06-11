// ✅ Correct version
'use client';
import { useRouter } from 'next/navigation';
//                        ^^^^^^^^^^^^^^^ fixed!

export default function NavigationDemo() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const goToTasks = () => {
    router.push('/tasks');
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Navigation Demo
      </h1>

      <button
        onClick={goToTasks}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Go to Tasks
      </button>

      <button
        onClick={goToHome}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Go Home
      </button>

      <button
        onClick={goBack}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}