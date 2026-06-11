// 'use client';
// import {useState, useEffect} from 'react';
// import {useTaskContext} from '../context/TaskContext';

// export default function AddTaskForm() {
//     const {dispatch} = useTaskContext();
//     const [title,setTitle] = useState('');

//     const addTask = async () => {
//         if(!title || title.trim() === '') return;
//         try{
//             const res = await fetch('/api/tasks',{
//                 method:'POST',
//                 headers:{'Content-Type':'application/json'},
//                 body:JSON.stringify({title})
//             });
//             if(!res.ok) throw new Error("Failed");
//             const data = await res.json();
//             dispatch({type:'ADD_TASK',payload:data.task});
//             setTitle('');
//         }catch{
//             dispatch({type:'FETCH_ERROR',payload:'Failed to add task'});
//         }
//     }

//     return (
//         <form onSubmit={(e)=>{
//             e.preventDefault();
//             addTask();
//         }}>
//             <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)}/>
//             <button type="submit">Add Task</button>
//         </form>

//     );

// }