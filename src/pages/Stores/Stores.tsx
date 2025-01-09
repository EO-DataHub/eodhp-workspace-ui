import './Stores.scss';
import { useState } from 'react';

import { CiCloudOn } from 'react-icons/ci';
import { FiBox } from 'react-icons/fi';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import storesDemo from '@/assets/stores-demo.png';

export const Stores = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="content-page stores">
      <div className="header">
        <div className="header-left">
          <h2>Stores</h2>
        </div>
        <div className="header-right">
          <img alt="Cloud" src="./icons/cloud.svg" />
          <div className="header-right-text">
            <span className="header-right-title">Object stores</span> are used to store data and
            files. You can create multiple object stores and use them to store data and files.
          </div>
        </div>
      </div>

      <Tabs
        className="tabs"
        selectedIndex={activeTab}
        selectedTabClassName="active"
        onSelect={(index) => setActiveTab(index)}
      >
        <TabList className="tab-list">
          <Tab className="tab">
            <CiCloudOn />
            Object Store
          </Tab>
          <Tab className="tab">
            <FiBox />
            Block Store
          </Tab>
        </TabList>

        <TabPanel>
          <div className="tab-content">
            <img alt="Stores" className="stores-demo" src={storesDemo} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="tab-content">
            <p>
              Block stores are used to store data in blocks. You can create multiple block stores
              and use them to store data in blocks.
            </p>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
