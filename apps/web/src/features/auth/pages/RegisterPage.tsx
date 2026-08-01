import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@shared/components/ui/Card';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { SocialAuthButton } from '../components/SocialAuthButton';
import { useAuth } from '../hooks/useAuth';
import { registerSchema, Routes, UserRole } from '@careerhub/shared';
import type { RegisterInput } from '@careerhub/shared';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, googleAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.STUDENT,
      agreeToTerms: true,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await registerUser(data);
      navigate(Routes.VERIFY_EMAIL, { state: { email: data.email } });
    } catch (err: unknown) {
      setServerError((err as { message?: string }).message ?? 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      setIsSubmitting(true);
      await googleAuth({ idToken: 'demo_google_id_token' });
      navigate(Routes.DASHBOARD);
    } catch (err: unknown) {
      setServerError((err as { message?: string }).message ?? 'Google authentication failed.');
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
        className="w-full max-w-lg"
      >
        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl shadow-md mx-auto mb-2">
              ✨
            </div>
            <CardTitle className="text-2xl font-bold font-heading">Create an Account</CardTitle>
            <CardDescription>Join CareerHub AI to boost your career journey</CardDescription>
          </CardHeader>

          <CardBody>
            {serverError && (
              <div className="mb-4 p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm font-medium text-center">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  errorText={errors.firstName?.message}
                  isRequired
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  errorText={errors.lastName?.message}
                  isRequired
                  {...register('lastName')}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                errorText={errors.email?.message}
                isRequired
                {...register('email')}
              />

              <div className="space-y-1">
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
                <PasswordStrengthMeter password={passwordValue} />
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                errorText={errors.confirmPassword?.message}
                isRequired
                {...register('confirmPassword')}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[color:var(--text-primary)]">I am a...</label>
                <select
                  className="input-base"
                  {...register('role')}
                >
                  <option value={UserRole.STUDENT}>Student / Fresher</option>
                  <option value={UserRole.PROFESSIONAL}>Working Professional</option>
                  <option value={UserRole.RECRUITER}>Recruiter / Employer</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <label className="flex items-start gap-2 cursor-pointer select-none text-sm text-[color:var(--text-secondary)]">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    {...register('agreeToTerms')}
                  />
                  <span>
                    I agree to the{' '}
                    <a href="/terms" className="text-primary-500 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary-500 hover:underline">
                      Privacy Policy
                    </a>.
                  </span>
                </label>
                {errors.agreeToTerms?.message && (
                  <p className="text-xs text-error-500 font-medium">{errors.agreeToTerms.message}</p>
                )}
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="mt-2">
                Create Free Account
              </Button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[color:var(--border-subtle)]" />
              </div>
              <span className="relative bg-[color:var(--bg-surface)] px-3 text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-medium">
                Or sign up with
              </span>
            </div>

            <SocialAuthButton provider="google" onClick={handleGoogleSuccess} isLoading={isSubmitting} />
          </CardBody>

          <CardFooter className="justify-center text-sm text-[color:var(--text-muted)]">
            Already have an account?{' '}
            <Link to={Routes.LOGIN} className="font-semibold text-primary-500 hover:underline">
              Log in
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
