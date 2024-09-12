import './App.scss';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import TopBar from './components/TopBar/TopBar';
import 'react-tabs/style/react-tabs.css';
import Applications from './pages/Applications/Applications';

const App = () => {
  return (
    <div className="workspace">
      <div className="content">
        <TopBar />

        <Tabs>
          <TabList>
            <Tab>Home</Tab>
            <Tab>Settings</Tab>
          </TabList>

          <TabPanel>
            <Applications />
          </TabPanel>
          <TabPanel>
            <h2>Settings</h2>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default App;
