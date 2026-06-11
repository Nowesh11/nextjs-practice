// app/tasks/[id]/page.tsx
import Link from "next/link";


type Task = {
    id: number;
    title: string;
    description: string;
}

export default function TaskDetailPage({
  params
}: {
  params: { id: string }
}) {
 
    const TaskItem = {
        id: params.id,
        title: `Task number ${params.id}`,
        description: `This is the detail for task ${params.id}`
    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-4xl font-bold">Task {params.id}</h1>
            <p className="text-2xl font-medium">{TaskItem.description}</p>
            <Link href="/tasks" className="text-2xl font-medium">Go Back</Link>
        </main>

    );
}