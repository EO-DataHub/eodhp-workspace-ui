import { ProfileTile } from '@/components/ProfileTile/ProfileTile';
import './WorkspaceMembers.scss';

interface User {
  id: string | number;
  name: string;
  color?: string;
}

interface WorkspaceMembersProps {
  users: User[];
  maxVisible?: number;
}

export const WorkspaceMembers = ({ users, maxVisible = 5 }: WorkspaceMembersProps) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className="workspace-members">
      <div className="workspace-members__tiles">
        {visibleUsers.map((user) => (
          <ProfileTile key={user.id} color={user.color} username={user.name} />
        ))}

        {remainingCount > 0 && (
          <ProfileTile key="more" color={'gray'} username={`+${remainingCount}`} />
        )}
      </div>
      <span className="workspace-members__view-all">
        View all
        <span className="workspace-members__view-all__count"> {users.length} members</span>
      </span>
    </div>
  );
};
