import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useDarkMode } from '@shared/hooks/useDarkMode';
import { Card } from '@shared/components/ui/Card';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { useToast } from '@shared/components/ui/Toast';
import { Skeleton } from '@shared/components/ui/Skeleton';
import { EmptyState } from '@shared/components/ui/EmptyState';
import {
  useProfileDetails,
  useUpdateProfileDetails
} from '../hooks/useProfile';
import { profileApiService } from '../services/profile.service';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { theme, setTheme, isDark } = useDarkMode();
  const { success, error } = useToast();

  const { data: details, isLoading, error: detailsError, refetch } = useProfileDetails();
  const updateProfileMutation = useUpdateProfileDetails();

  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'danger'>('account');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Local form states
  const [phone, setPhone] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('en');

  // Load initial settings
  useState(() => {
    if (details && details.data) {
      setPhone(details.data.profile.phone || '');
      setTimezone(details.data.profile.timezone || 'UTC');
      setLanguage(details.data.profile.language || 'en');
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <Skeleton className="w-48 h-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="col-span-1 h-40" />
          <Skeleton className="col-span-3 h-96" />
        </div>
      </div>
    );
  }

  if (detailsError || !details || !details.data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <EmptyState
          title="Failed to Load Settings"
          description="We encountered an error loading your configuration options. Please refresh."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      </div>
    );
  }

  const { profile, notificationPreferences, user } = details.data;

  // Account Save Handler
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        phone,
        timezone,
        language
      });
    } catch {
      // Toast shown by mutation
    }
  };

  // Privacy Save Handler
  const handleTogglePrivacy = async (key: string, value: any) => {
    const updatedSettings = {
      ...profile.privacySettings,
      [key]: value
    };
    await updateProfileMutation.mutateAsync({
      privacySettings: updatedSettings
    });
  };

  // Notification Preference Save Handler
  const handleToggleNotifications = async (key: string, value: boolean) => {
    try {
      const updatedPrefs = {
        emailAlerts: key === 'emailAlerts' ? value : notificationPreferences?.emailAlerts ?? true,
        pushAlerts: key === 'pushAlerts' ? value : notificationPreferences?.pushAlerts ?? true,
        inAppAlerts: key === 'inAppAlerts' ? value : notificationPreferences?.inAppAlerts ?? true,
        enabledTypes: notificationPreferences?.enabledTypes || []
      };
      await updateProfileMutation.mutateAsync({
        notificationPreferences: updatedPrefs
      });
      success('Notification preferences saved');
      refetch();
    } catch (err: any) {
      error(err.message || 'Failed to update preferences');
    }
  };

  // Export Data Handler
  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const res = await profileApiService.exportData();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'careerhub_account_data_export.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      success('All profile data exported successfully');
    } catch {
      error('Failed to export account data');
    } finally {
      setIsExporting(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('WARNING: Are you absolutely sure you want to deactivate your CareerHub AI account? This will revoke all sessions and deactivate your search availability.');
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await profileApiService.deactivateAccount();
      success('Your account has been deactivated. Logging you out...');
      setTimeout(async () => {
        await logout();
        window.location.href = '/login';
      }, 1500);
    } catch {
      error('Failed to deactivate account');
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: 'account', label: '👤 Account Preferences', desc: 'Manage your timezone, language, and core details.' },
    { id: 'privacy', label: '🔒 Security & Privacy', desc: 'Configure profile visibility and search settings.' },
    { id: 'notifications', label: '🔔 Notifications', desc: 'Choose where and how you receive alerts.' },
    { id: 'danger', label: '⚠️ Danger Zone', desc: 'Export your records or delete your account.' }
  ] as const;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 space-y-6 text-left">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[color:var(--text-primary)]">
          Settings & Configurations
        </h1>
        <p className="text-sm text-[color:var(--text-muted)] font-medium">
          Customize your workspace, visibility, notifications, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="col-span-1 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl text-xs font-bold text-left transition-all flex flex-col gap-0.5 border ${activeTab === tab.id ? 'border-primary-500 bg-primary-500/5 text-primary-500 shadow-sm' : 'border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)]'}`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Account Panel */}
            {activeTab === 'account' && (
              <Card variant="bordered" padding="lg" className="space-y-6">
                <div className="border-b border-[color:var(--border-subtle)] pb-3">
                  <h3 className="text-lg font-bold text-[color:var(--text-primary)]">Account Preferences</h3>
                  <p className="text-xs text-[color:var(--text-muted)] font-medium">Update your phone number and localization parameters.</p>
                </div>

                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <Input
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Preferred Timezone</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                        <option value="IST">IST (Indian Standard Time)</option>
                        <option value="GMT">GMT (Greenwich Mean Time)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" isLoading={updateProfileMutation.isPending}>Save General Settings</Button>
                </form>

                <div className="border-t border-[color:var(--border-subtle)] pt-6 space-y-4">
                  <h4 className="text-sm font-bold text-[color:var(--text-primary)]">Theme & Appearance</h4>
                  <div className="flex items-center gap-2">
                    {['light', 'dark', 'system'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t as any)}
                        className={`px-4 py-2 border rounded-xl text-xs font-bold capitalize transition-all ${theme === t ? 'border-primary-500 bg-primary-500/10 text-primary-500' : 'border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)]'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[color:var(--border-subtle)] pt-6 space-y-3">
                  <h4 className="text-sm font-bold text-[color:var(--text-primary)]">Connected Oauth Accounts</h4>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌐</span>
                      <div>
                        <span className="font-bold text-[color:var(--text-primary)]">Google Integration</span>
                        <p className="text-[10px] text-[color:var(--text-muted)]">Enables single-click OAuth login.</p>
                      </div>
                    </div>
                    {user?.oauthProviders?.some((p: any) => p.provider === 'google') ? (
                      <span className="bg-success-500/10 text-success-500 font-bold border border-success-500/20 px-2 py-0.5 rounded-full">
                        Connected
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                        Unlinked
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Privacy Panel */}
            {activeTab === 'privacy' && (
              <Card variant="bordered" padding="lg" className="space-y-6">
                <div className="border-b border-[color:var(--border-subtle)] pb-3">
                  <h3 className="text-lg font-bold text-[color:var(--text-primary)]">Privacy & Search Settings</h3>
                  <p className="text-xs text-[color:var(--text-muted)] font-medium">Control who can search or view your profile details.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Profile Visibility</label>
                    <select
                      value={profile.privacySettings?.profileVisibility || 'public'}
                      onChange={(e) => handleTogglePrivacy('profileVisibility', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    >
                      <option value="public">Public (Visible to search engines & guests)</option>
                      <option value="connections">Connections Only (Restricted to logged-in hub network)</option>
                      <option value="private">Private (Only you & recruiters you apply to can view)</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-3">
                    <label className="flex items-start gap-3 cursor-pointer text-xs text-[color:var(--text-primary)] select-none">
                      <input
                        type="checkbox"
                        checked={profile.privacySettings?.searchVisibility ?? true}
                        onChange={(e) => handleTogglePrivacy('searchVisibility', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4.5 w-4.5 shrink-0 mt-0.5"
                      />
                      <div>
                        <span className="font-bold block">Recruiter Search Opt-In</span>
                        <span className="text-[10px] text-[color:var(--text-muted)]">Allow recruiters to discover your profile card in their candidate searches.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer text-xs text-[color:var(--text-primary)] select-none pt-2 border-t border-[color:var(--border-subtle)]/50">
                      <input
                        type="checkbox"
                        checked={profile.privacySettings?.emailVisibility ?? true}
                        onChange={(e) => handleTogglePrivacy('emailVisibility', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4.5 w-4.5 shrink-0 mt-0.5"
                      />
                      <div>
                        <span className="font-bold block">Display Email on Profile</span>
                        <span className="text-[10px] text-[color:var(--text-muted)]">Let network users see your contact email in your profile card.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer text-xs text-[color:var(--text-primary)] select-none pt-2 border-t border-[color:var(--border-subtle)]/50">
                      <input
                        type="checkbox"
                        checked={profile.privacySettings?.phoneVisibility ?? false}
                        onChange={(e) => handleTogglePrivacy('phoneVisibility', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4.5 w-4.5 shrink-0 mt-0.5"
                      />
                      <div>
                        <span className="font-bold block">Display Phone on Profile</span>
                        <span className="text-[10px] text-[color:var(--text-muted)]">Expose phone number publicly for recruiter outreach.</span>
                      </div>
                    </label>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Panel */}
            {activeTab === 'notifications' && (
              <Card variant="bordered" padding="lg" className="space-y-6">
                <div className="border-b border-[color:var(--border-subtle)] pb-3">
                  <h3 className="text-lg font-bold text-[color:var(--text-primary)]">Notification Preferences</h3>
                  <p className="text-xs text-[color:var(--text-muted)] font-medium">Select your communication preferences.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-[color:var(--text-primary)] select-none">
                    <input
                      type="checkbox"
                      checked={notificationPreferences?.emailAlerts ?? true}
                      onChange={(e) => handleToggleNotifications('emailAlerts', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4.5 w-4.5 shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-bold block">Email Alerts</span>
                      <span className="text-[10px] text-[color:var(--text-muted)]">Receive daily digest summaries, job alerts, and interview reminders on your email.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer text-xs text-[color:var(--text-primary)] select-none pt-3 border-t border-[color:var(--border-subtle)]/50">
                    <input
                      type="checkbox"
                      checked={notificationPreferences?.pushAlerts ?? true}
                      onChange={(e) => handleToggleNotifications('pushAlerts', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4.5 w-4.5 shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-bold block">Browser Push Notifications</span>
                      <span className="text-[10px] text-[color:var(--text-muted)]">Show push notifications on chat messages or recruiter notifications.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer text-xs text-[color:var(--text-primary)] select-none pt-3 border-t border-[color:var(--border-subtle)]/50">
                    <input
                      type="checkbox"
                      checked={notificationPreferences?.inAppAlerts ?? true}
                      onChange={(e) => handleToggleNotifications('inAppAlerts', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4.5 w-4.5 shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-bold block">In-App Notification Feed</span>
                      <span className="text-[10px] text-[color:var(--text-muted)]">Keep notifications enabled in the dashboard header bell feed.</span>
                    </div>
                  </label>
                </div>
              </Card>
            )}

            {/* Danger Zone Panel */}
            {activeTab === 'danger' && (
              <Card variant="bordered" padding="lg" className="space-y-6 border-error-500/20 bg-error-500/5">
                <div className="border-b border-error-500/20 pb-3">
                  <h3 className="text-lg font-bold text-error-700 dark:text-error-400">Danger Zone</h3>
                  <p className="text-xs text-[color:var(--text-muted)] font-medium">Irreversible security configurations.</p>
                </div>

                <div className="space-y-6 text-xs text-[color:var(--text-secondary)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-error-500/10 pb-4 last:border-b-0">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[color:var(--text-primary)] block">Export Personal Records</span>
                      <span className="text-[10px] text-[color:var(--text-muted)]">Download a complete JSON file containing your user data, profile, timeline records, certificates, and resumes.</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-bold bg-white text-slate-800 shrink-0"
                      onClick={handleExportData}
                      isLoading={isExporting}
                    >
                      📥 Export Profile Data
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-error-700 dark:text-error-400 block">Deactivate Account</span>
                      <span className="text-[10px] text-[color:var(--text-muted)]">Soft-delete your professional details, disable recruiter search availability, and invalidate your active sessions.</span>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      className="font-bold bg-error-600 hover:bg-error-700 text-white shrink-0"
                      onClick={handleDeleteAccount}
                      isLoading={isDeleting}
                    >
                      ⚠️ Deactivate Account
                    </Button>
                  </div>
                </div>
              </Card>
            )}

          </motion.div>
        </div>

      </div>
    </div>
  );
}
