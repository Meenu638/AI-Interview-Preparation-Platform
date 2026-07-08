import { getInitials, avatarColorFromString } from '../../utils/helpers';

const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-lg', xl: 'w-24 h-24 text-2xl' };

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  if (user?.avatar?.url) {
    return (
      <img
        src={user.avatar.url}
        alt={user.name}
        className={`${sizeClass} rounded-full object-cover border-2 border-surface-border ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white border-2 border-surface-border ${className}`}
      style={{ backgroundColor: avatarColorFromString(user?.name || 'U') }}
    >
      {getInitials(user?.name || 'U')}
    </div>
  );
};

export default Avatar;
