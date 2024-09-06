import { SidebarItem } from './components/SidebarItem';
import './styles.scss';

const USERS_WORKSPACES = [
  {
    title: 'My Personal Project',
  },
  {
    title: 'Crop Monitoring',
  },
];

const SIDEBAR_OPTIONS = [
  {
    title: 'Credentials',
    link: '/credentials',
  },
  {
    title: 'Workspaces',
    link: '/workspaces',
  },
];

type Sidebar = {
  activeContent: string;
  setActiveContent: (content: string) => void;
};

export const Sidebar = ({ activeContent, setActiveContent }: Sidebar) => {
  return (
    <div className="workspace__sidebar">
      <h2>My Workspace</h2>

      {USERS_WORKSPACES.map((workspace) => (
        <div key={workspace.title} className="workspace__sidebar-group">
          <h3>{workspace.title}</h3>
          {SIDEBAR_OPTIONS.map((option) => (
            <SidebarItem
              key={option.title}
              activeContent={activeContent}
              setActiveContent={setActiveContent}
              title={option.title}
              workspaceProject={workspace.title}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
