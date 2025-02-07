import './Stores.scss';
import { useState } from 'react';

import { CiCloudOn } from 'react-icons/ci';
import { FiBox } from 'react-icons/fi';
import { LuCopyPlus } from 'react-icons/lu';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import cloudIcon from '@/assets/icons/cloud.svg';
import { Button } from '@/components/Button/Button';
import { useWorkspace } from '@/hooks/useWorkspace';

import BlockStore from './components/BlockStore/BlockStore';

export const Stores = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { activeWorkspace } = useWorkspace();

  const renderTabDescription = () => {
    if (activeTab === 1) {
      return (
        <div className="header-right-text">
          <span className="header-right-title">Block stores</span> To browse the contents of these
          stores please use{' '}
          <a href="https://dev.eodatahub.org.uk/apphub" rel="noreferrer" target="_blank">
            Jupyter
          </a>
        </div>
      );
    } else {
      return (
        <div className="header-right-text">
          <span className="header-right-title">Object stores</span> are used to store data and
          files. You can create multiple object stores and use them to store data and files.
        </div>
      );
    }
  };

  return (
    <div className="content-page stores">
      <div className="header">
        <div className="header-left">
          <h2>Stores</h2>
        </div>
        <div className="header-right">
          <img alt="Cloud" src={cloudIcon} />
          {renderTabDescription()}
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
            <p className="tab-content__note">
              Use the credentials tab to create temporary S3 credentials to access your Object
              Store. <br />
              We are working on documentation to help you get started with the Object Store.
            </p>
          </div>
        </TabPanel>
        <TabPanel>
          <BlockStore />
        </TabPanel>
      </Tabs>
    </div>
  );
};
