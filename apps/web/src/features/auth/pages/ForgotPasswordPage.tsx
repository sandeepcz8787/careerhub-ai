import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@shared/components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { forgotPasswordSchema, Routes } from '@careerhub/shared';
import type { ForgotPasswordInput } from '@careerhub/shared';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await forgotPassword(data);
      setIsSubmitted(true);
    } catch (err: unknown) {
      setServerError((err as { message?: string }).message ?? 'Failed to send reset link.');
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
              🔑
            </div>
            <CardTitle className="text-2xl font-bold font-heading">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>

          <CardBody>
            {isSubmitted ? (
              <div className="text-center py-4 space-y-4">
                <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-500 text-sm font-medium">
                  If an account exists with that email, reset instructions have been sent. Please check your inbox.
                </div>
                <p className="text-xs text-[color:var(--text-muted)]">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setIsSubmitted(false)}
                >
                  Try another email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {serverError && (
                  <div className="p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm font-medium text-center">
                    {serverError}
                  </div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  errorText={errors.email?.message}
                  isRequired
                  {...register('email')}
                />

                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                  Send Reset Link
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
