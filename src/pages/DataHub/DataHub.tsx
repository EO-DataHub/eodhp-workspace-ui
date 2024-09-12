import { useEffect, useState } from 'react';

import { createToken, deleteToken, listTokens } from '@/services/credentialsService';
import './DataHub.scss';

export const DataHub = () => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const fetchedTokens = await listTokens();
        setTokens(fetchedTokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      }
    };

    fetchTokens();
  }, []);

  const handleCreateToken = async () => {
    try {
      const newToken = await createToken();
      setTokens([...tokens, newToken]);
      alert(`Token created: ${newToken.token}\nThis is your only chance to copy it!`);
    } catch (error) {
      console.error('Failed to create token:', error);
    }
  };

  const handleDeleteToken = async (tokenId) => {
    try {
      await deleteToken(tokenId);
      setTokens(tokens.filter((token) => token.id !== tokenId));
    } catch (error) {
      console.error('Failed to delete token:', error);
    }
  };

  return (
    <div className="data-hub application-page">
      {tokens.length === 0 && (
        <p className="disclaimer">
          You do not currently have any active tokens. Click the button below to create one.
        </p>
      )}

      <button className="create-token" onClick={handleCreateToken}>
        Request New Token
      </button>

      <div className="token-list">
        <ul>
          {tokens.map((token) => (
            <li key={token.id}>
              {token.id}
              <button onClick={() => handleDeleteToken(token.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
