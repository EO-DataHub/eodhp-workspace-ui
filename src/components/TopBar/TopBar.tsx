/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import './TopBar.scss';
import { useEffect, useState } from 'react';

import { IoMdPersonAdd } from 'react-icons/io';
import { MdPersonRemove } from 'react-icons/md';

import { WorkspaceMembers } from './components/WorkspaceMembers/WorkspaceMembers';
import { Button } from '../Button/Button';

export const TopBar = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', isLightTheme);
  }, [isLightTheme]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const users = [
    { id: 1, name: 'Peter Newton', color: getRandomColor() },
    { id: 2, name: 'Alice Nguyen', color: getRandomColor() },
    { id: 3, name: 'Paul Nasser', color: getRandomColor() },
    { id: 4, name: 'Anil Kapoor', color: getRandomColor() },
    { id: 5, name: 'Phil Murray', color: getRandomColor() },
    { id: 6, name: 'Bobby Fischer', color: getRandomColor() },
    { id: 7, name: 'Carla Rossi', color: getRandomColor() },
    { id: 8, name: 'Diane Chang', color: getRandomColor() },
    { id: 9, name: 'Evelyn Wood', color: getRandomColor() },
    { id: 10, name: 'Frank Black', color: getRandomColor() },
  ];

  return (
    <div className="top-bar">
      <div className="top-bar__left">
        <span
          className="top-bar__left__profile-logo"
          onClick={() => setIsLightTheme(!isLightTheme)}
        >
          EO
        </span>
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
  );
};
