import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiCamera, FiUpload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import { resumeService } from '../services/misc.service';
import Avatar from '../components/ui/Avatar';
import { Card } from '../components/ui/Shared';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const { user, updateUserLocal } = useAuth();
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      name: user?.name || '',
      targetRole: user?.targetRole || '',
      experience: user?.experience || 'fresher',
      skills: (user?.skills || []).join(', '),
      bio: user?.bio || '',
      'socialLinks.linkedin': user?.socialLinks?.linkedin || '',
      'socialLinks.github': user?.socialLinks?.github || '',
      'socialLinks.portfolio': user?.socialLinks?.portfolio || '',
    },
  });

  const passwordForm = useForm();

  const onAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const { data } = await userService.updateAvatar(file);
      updateUserLocal(data.data.user);
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const onResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeLoading(true);
    try {
      await resumeService.upload(file);
      toast.success('Resume uploaded and parsed! Future interviews can now use it.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setResumeLoading(false);
    }
  };

  const onProfileSubmit = async (values) => {
    setSavingProfile(true);
    try {
      const payload = {
        name: values.name,
        targetRole: values.targetRole,
        experience: values.experience,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
        bio: values.bio,
        socialLinks: {
          linkedin: values['socialLinks.linkedin'],
          github: values['socialLinks.github'],
          portfolio: values['socialLinks.portfolio'],
        },
      };
      const { data } = await userService.updateProfile(payload);
      updateUserLocal(data.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (values) => {
    setSavingPassword(true);
    try {
      await authService.changePassword(values.currentPassword, values.newPassword);
      toast.success('Password changed!');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">My Profile</h1>

      <Card className="flex items-center gap-6">
        <div className="relative">
          <Avatar user={user} size="xl" />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white"
            disabled={avatarLoading}
          >
            <FiCamera className="text-sm" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onAvatarChange} />
        </div>
        <div>
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <button
            onClick={() => resumeInputRef.current.click()}
            className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1.5"
            disabled={resumeLoading}
          >
            <FiUpload /> {resumeLoading ? 'Uploading...' : 'Upload Resume (PDF)'}
          </button>
          <input ref={resumeInputRef} type="file" accept="application/pdf" hidden onChange={onResumeUpload} />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Profile Details</h2>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" {...profileForm.register('name')} />
            <Input label="Target Role" placeholder="e.g. Backend Engineer" {...profileForm.register('targetRole')} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Experience</label>
              <select {...profileForm.register('experience')} className="input-field">
                <option value="fresher">Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-8">5-8 years</option>
                <option value="8+">8+ years</option>
              </select>
            </div>
            <Input label="Skills (comma-separated)" {...profileForm.register('skills')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
            <textarea className="input-field min-h-[100px]" maxLength={500} {...profileForm.register('bio')} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="LinkedIn" {...profileForm.register('socialLinks.linkedin')} />
            <Input label="GitHub" {...profileForm.register('socialLinks.github')} />
            <Input label="Portfolio" {...profileForm.register('socialLinks.portfolio')} />
          </div>
          <Button type="submit" loading={savingProfile}>Save Changes</Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Change Password</h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <Input label="Current Password" type="password" {...passwordForm.register('currentPassword', { required: true })} />
          <Input label="New Password" type="password" {...passwordForm.register('newPassword', { required: true, minLength: 8 })} />
          <Button type="submit" loading={savingPassword} variant="secondary">Update Password</Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
