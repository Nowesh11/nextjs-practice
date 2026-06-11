'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import CheckOutButton from '@/components/CheckOutButton';

export default async function DashboardPage() {
  // get session here
  const session = await auth();
  // if no session → redirect to /login
  if (!session) return redirect('/login');
  //hiii

  // show user data
  return (
    <div className="flex gap-4 border border-gray-100 shadow-sm bg-white rounded-lg p-4 w-full max-w-md items-center">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-lg font-medium text-gray-500">{session.user.email}</p>
      <p className="text-lg font-medium text-gray-500">{session.user.name}</p>
      <p className="text-lg font-medium text-gray-500">{session.user.role}</p>
      <p>Premium: {session.user.isPremium ? '✅ Yes' : '❌ No'}</p>
      <CheckOutButton />
      <LogoutButton />
    </div>
  )
}