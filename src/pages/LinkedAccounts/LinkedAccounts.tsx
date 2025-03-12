import React, { useState } from 'react';
import './styles.scss';

import link from '@/assets/icons/link.svg';
import { Button } from '@/components/Button/Button';

type LinkableAccount = {
  internalName: string;
  externalName: string;
};

const linkableAccounts: LinkableAccount[] = [
  {
    internalName: 'airbus',
    externalName: 'Airbus',
  },

  {
    internalName: 'planet',
    externalName: 'Planet',
  },
];

const LinkedAccounts = () => {
  const [keys, setKeys] = useState<{ [key: string]: string }>(() => {
    const initial = {};
    linkableAccounts.forEach((account) => {
      initial[account.internalName] = '';
    });
    return initial;
  });

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

  const validate = (link: string) => {
    const key = keys[link];
    if (!key) {
      return;
    }
  };

  const renderAccount = (account: LinkableAccount) => {
    return (
      <div className="linked-accounts__account">
        <div className="linked-accounts__account-header">
          {account.externalName} <span>| lorem ipsum</span>
        </div>
        <div className="linked-accounts__account-input">
          <input
            placeholder="Enter your contact / api key"
            value={keys[account.internalName]}
            onChange={(e) => {
              const copy = { ...keys };
              copy[account.internalName] = e.target.value;
              setKeys(copy);
            }}
          />
          <span>Message</span>
        </div>
        <Button
          disabled={!keys[account.internalName]}
          onClick={() => validate(account.internalName)}
        >
          Link Account
        </Button>
      </div>
    );
  };

  return (
    <div className="content-page">
      {renderHeader()}
      <div className="linked-accounts">
        {linkableAccounts.map((account) => renderAccount(account))}
      </div>
    </div>
  );
};

export default LinkedAccounts;
