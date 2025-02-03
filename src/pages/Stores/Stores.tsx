import './Stores.scss';
import { useState } from 'react';

import { CiCloudOn } from 'react-icons/ci';
import { FiBox } from 'react-icons/fi';
import { LuCopyPlus } from 'react-icons/lu';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import cloudIcon from '@/assets/icons/cloud.svg';
import { Button } from '@/components/Button/Button';
import { useWorkspace } from '@/hooks/useWorkspace';

import S3Browser from './components/S3Browser/S3Browser';

export const Stores = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { activeWorkspace } = useWorkspace();

  return (
    <div className="content-page stores">
      <div className="header">
        <div className="header-left">
          <h2>Stores</h2>
        </div>
        <div className="header-right">
          <img alt="Cloud" src={cloudIcon} />
          <div className="header-right-text">
            <span className="header-right-title">Object stores</span> are used to store data and
            files. You can create multiple object stores and use them to store data and files.
          </div>
          <div className="header-right-workspace-file-harvester">
            <Button
              onClick={() => {
                fetch(`/api/workspaces/${activeWorkspace.name}/harvest`, { method: 'POST' });
                alert('Harvesting started');
              }}>
              <LuCopyPlus />
            </Button>
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
            <p className="tab-content__note">
              We are still working on some of the backend components for the object store sessions,
              this may not work for everyone. <br />
              If you see an error saying &quot;Unexpected Token&quot;, then your account is not yet
              configured to use the browser-based object store.
              <br />
              If you would like to try out this functionality, please get in touch with us.
            </p>
            <S3Browser />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="tab-content">
            <p className="tab-content__note">
              We have not yet implemented the block store functionality. Please check back later.
            </p>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
