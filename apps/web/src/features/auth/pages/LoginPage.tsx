import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@shared/components/ui/Card';
import { SocialAuthButton } from '../components/SocialAuthButton';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, Routes } from '@careerhub/shared';
import type { LoginInput } from '@careerhub/shared';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? Routes.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await login(data);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorObj = err as { message?: string; code?: string };
      if (errorObj.code === 'AUTH_EMAIL_NOT_VERIFIED') {
        navigate(Routes.VERIFY_EMAIL, { state: { email: data.email } });
      } else {
        setServerError(errorObj.message ?? 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      setIsSubmitting(true);
      // Dummy ID token for demonstration — in production integrated with @react-oauth/google
      await googleAuth({ idToken: 'demo_google_id_token' });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setServerError((err as { message?: string }).message ?? 'Google login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[color:var(--bg-base)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl shadow-md mx-auto mb-2">
              🚀
            </div>
            <CardTitle className="text-2xl font-bold font-heading">Welcome Back</CardTitle>
            <CardDescription>Log in to access your CareerHub AI account</CardDescription>
          </CardHeader>

          <CardBody>
            {serverError && (
              <div className="mb-4 p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm font-medium text-center">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                errorText={errors.email?.message}
                isRequired
                {...register('email')}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                errorText={errors.password?.message}
                isRequired
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-medium text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                }
                {...register('password')}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[color:var(--text-secondary)]">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    {...register('rememberMe')}
                  />
                  Remember me
                </label>
                <Link
                  to={Routes.FORGOT_PASSWORD}
                  className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="mt-2">
                Sign In
              </Button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[color:var(--border-subtle)]" />
              </div>
              <span className="relative bg-[color:var(--bg-surface)] px-3 text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-medium">
                Or continue with
              </span>
            </div>

            <SocialAuthButton provider="google" onClick={handleGoogleSuccess} isLoading={isSubmitting} />
          </CardBody>

          <CardFooter className="justify-center text-sm text-[color:var(--text-muted)]">
            Don't have an account?{' '}
            <Link to={Routes.REGISTER} className="font-semibold text-primary-500 hover:underline">
              Create an account
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
