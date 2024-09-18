import React from 'react';

import { IconType } from 'react-icons';

import { useWorkspace } from '@/hooks/useWorkspace';

interface ApplicationProps {
  name: string;
  description: string;
  icon: IconType;
}

export const Application = ({ name, description, icon: Icon }: ApplicationProps) => {
  const { setActiveApplication } = useWorkspace();

  return (
    <button className="application-card" onClick={() => setActiveApplication(name)}>
      <div className="icon">
        <Icon />
      </div>
      <div className="app-details">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </button>
  );
};
