import { useEffect, useState } from 'react';

import { createToken, deleteToken, listTokens } from '@/services/credentialsService';

export const DataHub = () => {
  const [tokens, setTokens] = useState([]);
  const [newTokenValue, setNewTokenValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setLoading(true);
      // TODO: wire up to frontend form SG87 2024-12-17
      const name = "API Token";
      const scope = "offline_access";
      const expires = 30;
      const newToken: DataHubToken = await createToken(name, scope, expires);
      const { token, ...tokenData } = newToken; // Exclude the actual token value
      setTokens([...tokens, tokenData]);
      setNewTokenValue(token);
    } catch (error) {
      console.error('Failed to create token:', error);
      setError('Failed to create token.');
    } finally {
      setLoading(false);
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

  return (
    <div className="data-hub application-page">
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {newTokenValue ? (
        <div className="new-token-message">
          <p>
            <strong>Token ID:</strong> {tokens[tokens.length - 1]?.id}
            <br />
            <strong>API Key:</strong> {newTokenValue}
          </p>
          <p>This is your only chance to copy it!</p>
          <button onClick={() => setNewTokenValue('')}>Dismiss</button>
        </div>
      ) : null}

      {tokens.length === 0 && !loading ? (
        <p className="disclaimer">
          You do not currently have any active tokens. Click the button below to create one.
        </p>
      ) : null}

      <button className="create-token" disabled={loading} onClick={handleCreateToken}>
        Request New Token
      </button>

      {tokens.length > 0 ? (
        <div className="token-list">
          <ul>
            {tokens.reverse().map((token) => (
              <li key={token.id}>
                <span className="token-info">{token.id}</span>
                <button disabled={loading} onClick={() => handleDeleteToken(token.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
