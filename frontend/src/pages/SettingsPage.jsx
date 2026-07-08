import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/user.service';
import { Card } from '../components/ui/Shared';
import Button from '../components/ui/Button';

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-primary-600' : 'bg-surface-border'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications ?? true,
    pushNotifications: user?.settings?.pushNotifications ?? true,
  });
  const [saving, setSaving] = useState(false);

  const updateSetting = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    setSaving(true);
    try {
      await userService.updateSettings(updated);
    } catch {
      toast.error('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? This cannot be undone easily.')) return;
    await userService.deactivateAccount();
    await logout();
    toast.success('Account deactivated.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">Settings</h1>

      <Card>
        <h2 className="font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-xs text-gray-500">Toggle the app's color theme</p>
          </div>
          <Toggle checked={darkMode} onChange={toggleTheme} />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-gray-500">Interview reminders and achievement alerts</p>
            </div>
            <Toggle checked={settings.emailNotifications} onChange={(v) => updateSetting('emailNotifications', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-gray-500">Daily challenge and streak alerts</p>
            </div>
            <Toggle checked={settings.pushNotifications} onChange={(v) => updateSetting('pushNotifications', v)} />
          </div>
        </div>
        {saving && <p className="text-xs text-gray-500 mt-3">Saving...</p>}
      </Card>

      <Card className="border-rose-500/30">
        <h2 className="font-semibold mb-2 text-rose-400">Danger Zone</h2>
        <p className="text-sm text-gray-400 mb-4">Deactivating your account will hide your data and log you out.</p>
        <Button variant="danger" onClick={handleDeactivate}>Deactivate Account</Button>
      </Card>
    </div>
  );
};

export default SettingsPage;
