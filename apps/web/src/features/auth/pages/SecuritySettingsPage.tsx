import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '@shared/components/ui/Card';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { useAuth } from '../hooks/useAuth';
import { changePasswordSchema } from '@careerhub/shared';
import type { ChangePasswordInput } from '@careerhub/shared';

export default function SecuritySettingsPage() {
  const { changePassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      logoutOtherDevices: false,
    },
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      setSuccessMessage(null);
      const result = await changePassword(data);
      setSuccessMessage(result.message);
      reset();
    } catch (err: unknown) {
      setServerError((err as { message?: string }).message ?? 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-app py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-heading">Security & Password</CardTitle>
            <CardDescription>
              Update your account password and manage device authorization settings.
            </CardDescription>
          </CardHeader>

          <CardBody className="mt-4">
            {serverError && (
              <div className="mb-4 p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm font-medium">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-lg bg-success-500/10 border border-success-500/20 text-success-500 text-sm font-medium">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                errorText={errors.currentPassword?.message}
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
                {...register('currentPassword')}
              />

              <div className="space-y-1">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  errorText={errors.newPassword?.message}
                  isRequired
                  {...register('newPassword')}
                />
                <PasswordStrengthMeter password={newPasswordValue} />
              </div>

              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                errorText={errors.confirmNewPassword?.message}
                isRequired
                {...register('confirmNewPassword')}
              />

              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-[color:var(--text-secondary)] mt-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  {...register('logoutOtherDevices')}
                />
                Log out of all other devices after changing password
              </label>

              <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-4">
                Update Password
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
