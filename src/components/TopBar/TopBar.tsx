import './TopBar.scss';
import { useEffect, useState } from 'react';

import { IoMdPersonAdd } from 'react-icons/io';
import { MdPersonRemove } from 'react-icons/md';

import { useWorkspace } from '@/hooks/useWorkspace';
import { getMembers } from '@/services/members/members';
import { placeholderMembers } from '@/services/members/placeholder';
import { Member } from '@/services/members/types';

import { WorkspaceMembers } from './components/WorkspaceMembers/WorkspaceMembers';
import { Button } from '../Button/Button';
import { ProfileTile } from '../ProfileTile/ProfileTile';

export const TopBar = () => {
  const { activeWorkspace } = useWorkspace();
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [members, setMembers] = useState<Member[]>();

  useEffect(() => {
    const workspace = document.getElementById('workspace');
    if (workspace) {
      if (workspace.classList.contains('light-theme') && !isLightTheme) {
        workspace.classList.remove('light-theme');
      }
      if (!workspace.classList.contains('light-theme') && isLightTheme) {
        workspace.classList.add('light-theme');
      }
    }
  }, [isLightTheme]);

  useEffect(() => {
    const func = async () => {
      try {
        const _members = await getMembers(activeWorkspace.id);
        setMembers(_members);
      } catch (error) {
        setMembers(placeholderMembers);
      }
    };
    func();
  }, [activeWorkspace]);

  return (
    <div>
      <div className="disclaimer">
        <p>The Workspace UI is still in development. Many features are not yet implemented.</p>
        <Button className="theme-switcher" onClick={() => setIsLightTheme(!isLightTheme)}>
          Set theme to {isLightTheme ? 'dark' : 'light'}
        </Button>
      </div>
      <div className="top-bar">
        {activeWorkspace && (
          <div className="top-bar__left">
            <ProfileTile borderColor="#a19d9d" color="#4c72ba" username={activeWorkspace.name} />
            <h2>EODH Workspace</h2>
          </div>
        )}

        <div className="top-bar__right">
          <Button icon={<IoMdPersonAdd />} onClick={() => console.log('Add member clicked')}>
            Add Member
          </Button>
          <Button icon={<MdPersonRemove />} onClick={() => console.log('Remove member clicked')}>
            Remove Member
          </Button>
          {members && <WorkspaceMembers members={members} />}
        </div>
      </div>
    </div>
  );
};
