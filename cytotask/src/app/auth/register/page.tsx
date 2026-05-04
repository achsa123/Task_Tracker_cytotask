'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRegister } from '@/hooks';

// Only requesting email and password per instructions
const authRegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthRegisterInput = z.infer<typeof authRegisterSchema>;

export default function RegisterPage() {
  const { mutate: registerUser, isPending, error } = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRegisterInput>({
    resolver: zodResolver(authRegisterSchema),
  });

  const onSubmit = (data: AuthRegisterInput) => {
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
