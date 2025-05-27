/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './DataHub.scss';

import { ToastContainer, toast } from 'react-toastify';

import CopyIcon from '@/assets/icons/copy.svg';
import deleteIcon from '@/assets/icons/Delete.svg';
import { Button } from '@/components/Button/Button';
import { Field } from '@/components/Form/Fields/types';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import Table from '@/components/Table/Table';
import { useWorkspace } from '@/hooks/useWorkspace';
import { createToken, deleteToken, listTokens } from '@/services/credentialsService';

import { tokensPlaceholder } from './placeholder';

const tableHeaders = [
  {
    internalName: 'name',
    externalName: 'Name',
  },
  {
    internalName: 'scope',
    externalName: 'Scope',
  },
  {
    internalName: 'created',
    externalName: 'Created',
  },
  {
    internalName: 'expiry',
    externalName: 'Expiry',
  },
  {
    internalName: 'delete',
    externalName: '',
  },
];

export const DataHub = () => {
  const { activeWorkspace, availableWorkspaces } = useWorkspace();

  const [tokens, setTokens] = useState([]);
  const [newTokenValue, setNewTokenValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingToken, setCreatingToken] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [tokenFormInputs, setTokenFormInputs] = useState<Field[]>([]);

  const setMessage = (message: string) => {
    toast(message);
  };

  useEffect(() => {
    const TOKEN_FORM_INPUTS: Field[] = [
      {
        externalName: 'Name',
        internalName: 'name',
        value: 'API Token',
        type: 'string',
        max: 128,
      },
      {
        externalName: 'Expires (days)',
        internalName: 'expires',
        value: 30,
        type: 'number',
        min: 0,
        max: 30,
      },
    ];
    setTokenFormInputs(TOKEN_FORM_INPUTS);
    setFormData(getDefaultFormValues(TOKEN_FORM_INPUTS));
  }, [activeWorkspace]);

  const getDefaultFormValues = (initialInputs?: Field[]) => {
    const inputs = initialInputs || tokenFormInputs;
    const data = {};
    inputs.map((input: Field) => {
      data[input.internalName] = input.value;
    });
    return data;
  };

  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        let _tokens: DataHubToken[];
        if (import.meta.env.VITE_WORKSPACE_LOCAL) {
          _tokens = tokensPlaceholder;
        } else {
          _tokens = await listTokens(activeWorkspace.name);
        }
        setTokens(_tokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        setMessage('Failed to fetch tokens.');
        setError('Failed to fetch tokens.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [activeWorkspace]);

  const handleCreateToken = async () => {
    if (!validate()) return;
    try {
      setCreatingToken(true);
      const newToken: DataHubToken = await createToken(
        formData['name'],
        activeWorkspace.name,
        parseFloat(formData['expires']),
      );
      const { token, ...tokenData } = newToken; // Exclude the actual token value
      setTokens([...tokens, tokenData]);
      setNewTokenValue(token);
      setFormData(getDefaultFormValues());
      setMessage('Token created.');
    } catch (error) {
      console.error('Failed to create token:', error);
      setMessage('Failed to create token.');
      setFormData(getDefaultFormValues());
      setError('Failed to create token.');
    } finally {
      setCreatingToken(false);
    }
  };

  const validate = () => {
    const errors = [];

    if (!formData['name']) {
      errors.push('Name required');
    }
    if (!formData['expires']) {
      errors.push('Expiration required');
    }

    setFormErrors(errors);
    return !errors.length;
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      setLoading(true);
      await deleteToken(activeWorkspace.name, tokenId);
      setTokens(tokens.filter((token) => token.id !== tokenId));
      setMessage('Token deleted.');
    } catch (error) {
      console.error('Failed to delete token:', error);
      setMessage('Failed to delete token.');
      setError('Failed to delete token.');
    } finally {
      setLoading(false);
    }
  };

  const copyIndividualKey = async (inputString: string) => {
    await navigator.clipboard.writeText(inputString);
  };

  const renderModalContent = () => {
    if (creatingToken) return <div>Creating token</div>;
    if (newTokenValue) {
      return (
        <div className="new-token-message">
          <p>
            <strong>Token ID:</strong> {tokens[tokens.length - 1]?.id}
            <br />
            <strong>API Key:</strong> {newTokenValue}
            <Button className="copy-button" onClick={() => copyIndividualKey(newTokenValue)}>
              <img alt="copy" src={CopyIcon} />
            </Button>
          </p>
          <p>This is your only chance to copy it!</p>
        </div>
      );
    }
    return (
      <Form
        description={getModalDescription()}
        fieldData={tokenFormInputs}
        formErrors={formErrors}
        header={'Create Token'}
        onChange={(formData) => setFormData(formData)}
      />
    );
  };

  const getModalDescription = () => {
    return (
      <div>
        <div>
          You will require an API key if you wish to securely connect to your workspace using
          external tools or services. You can find out more{' '}
          <a href="/docs/account-setup/workspaces/workspace-credentials/" target="_blank">
            here
          </a>
        </div>
      </div>
    );
  };

  const renderDelete = (token) => {
    return (
      <div
        onClick={async () => {
          try {
            await handleDeleteToken(token.id);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <img alt="delete" className="table-column-delete" src={deleteIcon} />
      </div>
    );
  };

  const rows = tokens.reverse().map((token) => {
    const expiry = new Date(token.expiry).toDateString();
    token.expiry = expiry;
    return {
      name: token.name,
      scope: token.scope,
      created: token.created,
      expiry: token.expiry,
      delete: renderDelete(token),
    };
  });

  return (
    <div className="data-hub application-page">
      {modal && (
        <Modal
          cancelText={newTokenValue ? 'Dismiss' : 'Cancel'}
          content={renderModalContent()}
          hideSubmit={!!newTokenValue}
          onCancel={() => {
            setModal(false);
            setNewTokenValue(null);
          }}
          onSubmit={() => handleCreateToken()}
        />
      )}
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {tokens.length === 0 && !loading ? (
        <p className="disclaimer">
          You do not currently have any active tokens. Click the button below to create one.
        </p>
      ) : null}

      <Button
        className={`${!availableWorkspaces?.length ? 'disabled' : ''}`}
        disabled={loading || !availableWorkspaces?.length}
        onClick={() => setModal(true)}
      >
        Request New Token
      </Button>

      {tokens.length > 0 ? <Table headers={tableHeaders} maxRowsPerPage={10} rows={rows} /> : null}
      <ToastContainer hideProgressBar position="bottom-left" theme="light" />
    </div>
  );
};
