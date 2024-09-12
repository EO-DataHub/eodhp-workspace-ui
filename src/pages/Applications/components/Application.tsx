import React from 'react';

import { IconType } from 'react-icons';

interface ApplicationProps {
  name: string;
  description: string;
  icon: IconType;
}

const Application: React.FC<ApplicationProps> = ({ name, description, icon: Icon }) => {
  return (
    <div className="application-card">
      <div className="icon">
        <Icon />
      </div>
      <div className="app-details">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Application;
