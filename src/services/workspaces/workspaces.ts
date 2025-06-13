import { WorkspaceAdd } from './types';

export const createWorkspace = async (workspace: WorkspaceAdd) => {
  try {
    const res = await fetch(`/api/workspaces`, {
      method: 'POST',
      body: JSON.stringify(workspace),
    });
    if (!res.ok) {
      let message = 'Something went wrong';

      switch (res.status) {
        case 409:
          message =
            'A workspace with this name already exists. Please choose a different unique name.';
          break;
        case 500:
          message =
            'Server error. Try again later or alternatively email enquiries@eodatahub.org.uk and we will assist you.';
          break;
        default:
          message = `Unexpected error. Kindly email enquiries@eodatahub.org.uk to raise this issue.`;
      }

      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteWorkspace = async (workspaceName: string) => {
  try {
    const res = await fetch(`/api/workspaces/${workspaceName}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error();
    }
  } catch (error) {
    throw new Error(error);
  }
};
