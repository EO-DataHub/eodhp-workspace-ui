import { Theme } from '@radix-ui/themes';

import { TopBar } from '@/components/TopBar/TopBar';

import { WorkspaceMenu } from './components/WorkspaceMenu/WorkspaceMenu';
import { WorkspaceSelection } from './components/WorkspaceSelection/WorkspaceSelection';
import './App.scss';
import 'react-tabs/style/react-tabs.css';
import { useWorkspace } from './hooks/useWorkspace';

export const App = () => {
  const { activeWorkspace, content } = useWorkspace();

  return (
    <Theme accentColor="indigo" appearance="light" grayColor="gray" radius="large" scaling="100%">
      <div
        className={`workspace ${import.meta.env.VITE_WORKSPACE_LOCAL ? 'light-theme' : ''}`}
        id="workspace"
      >
        <div className="page-view">
          <TopBar />

          <div className="content">
            <WorkspaceSelection />
            {activeWorkspace ? <WorkspaceMenu /> : null}
            {activeWorkspace ? (
              <div className="workspace-content content-border">{content}</div>
            ) : null}
          </div>
        </div>
      </div>
    </Theme>
  );
};
