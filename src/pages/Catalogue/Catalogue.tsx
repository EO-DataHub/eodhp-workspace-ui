import { useEffect, useState } from 'react';

import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { useWorkspace } from '@/hooks/useWorkspace';

type CatalogueProps = {
  defaultActiveTab?: number;
};

const tabToContent = {
  0: 'Datasets',
  1: 'Notebooks',
  2: 'Workflows',
};

export const Catalogue = ({ defaultActiveTab = 0 }: CatalogueProps) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const { setSelectedItemPath } = useWorkspace();

  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  useEffect(() => {
    setSelectedItemPath(['Catalogue', tabToContent[activeTab]]);
  }, [activeTab, setSelectedItemPath]);

  return (
    <div className="content-page catalogue">
      <div className="header">
        <div className="header-left">
          <h2>EODH Saved Catalogue</h2>
        </div>
      </div>
      <Tabs
        className="tabs"
        selectedIndex={activeTab}
        selectedTabClassName="active"
        onSelect={(index) => setActiveTab(index)}
      >
        <TabList className="tab-list">
          <Tab className="tab">{tabToContent[0]}</Tab>
          <Tab className="tab">{tabToContent[1]}</Tab>
          <Tab className="tab">{tabToContent[2]}</Tab>
        </TabList>

        <TabPanel>
          <div className="tab-content">
            <p className="tab-content__note">
              We have not yet implemented the saved datasets functionality. Please check back later.
            </p>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="tab-content">
            <p className="tab-content__note">
              We have not yet implemented the notebooks functionality. Please check back later.
            </p>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="tab-content">
            <p className="tab-content__note">
              We have not yet implemented the workflows functionality. Please check back later.
            </p>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
