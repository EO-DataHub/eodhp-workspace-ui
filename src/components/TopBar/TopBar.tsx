import './TopBar.scss';

import { useWorkspace } from '@/hooks/useWorkspace';

import MemberButtons from './components/MemberButtons/MemberButtons';
import Warning from '../../assets/icons/warning.svg';
import { WorkspaceSelection } from '../WorkspaceSelection/WorkspaceSelection';

export const TopBar = () => {
  const { isWorkspaceOwner, availableWorkspaces, accounts } = useWorkspace();

  const renderMemberButtons = () => {
    if (!isWorkspaceOwner) return null;
    if (!availableWorkspaces?.length) return null;
    return <MemberButtons />;
  };

  return (
    <div className="top-bar__container">
      <div className="top-bar">
        <div className="top-bar__left">
          <div className="top-bar__workspace-selection">
            <WorkspaceSelection />
          </div>
        </div>
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
