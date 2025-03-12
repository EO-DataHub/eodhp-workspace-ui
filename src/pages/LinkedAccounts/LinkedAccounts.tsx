import React from 'react';
import './styles.scss';

import link from '@/assets/icons/link.svg';
import { Button } from '@/components/Button/Button';
import StringField from '@/components/Form/Fields/StringField/StringField';

const LinkedAccounts = () => {
  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Linked accounts</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={link} />
          <div className="header-right-text">
            <span className="header-right-title">Linked accounts</span> is dedicated to managing the
            members associated to this workspace.
          </div>
        </div>
      </div>
    );
  };

  const renderPlanet = () => {
    return (
      <div className="linked-accounts__account">
        <div className="linked-accounts__account-header">
          Planet <span>| lorem ipsum</span>
        </div>
        <div className="linked-accounts__account-input">
          <input placeholder="Enter your contact / api key" />
          <span>Message</span>
        </div>
        <Button onClick={() => console.log('Clicked')}>Link Account</Button>
      </div>
    );
  };

  const renderAirbus = () => {
    return (
      <div className="linked-accounts__account">
        <div className="linked-accounts__account-header">
          Airbus <span>| lorem ipsum</span>
        </div>
        <div className="linked-accounts__account-input">
          <input placeholder="Enter your contact / api key" />
          <span>Message</span>
        </div>
        <Button onClick={() => console.log('Clicked')}>Link Account</Button>
      </div>
    );
  };

  return (
    <div className="content-page">
      {renderHeader()}
      <div className="linked-accounts">
        {renderPlanet()}
        {renderAirbus()}
      </div>
    </div>
  );
};

export default LinkedAccounts;
