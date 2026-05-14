import { Select } from '@radix-ui/themes';

import { useWorkspace } from '@/hooks/useWorkspace';

import AddWorkspace from './AddWorkspace/AddWorkspace';

import './WorkspaceSelection.scss';

export const WorkspaceSelection = () => {
  const { availableWorkspaces, activeWorkspace, selectWorkspace } = useWorkspace();

  const handleWorkspaceChange = (workspaceId: string) => {
    const nextWorkspace = availableWorkspaces?.find((workspace) => workspace.id === workspaceId);
    if (nextWorkspace) {
      selectWorkspace(nextWorkspace);
    }
  };

  return (
    <div className="workspace-selection">
      <p id="workspace-select-label" className="workspace-selection__title">
        Select Workspace
      </p>
      <div className="workspace-selection__controls">
        <Select.Root value={activeWorkspace?.id} onValueChange={handleWorkspaceChange}>
          <Select.Trigger
            className="workspace-selection__trigger"
            aria-labelledby="workspace-select-label"
          >
            <Select.Value placeholder="Select a workspace" />
          </Select.Trigger>
          <Select.Content className="workspace-selection__content" position="popper">
            <Select.Group>
              {availableWorkspaces?.map((workspace) => (
                <Select.Item
                  key={workspace.id}
                  className="workspace-selection__item"
                  value={workspace.id}
                >
                  {workspace.name}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <AddWorkspace />
      </div>
    </div>
  );
};
