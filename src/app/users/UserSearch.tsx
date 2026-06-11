// // app/users/UserSearch.tsx
// // ✅ CLIENT COMPONENT — needs useState
// 'use client';
// import { useState, useMemo } from 'react';

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   role: "admin" | "user";
// };

// export default function UserSearch({
//   users
// }: {
//   users: User[]
// }) {
//   const [search, setSearch] = useState('');
//   const [role, setRole] = useState('');
//   // '' = all roles

//   // ✅ filter by BOTH name AND role
//   const filtered = useMemo(() => {
//     return users
//       .filter(u =>
//         u.name.toLowerCase().includes(search.toLowerCase())
//       )
//       .filter(u =>
//         role === '' ? true : u.role === role
//       );
//   }, [users, search, role]); // ✅ all 3 dependencies

//   return (
//     <div>
//       {/* Search + Filter */}
//       <div className="flex gap-3 mb-6">
//         <input
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="Search by name..."
//           className="border border-gray-300 rounded-lg
//                      px-4 py-2 flex-1 focus:outline-none
//                      focus:ring-2 focus:ring-blue-400"
//         />

//         {/* ✅ Filter buttons instead of select */}
//         <div className="flex gap-2">
//           {(['', 'admin', 'user'] as const).map(r => (
//             <button
//               key={r}
//               onClick={() => setRole(r)}
//               className={`px-4 py-2 rounded-lg capitalize
//                          transition-colors text-sm font-medium ${
//                 role === r
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-white border border-gray-300
//                      text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               {r === '' ? 'All' : r}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Results count */}
//       <p className="text-sm text-gray-500 mb-4">
//         {filtered.length} users found
//       </p>

//       {/* Empty state */}
//       {filtered.length === 0 ? (
//         <div className="text-center py-12 text-gray-400">
//           <p className="text-4xl mb-2">🔍</p>
//           <p>No users found</p>
//         </div>
//       ) : (
//         // ✅ User cards grid
//         <div className="grid grid-cols-1 md:grid-cols-2
//                         lg:grid-cols-3 gap-4">
//           {filtered.map(user => (
//             <div
//               key={user.id}
//               className="bg-white p-4 rounded-xl border
//                          border-gray-100 shadow-sm
//                          hover:shadow-md transition-shadow"
//             >
//               {/* Name */}
//               <p className="font-bold text-gray-800 text-lg">
//                 {user.name}
//               </p>

//               {/* Email */}
//               <p className="text-sm text-gray-500 mt-1">
//                 {user.email}
//               </p>

//               {/* Role badge */}
//               <div className="mt-3">
//                 <span className={`
//                   text-xs px-2 py-1 rounded-full
//                   font-medium capitalize
//                   ${user.role === 'admin'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'bg-gray-100 text-gray-700'
//                   }
//                 `}>
//                   {user.role}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }