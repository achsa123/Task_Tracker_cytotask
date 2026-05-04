'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginInput } from '@/schemas';
import { useLogin } from '@/hooks';

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-400">Enter your credentials to sign in</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="m@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        {error && (
          <div className="animate-fade-in rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error.message}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={isPending}>
          Sign in
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-400">Don't have an account? </span>
        <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
}
