import { WorkspaceAdd } from './types';

export const createWorkspace = async (workspace: WorkspaceAdd) => {
  try {
    const res = await fetch(`/api/workspaces`, {
      method: 'POST',
      body: JSON.stringify(workspace),
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
  } catch (error) {
    throw new Error(error);
  }
};
