import { membersPlaceholder } from './placeholder';
import { Member } from './types';

export const getMembers = async (workspaceName: string) => {
  try {
    let members: Member[];
    if (import.meta.env.VITE_WORKSPACE_LOCAL) {
      members = membersPlaceholder;
    } else {
      const res = await fetch(`/api/workspaces/${workspaceName}/users`);
      members = await res.json();
    }

    return members;
  } catch (error) {
    throw new Error(error);
  }
};

export const addMember = async (workspaceName: string, memberUsername: string) => {
  try {
    const res = await fetch(`/api/workspaces/${workspaceName}/users/${memberUsername}`, {
      method: 'PUT',
    });
    if (!res.ok) {
      throw new Error();
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteMember = async (workspaceName: string, memberUsername: string) => {
  try {
    const res = await fetch(`/api/workspaces/${workspaceName}/users/${memberUsername}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error();
    }
  } catch (error) {
    throw new Error(error);
  }
};
