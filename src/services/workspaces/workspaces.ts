import { WorkspaceAdd } from './types';

export const createWorkspace = async (workspace: WorkspaceAdd) => {
  try {
    await fetch(`/api/workspaces`, {
      method: 'POST',
      body: JSON.stringify(workspace),
    });
  } catch (error) {
    throw new Error(error);
  }
};
