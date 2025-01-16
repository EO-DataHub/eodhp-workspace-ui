import { Member } from './types';

export const getMembers = async (workspaceId: string) => {
  const res = await fetch(`/api/workspace/${workspaceId}/users`);
  const members: Member[] = await res.json();
  return members;
};
