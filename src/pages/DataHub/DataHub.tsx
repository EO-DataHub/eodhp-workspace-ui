import { useEffect, useState } from 'react';
import '../../styles/main.scss';

import { Button } from '@/components/Button/Button';
import { Field } from '@/components/Form/Fields/types';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import { createToken, deleteToken, listTokens } from '@/services/credentialsService';

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
    externalName: 'Scope',
    internalName: 'scope',
    value: 'offline_access',
    readOnly: true,
    type: 'string',
  },
  { externalName: 'Expires', internalName: 'expires', value: 30, type: 'number', min: 0, max: 30 },
];

export const DataHub = () => {
  const [tokens, setTokens] = useState([]);
  const [newTokenValue, setNewTokenValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingToken, setCreatingToken] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState<boolean>(false);

  const getDefaultFormValues = () => {
    const data = {};
    TOKEN_FORM_INPUTS.map((input: Field) => {
      data[input.internalName] = input.value;
    });
    return data;
  };

  const [formData, setFormData] = useState<{ [key: string]: string }>(() => getDefaultFormValues());

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const fetchedTokens: DataHubToken[] = await listTokens();
        setTokens(fetchedTokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        setError('Failed to fetch tokens.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleCreateToken = async () => {
    try {
      setCreatingToken(true);
      const newToken: DataHubToken = await createToken(
        formData['name'],
        formData['scope'],
        parseFloat(formData['expires']),
      );
      const { token, ...tokenData } = newToken; // Exclude the actual token value
      setTokens([...tokens, tokenData]);
      setNewTokenValue(token);
      setFormData(getDefaultFormValues());
    } catch (error) {
      console.error('Failed to create token:', error);
      setError('Failed to create token.');
    } finally {
      setCreatingToken(false);
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      setLoading(true);
      await deleteToken(tokenId);
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
          <Button onClick={() => setNewTokenValue('')}>Dismiss</Button>
        </div>
      );
    }
    return (
      <Form
        fieldData={TOKEN_FORM_INPUTS}
        header={'Create Token'}
        onChange={(formData) => setFormData(formData)}
      />
    );
  };

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

      <Button disabled={loading} onClick={() => setModal(true)}>
        Request New Token
      </Button>

      {tokens.length > 0 ? (
        <div className="token-list">
          <ul>
            {tokens.reverse().map((token) => (
              <li key={token.id}>
                <div>
                  <h3>Name</h3>
                  <span className="token-info">{token.name}</span>
                </div>
                <div>
                  <h3>Scope</h3>
                  <span className="token-info">{token.scope}</span>
                </div>
                <div>
                  <h3>Created</h3>
                  <span className="token-info">{token.created}</span>
                </div>
                <div>
                  <h3>Expiry</h3>
                  <span className="token-info">{token.expiry}</span>
                </div>
                <Button disabled={loading} onClick={() => handleDeleteToken(token.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
