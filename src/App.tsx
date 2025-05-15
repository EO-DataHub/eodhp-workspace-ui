import { useState } from 'react';

import { TopBar } from '@/components/TopBar/TopBar';

import { WorkspaceMenu } from './components/WorkspaceMenu/WorkspaceMenu';
import { WorkspaceSelection } from './components/WorkspaceSelection/WorkspaceSelection';
import './App.scss';
import 'react-tabs/style/react-tabs.css';
import { useWorkspace } from './hooks/useWorkspace';

export const App = () => {
  const { activeWorkspace, accounts } = useWorkspace();

  const [content, setContent] = useState<React.ReactNode>();
  return (
    <div
      className={`workspace ${import.meta.env.VITE_WORKSPACE_LOCAL ? 'light-theme' : ''}`}
      id="workspace"
    >
      <div className="page-view">
        <TopBar />

        <div className="content">
          <WorkspaceSelection />
          {activeWorkspace && accounts?.length ? <WorkspaceMenu setContent={setContent} /> : null}
          {activeWorkspace && accounts?.length ? (
            <div className="workspace-content content-border">{content}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
