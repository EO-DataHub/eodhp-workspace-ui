import Select from 'react-select';

import { useWorkspace } from '@/hooks/useWorkspace';
import './TopBar.scss';

export const TopBar = () => {
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
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary: '#2a3559',
              primary25: '#2a355930',
            },
          })}
          onChange={(selectedOption) => setActiveWorkspace(selectedOption?.value)}
        />
      </div>

      <div>
        <p className="heading">Your Workspace</p>
        <p className="date">
          {activeWorkspace} -{' '}
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
