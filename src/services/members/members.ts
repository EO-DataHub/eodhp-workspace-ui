import { Member } from './types';

export const getMembers = async (workspaceId: string) => {
  const res = await fetch(`/api/workspaces/${workspaceId}/users`);
  const members: Member[] = await res.json();
  return members;
};

export const addMember = async (workspaceId: string, member: Member) => {
  const res = await fetch(`/api/workspaces/${workspaceId}/users/${member.id}`, {
    method: 'PUT',
    body: JSON.stringify(member),
  });
  const json = await res.json();
  return json;
};

export const deleteMember = async (workspaceId: string, memberId: string) => {
  const res = await fetch(`/api/workspaces/${workspaceId}/users/${memberId}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  return json;
};
