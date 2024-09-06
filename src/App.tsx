import { useState } from 'react';

import { Content } from '@/components/Content';
import { Sidebar } from '@/components/Sidebar';
import { Credentials } from '@/pages/Credentials';
import './App.scss';

function App() {
  const [activeContent, setActiveContent] = useState('My Personal Project-Credentials');

  const renderContent = () => {
    // Temporary function to render content based on activeContent.
    // This will change and be moved to a card based approach for an active workspace.
    const [workspaceProject, workspaceArea] = activeContent.split('-');

    switch (workspaceArea) {
      case 'Credentials':
        return <Credentials workspaceProject={workspaceProject} />;
      case 'Workspaces':
        return <div>Workspaces</div>;
      default:
        return <div>Default</div>;
    }
  };

  return (
    <div className="workspace">
      <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
      <Content>{renderContent()}</Content>
    </div>
  );
}

export default App;
