import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@shared/components/ui/Card';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { useAuth } from '../hooks/useAuth';
import { resetPasswordSchema, Routes } from '@careerhub/shared';
import type { ResetPasswordInput } from '@careerhub/shared';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { resetPassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setServerError('Reset token is missing or invalid.');
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError(null);
      await resetPassword({ ...data, token });
      setIsSuccess(true);
    } catch (err: unknown) {
      setServerError((err as { message?: string }).message ?? 'Failed to reset password.');
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
              🔒
            </div>
            <CardTitle className="text-2xl font-bold font-heading">Reset Password</CardTitle>
            <CardDescription>Create a new strong password for your account</CardDescription>
          </CardHeader>

          <CardBody>
            {!token && (
              <div className="mb-4 p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm font-medium text-center">
                Invalid or missing reset token. Please request a new link.
              </div>
            )}

            {isSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-500 text-sm font-medium">
                  Your password has been successfully reset! All active sessions have been logged out for security.
                </div>
                <Button fullWidth onClick={() => navigate(Routes.LOGIN)}>
                  Log in with New Password
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {serverError && (
                  <div className="p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm font-medium text-center">
                    {serverError}
                  </div>
                )}

                <div className="space-y-1">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    errorText={errors.password?.message}
                    isRequired
                    disabled={!token}
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
                  <PasswordStrengthMeter password={passwordValue} />
                </div>

                <Input
                  label="Confirm New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  errorText={errors.confirmPassword?.message}
                  isRequired
                  disabled={!token}
                  {...register('confirmPassword')}
                />

                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} disabled={!token}>
                  Reset Password
                </Button>
              </form>
            )}
          </CardBody>

          <CardFooter className="justify-center text-sm text-[color:var(--text-muted)]">
            Remembered your password?{' '}
            <Link to={Routes.LOGIN} className="font-semibold text-primary-500 hover:underline">
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
