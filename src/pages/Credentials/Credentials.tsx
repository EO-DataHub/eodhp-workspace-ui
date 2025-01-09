import { useState } from 'react';

import { SiAmazons3 } from 'react-icons/si';
import { TbApi } from 'react-icons/tb';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import cloudIcon from '@/assets/icons/cloud.svg';

import { DataHub } from '../DataHub/DataHub';
import { S3 } from '../S3/S3';

import './Credentials.scss';

export const Credentials = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="content-page credentials">
      <div className="header">
        <div className="header-left">
          <h2>Credentials</h2>
        </div>
        <div className="header-right">
          <img alt="Cloud" src={cloudIcon} />
          <div className="header-right-text">
            <span className="header-right-title">Credentials </span> are used as a way to
            authenticate with external services.
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
            <TbApi />
            DataHub API Key
          </Tab>
          <Tab className="tab">
            <SiAmazons3 />
            S3 Token
          </Tab>
        </TabList>

        <TabPanel>
          <div className="tab-content">
            <DataHub />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="tab-content">
            <S3 />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
