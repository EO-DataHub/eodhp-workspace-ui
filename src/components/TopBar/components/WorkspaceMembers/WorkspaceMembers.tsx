/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ProfileTile } from '@/components/ProfileTile/ProfileTile';
import './WorkspaceMembers.scss';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Member } from '@/services/members/types';

import { navItems } from '../../../WorkspaceMenu/navigation';

interface WorkspaceMembersProps {
  members: Member[];
  maxVisible?: number;
}

export const WorkspaceMembers = ({ members, maxVisible = 5 }: WorkspaceMembersProps) => {
  const { setSelectedItemPath, setContent } = useWorkspace();

  if (!members) return;
  if (!members.length) return;

  const visibleUsers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;

  return (
    <div className="workspace-members">
      <div className="workspace-members__tiles">
        {visibleUsers.map((user) => (
          <ProfileTile key={user.id} username={user.username} />
        ))}

        {remainingCount > 0 && (
          <ProfileTile key="more" color={'gray'} username={`+${remainingCount}`} />
        )}
      </div>
      <span
        className="workspace-members__view-all"
        onClick={() => {
          setSelectedItemPath(['Members']);
          setContent(navItems[0].content);
        }}
      >
        View all
        <span className="workspace-members__view-all__count"> {members.length} members</span>
      </span>
    </div>
  );
};
