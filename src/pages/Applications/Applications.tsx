import React from 'react';

import { GiTapir } from 'react-icons/gi';
import { SiCss3 } from 'react-icons/si';

import { useWorkspace } from '@/hooks/useWorkspace';

import Application from './components/Application';

import './Applications.scss';

const PLACEHOLDER_APPLICATIONS = [
  {
    name: 'DataHub API',
    description: 'DataHub API',
    icon: GiTapir,
  },
  {
    name: 'S3',
    description: 'S3 Access',
    icon: SiCss3,
  },
];

const Applications: React.FC = () => {
  const { workspaceName } = useWorkspace();

  return (
    <div className="applications-container">
      <p className="header">Applications for {workspaceName}</p>
      <div className="grid">
        {PLACEHOLDER_APPLICATIONS.map((application) => (
          <Application
            key={application.name}
            description={application.description}
            icon={application.icon}
            name={application.name}
          />
        ))}
      </div>
    </div>
  );
};

export default Applications;
