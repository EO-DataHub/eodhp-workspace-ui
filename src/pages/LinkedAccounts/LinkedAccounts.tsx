/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';

import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';

import Cross from '@/assets/icons/cross.svg';
import link from '@/assets/icons/link.svg';
import Tick from '@/assets/icons/tick.svg';
import { Button } from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Help from '@/components/Table/Components/Help/Help';
import { useWorkspace } from '@/hooks/useWorkspace';

type LinkableAccount = {
  internalName: string;
  externalName: string;
  docs: JSX.Element;
};

type AccountMetaData = {
  value: string;
  linked: boolean;
  message: string;
  internalName: string;
  externalName: string;
  docs: JSX.Element;
  valid?: boolean;
};

type ValidationResponse = {
  key: string;
  name: string;
  contracts?: {
    sar: boolean;
    optical: { [key: string]: string };
  };
};

type ContractData = {
  options: string[];
  key: string;
  value: string;
};

const linkableAccounts: LinkableAccount[] = [
  {
    internalName: 'airbus',
    externalName: 'Airbus',
    docs: (
      <p>
        Connect your Airbus account to order Airbus data through the EODH. Request a OneAtlas
        account via the{' '}
        <a href="https://space-solutions.airbus.com/" rel="noopener noreferrer" target="_blank">
          website
        </a>
        . Self-serve an API key from the{' '}
        <a href="https://www.geoapi-airbusds.com/" rel="noopener noreferrer" target="_blank">
          OneAtlas Developer Portal
        </a>{' '}
        under 'Get your API Key', and input it below. Follow{' '}
        <a href="/docs/account-setup/workspaces/linked-accounts/">this guide</a> for more
        information. Contact{' '}
        <a href="mailto:ukintelligence-imagerysupport@airbus.com">
          ukintelligence-imagerysupport@airbus.com
        </a>{' '}
        for support.
      </p>
    ),
  },
  {
    internalName: 'planet',
    externalName: 'Planet',
    docs: (
      <p>
        Connect your Planet account to order Planet data through the EODH. Sign up for a Planet
        account via the{' '}
        <a href="https://www.planet.com/" rel="noopener noreferrer" target="_blank">
          website
        </a>
        . Self-serve an API key from{' '}
        <a
          href="https://support.planet.com/hc/en-us/articles/4572497499421-How-to-find-your-API-Key"
          rel="noopener noreferrer"
          target="_blank"
        >
          your Planet account
        </a>{' '}
        under 'My Settings', and input below. More information can be found{' '}
        <a href="/docs/account-setup/workspaces/linked-accounts/">here</a>. Contact{' '}
        <a href="mailto:eodatahub@planet.com">eodatahub@planet.com</a> for support.
      </p>
    ),
  },
];

const LinkedAccounts = () => {
  const { activeWorkspace, isWorkspaceOwner } = useWorkspace();

  const [error, setError] = useState('');
  const [data, setData] = useState<AccountMetaData[]>([]);
  const [running, setRunning] = useState<boolean>();
  const [modal, setModal] = useState<boolean>(false);
  const [accountToUnlink, setAccountToUnlink] = useState<AccountMetaData>();

  const setMessage = (message: string) => {
    toast(message);
  };

  const [legacyData, setLegacyData] = useState<ContractData>({
    options: [],
    key: '',
    value: '',
  });

  const [pneoData, setPNEOData] = useState<ContractData>({
    options: [],
    key: '',
    value: '',
  });

  const [sar, setSar] = useState<boolean>(false);

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
      setMessage('Failed to get linked accounts');
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
        value: '',
        linked: false,
        message: 'Not linked',
        internalName: 'airbus',
        externalName: 'Airbus',
        docs: linkableAccounts[0].docs,
        valid: false,
      },
      {
        value: '',
        linked: false,
        message: 'Linked',
        internalName: 'planet',
        externalName: 'Planet',
        docs: linkableAccounts[1].docs,
        valid: true,
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
          <div className="linked-accounts__account-modal">
            <Help content={account.docs} type="Modal" />
          </div>
        </div>
        <div className="linked-accounts__account-input">
          <input
            disabled={account.linked || !isWorkspaceOwner}
            placeholder="Enter your API key"
            type={account.linked ? 'password' : 'text'}
            value={account.value}
            onChange={(e) => {
              updateData(account, 'value', e.target.value);
            }}
          />
        </div>
        {account.valid && account.internalName === 'airbus' && renderValidationOptions()}
        {account.valid && account.internalName === 'planet' && (
          <div className="linked-accounts__success">API key is valid</div>
        )}
        {renderButton(account)}
      </div>
    );
  };

  const renderValidationOptions = () => {
    return (
      <>
        <div className="linked-accounts__validation">
          <div className="linked-accounts__validation-radar">
            <h3>Radar</h3>
            {sar ? <img alt="SAR status" src={Tick} /> : <img alt="SAR status" src={Cross} />}
          </div>
          <div className="linked-accounts__validation-optical">
            <h3>Optical</h3>
            <div>Legacy Contract</div>
            {legacyData?.options?.length ? (
              <select
                disabled={legacyData.options.length === 1}
                value={legacyData.value}
                onChange={(e) => {
                  const copy = { ...legacyData };
                  copy.value = e.target.value;
                  setLegacyData(copy);
                }}
              >
                {legacyData?.options?.map((option) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            ) : null}

            <div>PNEO Contract</div>
            {pneoData?.options?.length ? (
              <select
                disabled={pneoData.options.length === 1}
                value={pneoData.value}
                onChange={(e) => {
                  const copy = { ...legacyData };
                  copy.value = e.target.value;
                  setPNEOData(copy);
                }}
              >
                {pneoData?.options?.map((option) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            ) : null}
          </div>
        </div>
        <span>
          Please select your contract from the dropdowns and confirm by pressing "Link Account"
        </span>
      </>
    );
  };

  const renderButton = (account: AccountMetaData) => {
    if (!account.linked && !account.valid) {
      return renderValidateButton(account, account.internalName);
    }

    if (account.linked) return renderUnlinkButton(account);
    if (!account.linked) return renderLinkButton(account);
  };

  const renderValidateButton = (account: AccountMetaData, type: string) => {
    const onClick = () => {
      if (type === 'airbus') validateAirbusKey(account);
      else if (type === 'planet') validatePlanetKey(account);
    };

    return (
      <Button disabled={!isWorkspaceOwner || !account.value || running} onClick={onClick}>
        Validate API key
      </Button>
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

  const validateAirbusKey = async (account: AccountMetaData) => {
    try {
      setRunning(true);
      setError('');
      const body = {
        name: 'airbus',
        key: account.value.trim(),
      };
      const res = await fetch(
        `/api/workspaces/${activeWorkspace.name}/linked-accounts/airbus/validate`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        setError('Error validating account, please check your API key');
        setMessage('Error validating account, please check your API key');
        return;
      }

      const json: ValidationResponse = await res.json();
      if (!json.contracts) {
        setError('No contracts associated to this API key');
        setMessage('No contracts associated to this API key');
        return;
      }

      const contracts = json.contracts;
      setSar(contracts.sar);

      const _legacyOptions: string[] = [];
      let _legacyKey: string;

      const _pneoOptions: string[] = [];
      let _pneoKey: string;

      Object.keys(contracts.optical).forEach((contractKey) => {
        if (contracts.optical[contractKey].includes('LEGACY')) {
          _legacyOptions.push(contractKey);
          if (!_legacyKey) _legacyKey = contracts.optical[contractKey];
        }
        if (contracts.optical[contractKey].includes('PNEO')) {
          _pneoOptions.push(contractKey);
          if (!_pneoKey) _pneoKey = contracts.optical[contractKey];
        }
      });

      setLegacyData({
        options: _legacyOptions,
        key: _legacyKey,
        value: _legacyOptions[0],
      });

      setPNEOData({
        options: _pneoOptions,
        key: _pneoKey,
        value: _pneoOptions[0],
      });

      updateData(account, 'valid', true);
    } catch (error) {
      setError(error);
    } finally {
      setRunning(false);
    }
  };

  const validatePlanetKey = async (account: AccountMetaData) => {
    try {
      setRunning(true);
      setError('');
      const body = {
        name: 'planet',
        key: account.value.trim(),
      };
      const res = await fetch(
        `/api/workspaces/${activeWorkspace.name}/linked-accounts/planet/validate`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        setError('Error validating Planet account, please check your API key');
        setMessage('Error validating Planet account, please check your API key');
        return;
      }

      // If we get here, status is 200
      updateData(account, 'valid', true);
    } catch (error) {
      setError(error);
    } finally {
      setRunning(false);
    }
  };

  const linkAccount = async (account: AccountMetaData) => {
    try {
      setRunning(true);
      const body: ValidationResponse = { name: account.internalName, key: account.value.trim() };
      if (account.internalName === 'airbus') {
        const contracts = {
          sar: sar,
          optical: {},
        };
        contracts.optical[legacyData.value] = legacyData.key;
        contracts.optical[pneoData.value] = pneoData.key;
        body.contracts = contracts;
      }
      const res = await fetch(`/api/workspaces/${activeWorkspace.name}/linked-accounts`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setError('Error linking account');
        setMessage('Error linking account');
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
        setMessage('Error linking account');
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
        {!isWorkspaceOwner && (
          <div
            style={{
              backgroundColor: '#fff8e1',
              color: '#8a6d3b',
              padding: '1rem',
              borderRadius: '5px',
              marginBottom: '1rem',
              border: '1px solid #faebcc',
            }}
          >
            You have view-only access. Only workspace owners can edit or link API keys.
          </div>
        )}
        {<div className="linked-accounts__error">{error}</div>}
        <div className="linked-accounts">
          {data.map((account) => (
            <div key={account.internalName}>{renderAccount(account)}</div>
          ))}
        </div>
        <ToastContainer hideProgressBar position="bottom-left" theme="light" />
      </div>
    </>
  );
};

export default LinkedAccounts;
