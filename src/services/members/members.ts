import { Member } from './types';

export const getMembers = async (workspaceName: string) => {
  const res = await fetch(`/api/workspaces/${workspaceName}/users`);
  const members: Member[] = await res.json();
  return members;
};

export const addMember = async (workspaceName: string, member: Member) => {
  await fetch(`/api/workspaces/${workspaceName}/users/${member.id}`, {
    method: 'PUT',
    body: JSON.stringify(member),
  });
};

export const deleteMember = async (workspaceName: string, memberId: string) => {
  await fetch(`/api/workspaces/${workspaceName}/users/${memberId}`, {
    method: 'DELETE',
  });
};
