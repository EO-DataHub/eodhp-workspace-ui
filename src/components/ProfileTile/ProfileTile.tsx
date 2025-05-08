import ReactDOM from 'react-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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

  const getAssociatedColor = (inputString: string) => {
    const letters = '0123456789ABCDEF';
    let colorVal = '#';
    for (let i = 0; i < 6; i++) {
      const charCode = inputString.charCodeAt(i % inputString.length);
      colorVal += letters[charCode % 16];
    }
    return colorVal;
  };

  const id = Math.random().toString(36).substring(7);

  const tooltipPortal =
    typeof document !== 'undefined'
      ? ReactDOM.createPortal(
          <Tooltip
            className="profile-tile-tooltip"
            id={`full-name-${username}-${id}`}
            place="top"
            style={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}
          />,
          document.body,
        )
      : null;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="profile-tile"
        data-tooltip-content={username}
        data-tooltip-id={`full-name-${username}-${id}`}
        style={{
          backgroundColor: color || getAssociatedColor(username),
          borderColor: borderColor || 'none',
          border: borderColor ? undefined : 'none',
        }}
        onClick={onClick}
      >
        {avatar ? <img alt={username} src={avatar} /> : null}
        <span>{getInitials(username)}</span>
      </div>
      {tooltipPortal}
    </>
  );
};
