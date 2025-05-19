import { useWorkspace } from '@/hooks/useWorkspace';

import AddWorkspace from './AddWorkspace/AddWorkspace';
import { ProfileTile } from '../ProfileTile/ProfileTile';

import './WorkspaceSelection.scss';

export const WorkspaceSelection = () => {
  const { availableWorkspaces, selectWorkspace } = useWorkspace();

  return (
    <div className="workspace-selection content-border">
      <p className="workspace-selection__title">Select Workspace</p>
      <div className="workspace-selection__tiles">
        {availableWorkspaces?.map((workspace) => (
          <ProfileTile
            key={workspace.id}
            username={workspace.name}
            onClick={() => selectWorkspace(workspace)}
          />
        ))}
        <AddWorkspace />
      </div>
    </div>
  );
};
