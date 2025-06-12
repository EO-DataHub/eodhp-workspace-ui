import './TopBar.scss';

import { useWorkspace } from '@/hooks/useWorkspace';

import MemberButtons from './components/MemberButtons/MemberButtons';
import Warning from '../../assets/icons/warning.svg';
import { ProfileTile } from '../ProfileTile/ProfileTile';

export const TopBar = () => {
  const { activeWorkspace, isWorkspaceOwner, availableWorkspaces, accounts } = useWorkspace();

  const renderMemberButtons = () => {
    if (!isWorkspaceOwner) return null;
    if (!availableWorkspaces?.length) return null;
    return <MemberButtons />;
  };

  return (
    <div className="top-bar__container">
      <div className="top-bar">
        {activeWorkspace ? (
          <div className="top-bar__left">
            <ProfileTile borderColor="#a19d9d" color="#4c72ba" username={activeWorkspace.name} />
            <h2>{activeWorkspace.name}</h2>
          </div>
        ) : (
          <div className="top-bar__left">
            <ProfileTile borderColor="#a19d9d" color="#4c72ba" username={'EO'} />

            <h2>EODH Workspace Management</h2>
          </div>
        )}

        <div className="top-bar__right">{renderMemberButtons()}</div>
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
