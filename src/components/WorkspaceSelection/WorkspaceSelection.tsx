import { MdAddCircleOutline } from 'react-icons/md';

import { useWorkspace } from '@/hooks/useWorkspace';

import { ProfileTile } from '../ProfileTile/ProfileTile';

import './WorkspaceSelection.scss';

export const WorkspaceSelection = () => {
  const { availableWorkspaces } = useWorkspace();

  return (
    <div className="workspace-selection content-border">
      <p className="workspace-selection__title">Other Workspaces</p>
      <div className="workspace-selection__tiles">
        {availableWorkspaces.map((workspace) => (
          <ProfileTile key={workspace} username={workspace} />
        ))}
        <MdAddCircleOutline className="workspace-selection__add icon-primary" />
      </div>
    </div>
  );
};
