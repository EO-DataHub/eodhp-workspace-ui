import './ProfileTile.scss';

type ProfileTileProps = {
  username: string;
  avatar?: string;
  color?: string;
  borderColor?: string;
  onClick?: () => void;
};

export const ProfileTile = ({
  username,
  avatar,
  color,
  borderColor,
  onClick,
}: ProfileTileProps) => {
  const getInitials = (fullName: string): string => {
    const [firstName = '', lastName = ''] = fullName.split(' ');
    if (!lastName) {
      return fullName.slice(0, 2).toUpperCase();
    }
    return (firstName[0] + lastName[0]).toUpperCase();
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="profile-tile"
      style={{
        backgroundColor: color,
        borderColor: borderColor || 'none',
        border: borderColor ? undefined : 'none',
      }}
      onClick={onClick}
    >
      {avatar ? <img alt={username} src={avatar} /> : null}
      <span>{getInitials(username)}</span>
    </div>
  );
};
