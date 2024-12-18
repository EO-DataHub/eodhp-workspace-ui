import './App.scss';
import 'react-tabs/style/react-tabs.css';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { TopBar } from '@/components/TopBar/TopBar';
import { Applications } from '@/pages/Applications/Applications';

import Accounts from './pages/Accounts/Accounts';

export const App = () => {
  return (
    <div className="workspace">
      <div className="content">
        <TopBar />

        <Tabs>
          <TabList>
            <Tab>Applications</Tab>
            <Tab>Settings</Tab>
            <Tab>Manage Workspaces</Tab>
            <Tab>Manage Accounts</Tab>
          </TabList>

          <TabPanel>
            <Applications />
          </TabPanel>
          <TabPanel>
            <div className="not-implemented">
              <p>This page is not implemented yet.</p>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="not-implemented">
              <p>This page is not implemented yet.</p>
            </div>
          </TabPanel>
          <TabPanel>
            <Accounts />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};
