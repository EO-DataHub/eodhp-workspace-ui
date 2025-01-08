import './App.scss';
import 'react-tabs/style/react-tabs.css';

import { TopBar } from '@/components/TopBar/TopBar';

export const App = () => {
  return (
    <div className="workspace">
      <div className="content">
        <TopBar />
      </div>
    </div>
  );
};
