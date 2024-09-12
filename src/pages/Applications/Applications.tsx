import React from 'react';

import { GiTapir } from 'react-icons/gi';
import { SiCss3 } from 'react-icons/si';

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
  return (
    <div className="applications-container">
      <p className="header">Quick Access</p>
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
