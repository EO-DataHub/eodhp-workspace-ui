import './App.scss';
import 'react-tabs/style/react-tabs.css';

import { useState } from 'react';

import { TopBar } from '@/components/TopBar/TopBar';

import { WorkspaceMenu } from './components/WorkspaceMenu/WorkspaceMenu';
import { WorkspaceSelection } from './components/WorkspaceSelection/WorkspaceSelection';

export const App = () => {
  const [content, setContent] = useState<React.ReactNode>();
  return (
    <div className="workspace">
      <div className="page-view">
        <TopBar />

        <div className="content">
          <WorkspaceSelection />
          <WorkspaceMenu setContent={setContent} />
          <div className="workspace-content content-border">{content}</div>
        </div>
      </div>
    </div>
  );
};
