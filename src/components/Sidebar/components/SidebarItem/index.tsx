type SidebarItemProps = {
  title: string;
  workspaceProject: string;
  activeContent: string;
  setActiveContent: (content: string) => void;
};

export const SidebarItem = ({
  title,
  workspaceProject,
  activeContent,
  setActiveContent,
}: SidebarItemProps) => {
  const handleClick = () => {
    setActiveContent(`${workspaceProject}-${title}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setActiveContent(`${workspaceProject}-${title}`);
    }
  };

  const isActive = activeContent === `${workspaceProject}-${title}`;

  return (
    <div
      className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {title}
    </div>
  );
};
