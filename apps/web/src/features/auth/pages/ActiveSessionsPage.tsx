import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '@shared/components/ui/Card';
import { Button } from '@shared/components/ui/Button';
import { SessionCard } from '../components/SessionCard';
import { Skeleton } from '@shared/components/ui/Skeleton';
import { authApiService } from '../services/auth.service';

export default function ActiveSessionsPage() {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: sessions, isLoading, isError } = useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: async () => {
      const response = await authApiService.getSessions();
      return response.data;
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => authApiService.deleteSession(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
    },
    onError: (err: unknown) => {
      setServerError((err as { message?: string }).message ?? 'Failed to revoke session.');
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => authApiService.logoutAll(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
    },
    onError: (err: unknown) => {
      setServerError((err as { message?: string }).message ?? 'Failed to revoke all sessions.');
    },
  });

  return (
    <div className="container-app py-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card variant="elevated" padding="lg">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold font-heading">Active Sessions</CardTitle>
              <CardDescription>
                Manage your active logins across desktop, mobile, and web browsers.
              </CardDescription>
            </div>
            {sessions && sessions.length > 1 && (
              <Button
                variant="danger"
                size="sm"
                isLoading={logoutAllMutation.isPending}
                onClick={() => logoutAllMutation.mutate()}
              >
                Logout All Other Devices
              </Button>
            )}
          </CardHeader>

          <CardBody className="mt-4 space-y-4">
            {serverError && (
              <div className="p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm font-medium">
                {serverError}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : isError ? (
              <p className="text-sm text-error-500">Failed to load active sessions.</p>
            ) : sessions?.length === 0 ? (
              <p className="text-sm text-[color:var(--text-muted)] text-center py-6">No active sessions found.</p>
            ) : (
              <div className="space-y-3">
                {sessions?.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onRevoke={(id) => revokeMutation.mutate(id)}
                    isRevoking={revokeMutation.isPending && revokeMutation.variables === session.id}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
