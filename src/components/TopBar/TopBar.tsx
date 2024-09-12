import Select from 'react-select';

import { useWorkspace } from '@/hooks/useWorkspace';
import './TopBar.scss';

const TopBar = () => {
  const { availableWorkspaces, activeWorkspace, setActiveWorkspace } = useWorkspace();

  return (
    <div className="top-bar">
      <div className="workspace-selection">
        <label className="workspace-label" htmlFor="workspace-select">
          Change Workspace
        </label>
        <Select
          className="workspace-select"
          defaultValue={{ value: activeWorkspace, label: activeWorkspace }}
          id="workspace-select"
          options={availableWorkspaces.map((workspace) => ({ value: workspace, label: workspace }))}
          onChange={(selectedOption) => setActiveWorkspace(selectedOption?.value)}
        />
      </div>

      <div className="greeting-section">
        <p className="greeting">Your Workspaces</p>
        <p className="date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default TopBar;
