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
  const getInitials = (fullName: string): string => {
    const [firstName = '', lastName = ''] = fullName.split(' ');
    return (firstName[0] + lastName[0] || '').toUpperCase();
  };

  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className="workspace-members">
      <div className="workspace-members__tiles">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="workspace-members__tile"
            style={{ backgroundColor: user.color }}
          >
            {getInitials(user.name)}
          </div>
        ))}

        {remainingCount > 0 && (
          <div className="workspace-members__tile workspace-members__tile--more">
            +{remainingCount}
          </div>
        )}
      </div>
      <span className="workspace-members__view-all">
        View all
        <span className="workspace-members__view-all__count"> {users.length} members</span>
      </span>
    </div>
  );
};
