// // app/users/page.tsx
// // ✅ SERVER COMPONENT — no 'use client'

// import UserSearch from './UserSearch';

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   role: "admin" | "user";
// };

// // fake data — pretend this comes from database
// const users: User[] = [
//   { id:1, name:"Ali",   email:"ali@g.com",   role:"admin" },
//   { id:2, name:"Sara",  email:"sara@g.com",  role:"user"  },
//   { id:3, name:"John",  email:"john@g.com",  role:"user"  },
//   { id:4, name:"Maria", email:"maria@g.com", role:"admin" },
//   { id:5, name:"Ahmed", email:"ahmed@g.com", role:"user"  },
// ];

// export default async function UsersPage() {
//   // simulate database fetch
//   await new Promise(r => setTimeout(r, 100));
//   // in real app: const { rows: users } = await pool.query(...)

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto px-4 py-10">

//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Users
//         </h1>
//         <p className="text-gray-500 mb-8">
//           {users.length} users total
//         </p>

//         {/* ✅ Pass users to client component */}
//         <UserSearch users={users} />

//       </div>
//     </main>
//   );
// }