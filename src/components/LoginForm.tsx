'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ── Schema ────────────────────────────────────
const LoginSchema = z.object({
  email: z.string()
    .nonempty('Email is required')
    .email('Please enter a valid email'),
  password: z.string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// ── Type ──────────────────────────────────────
type LoginFormData = z.infer<typeof LoginSchema>;

// ── Form Component ────────────────────────────
export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen items-center
                     justify-center bg-blue-700 p-4">
      <div className="bg-white p-10 rounded-xl shadow-md
                      w-full max-w-md">

        <h1 className="text-3xl font-bold text-gray-800
                       mb-6 text-center">
          Welcome Back!
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="ali@gmail.com"
              {...register('email')}
              className={`
                border rounded-lg px-3 py-2
                text-gray-800
                focus:outline-none focus:ring-2
                transition-colors
                ${errors.email
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-blue-400'
                }
              `}
            // ✅ backticks now — ${} works correctly
            />
            {errors.email && (
              <p className="text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`
                border rounded-lg px-3 py-2
                text-gray-800
                focus:outline-none focus:ring-2
                transition-colors
                ${errors.password
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-blue-400'
                }
              `}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white py-2
                       rounded-lg font-medium mt-2
                       hover:bg-blue-600 transition-colors
                       disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

        </form>
      </div>
    </main>
  );
}