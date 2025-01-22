/* eslint-disable react-hooks/exhaustive-deps */
import './TopBar.scss';
import { useEffect, useState } from 'react';

import { useWorkspace } from '@/hooks/useWorkspace';

import MemberButtons from './components/MemberButtons/MemberButtons';
import { WorkspaceMembers } from './components/WorkspaceMembers/WorkspaceMembers';
import { Button } from '../Button/Button';
import { ProfileTile } from '../ProfileTile/ProfileTile';

export const TopBar = () => {
  const { activeWorkspace, isWorkspaceOwner, members } = useWorkspace();
  const [isLightTheme, setIsLightTheme] = useState(true);

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

  const renderMemberButtons = () => {
    if (!isWorkspaceOwner) return null;
    return <MemberButtons />;
  };

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
            <h2>{activeWorkspace.name} Workspace</h2>
          </div>
        )}

        <div className="top-bar__right">
          {renderMemberButtons()}
          {members && <WorkspaceMembers members={members} />}
        </div>
      </div>
    </div>
  );
};
