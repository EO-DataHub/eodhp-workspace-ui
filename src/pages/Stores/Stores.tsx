import './Stores.scss';
import { useState } from 'react';

import { CiCloudOn } from 'react-icons/ci';
import { FiBox } from 'react-icons/fi';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import cloudIcon from '@/assets/icons/cloud.svg';
import { useWorkspace } from '@/hooks/useWorkspace';

import BlockStore from './components/BlockStore/BlockStore';

export const Stores = () => {
  const { activeWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState(0);

  const renderTabDescription = () => {
    const apphubLink = `${window.location.origin}/apphub`;
    const environment = window.location.hostname.split('.')[0];
    const storeEndpoint = `https://${activeWorkspace.name}.${environment}.eodatahub-workspaces.org.uk/files/workspaces/`;

    if (activeTab === 1) {
      return (
        <div className="header-right-text">
          <div>
            The <span className="header-right-title">Block Store</span> contains files associated
            with Jupyter notebooks. Your block store is a familiar disk-like store which can be
            accessed efficiently from notebooks. To browse the contents of these stores please use{' '}
            <a href={apphubLink} rel="noreferrer" target="_blank">
              Jupyter
            </a>.
          </div>
          <div>
            Additionally, you can view the block store associated with this workspace{' '}
            <a href={storeEndpoint} rel="noreferrer" target="_blank">
              here
            </a>.
            <p></p>
            AWS credentials can be generated on the <strong>Credentials</strong> tab and can be used
            with the AWS CLI or S3cmd. e.g. <code>aws s3 ls</code> or <code>s3cmd ls</code>.
          </div>
        </div>
      );
    } else {
      return (
        <div className="header-right-text">
          The <span className="header-right-title">Object Store</span> contains data associated with
          workflows and commercial data orders. Your object store uses AWS S3 - S3 can store a lot
          of data cheaply and can be accessed over the Internet with the S3 protocol.
          <p></p>
          AWS credentials can be generated on the <strong>Credentials</strong> tab and can be used
          with the AWS CLI or S3cmd. e.g. <code>aws s3 ls</code> or <code>s3cmd ls</code>.
        </div>
      );
    }
  };

  return (
    <div className="content-page stores">
      <div className="header">
        <div className="header-left">
          <h2>Workspace Storage</h2>
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
