// 'use client';
// import { useTaskContext } from "@/context/TaskContext";

// export default function NavBar() {
//     const { state } = useTaskContext();

//     const completedCount = state.tasks.filter(task=> task.completed).length;

//     const totalCount = state.tasks.length;
//     return (
//         <nav className="flex justify-between items-center mb-4">
//             <span className="font-bold">Task: {totalCount}</span>
//             <span className="font-bold">Completed: {completedCount}</span>
//         </nav>
//     );
// }