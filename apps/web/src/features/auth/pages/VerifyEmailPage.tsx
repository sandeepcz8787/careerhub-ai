import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@shared/components/ui/Card';
import { Button } from '@shared/components/ui/Button';
import { OtpInput } from '../components/OtpInput';
import { useAuth } from '../hooks/useAuth';
import { maskEmail, OtpPurpose, Routes } from '@careerhub/shared';

const COOLDOWN_INITIAL = 60;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, pendingEmail } = useAuth();

  const email =
    (location.state as { email?: string })?.email ?? pendingEmail ?? 'your email';

  const [otpValue, setOtpValue] = useState('');
  const [cooldown, setCooldown] = useState(COOLDOWN_INITIAL);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) { return; }
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify ?? otpValue;
    if (code.length !== 6) {
      setServerError('Please enter the full 6-digit verification code.');
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError(null);
      await verifyOtp({ email, otp: code, purpose: OtpPurpose.EMAIL_VERIFICATION });
      navigate(Routes.DASHBOARD);
    } catch (err: unknown) {
      setServerError((err as { message?: string }).message ?? 'Verification failed. Please check the code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) { return; }

    try {
      setServerError(null);
      setSuccessMessage(null);
      await resendOtp(email, OtpPurpose.EMAIL_VERIFICATION);
      setSuccessMessage('A new 6-digit code has been sent to your email.');
      setCooldown(COOLDOWN_INITIAL);
    } catch (err: unknown) {
      setServerError((err as { message?: string }).message ?? 'Failed to resend code.');
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
              ✉️
            </div>
            <CardTitle className="text-2xl font-bold font-heading">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to{' '}
              <strong className="text-[color:var(--text-primary)] font-semibold">
                {email !== 'your email' ? maskEmail(email) : email}
              </strong>
            </CardDescription>
          </CardHeader>

          <CardBody className="text-center">
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

            <OtpInput
              onComplete={(code) => {
                setOtpValue(code);
                void handleVerify(code);
              }}
              disabled={isSubmitting}
              hasError={Boolean(serverError)}
            />

            <Button
              fullWidth
              size="lg"
              onClick={() => handleVerify()}
              isLoading={isSubmitting}
              disabled={otpValue.length !== 6}
              className="mt-4"
            >
              Verify Email
            </Button>

            <div className="mt-6 text-sm text-[color:var(--text-muted)]">
              Didn't receive the code?{' '}
              {cooldown > 0 ? (
                <span className="font-semibold text-primary-500">Resend in {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-primary-500 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </CardBody>

          <CardFooter className="justify-center text-xs text-[color:var(--text-muted)]">
            Wrong email address?{' '}
            <Link to={Routes.REGISTER} className="font-medium text-primary-500 hover:underline ml-1">
              Change email
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
