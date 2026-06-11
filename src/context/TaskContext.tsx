// 'use client';
// import { createContext, useContext, useEffect, useReducer } from 'react';

// type Task = {
//     id :number;
//     title:string;
//     completed :boolean;
// };

// type State ={
//     tasks:Task[];
//     isLoading:boolean;
//     error:string | null;

// };

// type Action =
//   | { type: 'FETCH_START' }
//   | { type: 'FETCH_SUCCESS'; payload: Task[] }
//   | { type: 'FETCH_ERROR'; payload: string }
//   | { type: 'ADD_TASK'; payload: Task }
//   | { type: 'DELETE_TASK'; payload: number }
//   | { type: 'COMPLETE_TASK'; payload: number };


//   const initialState: State = {
//     tasks: [],
//     isLoading: false,
//     error: null,
//   };

//   function reducer(state:State,action:Action):State {
//     switch(action.type){
//       case 'FETCH_START':
//         return {...state,isLoading:true,error:null};
//       case 'FETCH_SUCCESS':
//         return {...state,tasks:action.payload,isLoading:false};
//       case 'FETCH_ERROR':
//         return {...state,isLoading:false,error:action.payload};
//       case 'ADD_TASK':
//         return {...state,tasks:[...state.tasks,action.payload]};
//       case 'DELETE_TASK':
//         return {...state,tasks:state.tasks.filter(t=>t.id!==action.payload)};
//       case 'COMPLETE_TASK':
//         return {...state,tasks:state.tasks.map(t=>t.id===action.payload?{...t,completed:!t.completed}:t)};
//       default:
//         return state;
//     }
//   }

//   type TaskContextType = {
//     state:State;
//     dispatch:React.Dispatch<Action>;
//   };

//   const TaskContext = createContext<TaskContextType | null>(null);

//   export function TaskProvider({children} : {children:React.ReactNode}) {
//     const [state,dispatch] = useReducer(reducer,initialState);


//     useEffect(() => {
//       const fetchTasks = async () => {
//         dispatch({ type: 'FETCH_START' });
//         try {
//           const res = await fetch('/api/tasks');
//           if (!res.ok) throw new Error("Failed");
//           const data = await res.json();
//           dispatch({ type: 'FETCH_SUCCESS', payload: data.tasks });
//         } catch {
//           dispatch({ type: 'FETCH_ERROR', payload: 'Failed to fetch tasks' });
//         }
//       };
//       fetchTasks();
//     },[]);

//     return (
//       <TaskContext.Provider value={{state,dispatch}}>
//         {children}
//       </TaskContext.Provider>
//     );
//   }

//   export function useTaskContext(){
//     const context = useContext(TaskContext);
//     if(!context) throw new Error('useTaskContext must be used within a TaskProvider');
//     return context;
//   }