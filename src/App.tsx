import './App.scss';
import 'react-tabs/style/react-tabs.css';

import { TopBar } from '@/components/TopBar/TopBar';

export const App = () => {
  return (
    <div className="workspace">
      <div className="page-view">
        <TopBar />

        <div className="content">
          <div className="workspace-selection"></div>
          <div className="workspace-menu"></div>
          <div className="workspace-content"></div>
        </div>
      </div>
    </div>
  );
};
