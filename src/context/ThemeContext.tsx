// 'use client';
// import { createContext, useState, useContext } from 'react';

// // ── Types ────────────────────────────────────
// type ThemeContextType = {
//   theme: 'light' | 'dark';
//   toggleTheme: () => void;
// };

// // ── Create Context ───────────────────────────
// const ThemeContext = createContext<ThemeContextType | null>(null);

// // ── Provider ─────────────────────────────────
// export function ThemeProvider({
//   children
// }: {
//   children: React.ReactNode
// }) {
//   const [theme, setTheme] = useState<'light' | 'dark'>('light');

//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light');
//   };

//   return (
//     // ✅ just value — no extra props
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// // ── Custom Hook ───────────────────────────────
// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used inside ThemeProvider');
//   }
//   return context;
// }

// // ── NavBar Component ──────────────────────────
// function NavBar() {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <nav className={`px-6 py-4 flex justify-between items-center
//       border-b transition-colors duration-300 ${
//       theme === 'dark'
//         ? 'bg-gray-900 border-gray-700'   // ✅ full class name
//         : 'bg-white border-gray-200'       // ✅ full class name
//     }`}>

//       {/* Logo */}
//       <span className={`text-xl font-bold ${
//         theme === 'dark' ? 'text-white' : 'text-gray-900'
//       }`}>
//         MyApp
//       </span>

//       {/* Toggle button */}
//       <button
//         onClick={toggleTheme}
//         className={`px-4 py-2 rounded-lg transition-colors ${
//           theme === 'dark'
//             ? 'bg-gray-700 text-white hover:bg-gray-600'
//             : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
//         }`}
//       >
//         {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
//       </button>

//     </nav>
//   );
// }

// // ── PageContent Component ─────────────────────
// function PageContent() {
//   const { theme } = useTheme();

//   return (
//     <main className={`min-h-screen flex flex-col items-center
//       justify-center gap-4 transition-colors duration-300 ${
//       theme === 'dark'
//         ? 'bg-gray-900 text-white'   // ✅ full class name
//         : 'bg-gray-50 text-gray-900' // ✅ full class name
//     }`}>

//       <h1 className="text-4xl font-bold">
//         Hello!
//       </h1>

//       <p className={`text-lg ${
//         theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
//       }`}>
//         Current theme: {theme}
//       </p>

//       {/* Theme indicator card */}
//       <div className={`p-6 rounded-lg shadow-md ${
//         theme === 'dark'
//           ? 'bg-gray-800 text-white'
//           : 'bg-white text-gray-900'
//       }`}>
//         <p className="text-center">
//           {theme === 'dark'
//             ? '🌙 Dark mode is on'
//             : '☀️ Light mode is on'
//           }
//         </p>
//       </div>

//     </main>
//   );
// }

// // ── Main Page ─────────────────────────────────
// export default function Home() {
//   return (
//     // ✅ just ThemeProvider — no extra props
//     <ThemeProvider>
//       <NavBar />
//       <PageContent />
//     </ThemeProvider>
//   );
// }