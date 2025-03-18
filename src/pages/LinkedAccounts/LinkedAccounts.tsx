import React, { useEffect, useState } from 'react';
import './styles.scss';

import link from '@/assets/icons/link.svg';
import { Button } from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Help from '@/components/Table/Components/Help/Help';
import { useWorkspace } from '@/hooks/useWorkspace';

type LinkableAccount = {
  internalName: string;
  externalName: string;
  docs: string;
};

type AccountMetaData = {
  value: string;
  linked: boolean;
  message: string;
  internalName: string;
  externalName: string;
  docs: string;
};

const linkableAccounts: LinkableAccount[] = [
  {
    internalName: 'airbus',
    externalName: 'Airbus',
    docs: 'Airbus Account Required for using Airbus data on the Hub. To access Airbus data, please request a OneAtlas account via the website. This account will need to be linked to the EODH, so that any data ordered is delivered to the EODH. To do this, please email a request to ukintelligence-imagerysupport@airbus.com. More information about linking an existing account can be found here.',
  },
  {
    internalName: 'planet',
    externalName: 'Planet',
    docs: "Planet Account Required for using Planet data on the Hub. If you don't currently have a Planet account with active data access and are exploring solutions with budget allocated, please contact us at eodatahub@planet.com to discuss access options. To help us tailor our recommendations, kindly include a brief description of your intended use of Planet's data and your specific area of interest. More information about linking an existing account can be found here.",
  },
];

const LinkedAccounts = () => {
  const { activeWorkspace, isWorkspaceOwner } = useWorkspace();

  const [error, setError] = useState('');
  const [data, setData] = useState<AccountMetaData[]>([]);
  const [running, setRunning] = useState<boolean>();
  const [modal, setModal] = useState<boolean>(false);
  const [accountToUnlink, setAccountToUnlink] = useState<AccountMetaData>();

  useEffect(() => {
    if (import.meta.env.VITE_WORKSPACE_LOCAL) {
      getPlaceHolderAccounts();
    } else {
      getAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspace]);

  const getAccounts = async () => {
    const res = await fetch(`/api/workspaces/${activeWorkspace.name}/linked-accounts`);
    if (!res.ok) {
      setError('Failed to get linked accounts');
      return;
    }
    const accounts: string[] = await res.json();
    const initial: AccountMetaData[] = [];
    linkableAccounts.forEach((account) => {
      initial.push({
        value: accounts.includes(account.internalName) ? 'the_user_will_never_see_this' : '',
        linked: accounts.includes(account.internalName) ? true : false,
        message: accounts.includes(account.internalName) ? 'Linked' : 'Not linked',
        internalName: account.internalName,
        externalName: account.externalName,
        docs: account.docs,
      });
    });
    setData(initial);
  };

  // Internal Dev only
  const getPlaceHolderAccounts = () => {
    const initial: AccountMetaData[] = [
      {
        value: 'the_user_will_never_see_this',
        linked: true,
        message: 'Linked',
        internalName: 'airbus',
        externalName: 'Airbus',
        docs: linkableAccounts[0].docs,
      },
      {
        value: '',
        linked: false,
        message: 'Not linked',
        internalName: 'planet',
        externalName: 'Planet',
        docs: linkableAccounts[1].docs,
      },
    ];
    setData(initial);
  };

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Linked accounts</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={link} />
          <div className="header-right-text">
            <span className="header-right-title">Linked accounts</span> allows you to store your
            provider API key in the Hub allowing you to order commercial data.
          </div>
        </div>
      </div>
    );
  };

  const updateData = (account: AccountMetaData, key: string, value: string | boolean) => {
    const copy = [...data];
    const index = copy.findIndex((a) => a.internalName === account.internalName);
    copy[index][key] = value;
    setData(copy);
  };

  const renderAccount = (account: AccountMetaData) => {
    return (
      <div className="linked-accounts__account">
        <div className="linked-accounts__account-header">
          {account.externalName} <span>| {account.message}</span>
          <Help content={account.docs} type="Modal" />
        </div>
        <div className="linked-accounts__account-input">
          <input
            disabled={account.linked}
            placeholder="Enter your API key"
            type={account.linked ? 'password' : 'text'}
            value={account.value}
            onChange={(e) => {
              updateData(account, 'value', e.target.value);
            }}
          />
        </div>
        {account.linked ? renderUnlinkButton(account) : renderLinkButton(account)}
      </div>
    );
  };

  const renderLinkButton = (account: AccountMetaData) => {
    return (
      <Button
        disabled={!isWorkspaceOwner || !account.value || running}
        onClick={() => linkAccount(account)}
      >
        Link Account
      </Button>
    );
  };

  const renderUnlinkButton = (account: AccountMetaData) => {
    return (
      <Button
        disabled={!isWorkspaceOwner || running}
        onClick={() => {
          setAccountToUnlink(account);
          setModal(true);
        }}
      >
        Unlink Account
      </Button>
    );
  };

  const linkAccount = async (account: AccountMetaData) => {
    try {
      setRunning(true);
      const body = {
        name: account.internalName,
        key: account.value.trim(),
      };
      const res = await fetch(`/api/workspaces/${activeWorkspace.name}/linked-accounts`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setError('Error linking account');
        return;
      }
      updateData(account, 'linked', true);
      await getAccounts();
    } catch (error) {
      setError(error);
    } finally {
      setRunning(false);
    }
  };

  const unlinkAccount = async (account: AccountMetaData) => {
    try {
      setRunning(true);
      const res = await fetch(
        `/api/workspaces/${activeWorkspace.name}/linked-accounts/${account.internalName}`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) {
        setError('Error linking account');
        return;
      }
      updateData(account, 'linked', true);
      await getAccounts();
    } catch (error) {
      setError(error);
    } finally {
      setRunning(false);
    }
  };

  const renderModalContent = () => {
    if (!accountToUnlink) return;
    return <div>Are you sure you want to unlink your {accountToUnlink.externalName} account?</div>;
  };

  if (!data.length) {
    return <div className="content-page">{error}</div>;
  }
  return (
    <>
      {modal && (
        <Modal
          content={renderModalContent()}
          onCancel={() => {
            setModal(false);
            setAccountToUnlink(null);
          }}
          onSubmit={() => {
            setModal(false);
            unlinkAccount(accountToUnlink);
            setAccountToUnlink(null);
          }}
        />
      )}
      <div className="content-page">
        {renderHeader()}
        {<div className="linked-accounts__error">{error}</div>}
        <div className="linked-accounts">
          {data.map((account) => (
            <div key={account.internalName}>{renderAccount(account)}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LinkedAccounts;
