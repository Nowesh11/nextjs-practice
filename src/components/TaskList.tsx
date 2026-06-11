// // components/TaskList.tsx
// 'use client';
// import { useTaskContext } from "@/context/TaskContext";

// export default function TaskList() {
//   const { state, dispatch } = useTaskContext();

  
//   if(state.isLoading) return <p>Loading...</p>
//   if(state.error) return <p>{state.error}</p>
//   if(state.tasks.length === 0) return <p>No tasks</p>;

//   return (
//     <ul>
//       {state.tasks.map(task => (
//         <li key={task.id}>
//           <span>{task.title}</span>
//           <button onClick={() => dispatch({ type: 'COMPLETE_TASK', payload: task.id })}>Complete</button>
//           <button onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}>Delete</button>
//         </li>
//       ))}
//     </ul>
//   );
// }