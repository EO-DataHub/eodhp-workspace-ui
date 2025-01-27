import { ProfileTile } from '@/components/ProfileTile/ProfileTile';
import './WorkspaceMembers.scss';
import { Member } from '@/services/members/types';

interface WorkspaceMembersProps {
  members: Member[];
  maxVisible?: number;
}

export const WorkspaceMembers = ({ members, maxVisible = 5 }: WorkspaceMembersProps) => {
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
      <span className="workspace-members__view-all">
        View all
        <span className="workspace-members__view-all__count"> {members.length} members</span>
      </span>
    </div>
  );
};
