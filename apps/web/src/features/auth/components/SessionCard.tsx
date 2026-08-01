import { Card } from '@shared/components/ui/Card';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import { formatDate } from '@careerhub/shared';
import type { UserSession } from '@careerhub/shared';

interface SessionCardProps {
  session: UserSession;
  onRevoke: (sessionId: string) => void;
  isRevoking?: boolean;
}

export function SessionCard({ session, onRevoke, isRevoking = false }: SessionCardProps) {
  const getDeviceIcon = () => {
    switch (session.deviceInfo.type) {
      case 'mobile':
        return '📱';
      case 'tablet':
        return '📲';
      default:
        return '💻';
    }
  };

  return (
    <Card variant="bordered" padding="sm" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-xl shrink-0">
          {getDeviceIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-[color:var(--text-primary)]">
              {session.deviceInfo.browser} on {session.deviceInfo.os}
            </h4>
            {session.isCurrentSession && (
              <Badge variant="success" size="sm" dot>
                Current Session
              </Badge>
            )}
          </div>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
            IP: {session.ipAddress} • Last active: {formatDate(session.lastSeenAt)}
          </p>
        </div>
      </div>

      {!session.isCurrentSession && (
        <Button
          variant="outline"
          size="xs"
          isLoading={isRevoking}
          onClick={() => onRevoke(session.id)}
          className="self-end sm:self-auto border-error-500 text-error-500 hover:bg-error-500 hover:text-white"
        >
          Revoke
        </Button>
      )}
    </Card>
  );
}
