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

export const addMember = async (workspaceName: string, member: Member) => {
  try {
    await fetch(`/api/workspaces/${workspaceName}/users/${member.id}`, {
      method: 'PUT',
      body: JSON.stringify(member),
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteMember = async (workspaceName: string, memberId: string) => {
  try {
    await fetch(`/api/workspaces/${workspaceName}/users/${memberId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error);
  }
};
