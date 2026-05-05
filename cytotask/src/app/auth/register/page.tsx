'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRegister } from '@/hooks';
import { registerSchema, type RegisterInput } from '@/schemas';

export default function RegisterPage() {
  const { mutate: registerUser, isPending, error } = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    registerUser(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-gray-400">Sign up to get started with CytoTask</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          {...register('full_name')}
          error={errors.full_name?.message}
        />

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

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        {error && (
          <div className="animate-fade-in rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error.message}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={isPending}>
          Sign up
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-400">Already have an account? </span>
        <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}
