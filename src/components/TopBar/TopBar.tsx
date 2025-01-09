import './TopBar.scss';
import { useEffect, useState } from 'react';

import { IoMdPersonAdd } from 'react-icons/io';
import { MdPersonRemove } from 'react-icons/md';

import { WorkspaceMembers } from './components/WorkspaceMembers/WorkspaceMembers';
import { Button } from '../Button/Button';
import { ProfileTile } from '../ProfileTile/ProfileTile';

export const TopBar = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const workspace = document.getElementById('workspace');
    if (workspace) {
      workspace.classList.toggle('light-theme', isLightTheme);
    }
  }, [isLightTheme]);

  const users = [
    { id: 1, name: 'Peter Newton' },
    { id: 2, name: 'Alice Nguyen' },
    { id: 3, name: 'Paul Nasser' },
    { id: 4, name: 'Anil Kapoor' },
    { id: 5, name: 'Phil Murray' },
    { id: 6, name: 'Bobby Fischer' },
    { id: 7, name: 'Carla Rossi' },
    { id: 8, name: 'Diane Chang' },
    { id: 9, name: 'Evelyn Wood' },
    { id: 10, name: 'Frank Black' },
  ];

  return (
    <div>
      <div className="theme-switcher">
        <Button className="theme-switcher__button" onClick={() => setIsLightTheme(!isLightTheme)}>
          Set theme to {isLightTheme ? 'dark' : 'light'}
        </Button>
      </div>
      <div className="top-bar">
        <div className="top-bar__left">
          <ProfileTile borderColor="#a19d9d" color="#4c72ba" username="EO" />
          <h2>EODH Workspace</h2>
        </div>

        <div className="top-bar__right">
          <Button icon={<IoMdPersonAdd />} onClick={() => console.log('Add member clicked')}>
            Add Member
          </Button>
          <Button icon={<MdPersonRemove />} onClick={() => console.log('Remove member clicked')}>
            Remove Member
          </Button>
          <WorkspaceMembers users={users} />
        </div>
      </div>
    </div>
  );
};
