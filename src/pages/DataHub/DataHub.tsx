/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './DataHub.scss';

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
  const [tokenFormInputs, setTokenFormInputs] = useState<Field[]>([]);

  useEffect(() => {
    const TOKEN_FORM_INPUTS: Field[] = [
      {
        externalName: 'Name',
        internalName: 'name',
        value: 'API Token',
        type: 'string',
        min: 1,
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
        setError('Failed to fetch tokens.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [activeWorkspace]);

  const handleCreateToken = async () => {
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
    } catch (error) {
      console.error('Failed to create token:', error);
      setFormData(getDefaultFormValues());
      setError('Failed to create token.');
    } finally {
      setCreatingToken(false);
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      setLoading(true);
      await deleteToken(activeWorkspace.name, tokenId);
      setTokens(tokens.filter((token) => token.id !== tokenId));
    } catch (error) {
      console.error('Failed to delete token:', error);
      setError('Failed to delete token.');
    } finally {
      setLoading(false);
    }
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
          </p>
          <p>This is your only chance to copy it!</p>
        </div>
      );
    }
    return (
      <Form
        fieldData={tokenFormInputs}
        header={'Create Token'}
        onChange={(formData) => setFormData(formData)}
      />
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
    </div>
  );
};
