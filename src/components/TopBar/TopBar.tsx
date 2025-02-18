import './TopBar.scss';

import { useEffect, useState } from 'react';

import { useWorkspace } from '@/hooks/useWorkspace';

import MemberButtons from './components/MemberButtons/MemberButtons';
import { WorkspaceMembers } from './components/WorkspaceMembers/WorkspaceMembers';
import Warning from '../../assets/icons/warning.svg';
import { Button } from '../Button/Button';
import { ProfileTile } from '../ProfileTile/ProfileTile';

export const TopBar = () => {
  const { activeWorkspace, isWorkspaceOwner, members, availableWorkspaces, accounts } =
    useWorkspace();
  const [isLightTheme, setIsLightTheme] = useState(false);

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
    if (!availableWorkspaces?.length) return null;
    return <MemberButtons />;
  };

  return (
    <div className="top-bar__container">
      <div className="disclaimer">
        {import.meta.env.VITE_WORKSPACE_LOCAL ? (
          <Button className="theme-switcher" onClick={() => setIsLightTheme(!isLightTheme)}>
            Set theme to {isLightTheme ? 'dark' : 'light'}
          </Button>
        ) : null}
      </div>
      <div className="top-bar">
        {activeWorkspace ? (
          <div className="top-bar__left">
            <ProfileTile borderColor="#a19d9d" color="#4c72ba" username={activeWorkspace.name} />
            <h2>{activeWorkspace.name} Workspace</h2>
          </div>
        ) : (
          <div className="top-bar__left">
            <ProfileTile borderColor="#a19d9d" color="#4c72ba" username={'EO'} />

            <h2>EODH Workspace Management</h2>
          </div>
        )}

        <div className="top-bar__right">
          {renderMemberButtons()}
          {members && <WorkspaceMembers members={members} />}
        </div>
      </div>
      {accounts?.length ? null : (
        <div className="top-bar__warning-container">
          <div className="top-bar__warning">
            <img alt={'Warning Icon'} src={Warning} />
            You currently have no billing accounts. Please request a billing account in order to
            create a workspace.
          </div>
        </div>
      )}
      {availableWorkspaces?.length ? null : (
        <div className="top-bar__warning-container">
          <div className="top-bar__warning">
            <img alt={'Warning Icon'} src={Warning} />
            You currently have no workspaces. Please create a new workspace to perform workspace
            management actions. Alternatively, someone can add you to their workspace using your
            username.
          </div>
        </div>
      )}
    </div>
  );
};
