import React, { useEffect, useState } from 'react';

import { createToken, deleteToken, listTokens } from '@/services/credentialsService';
import './styles.scss';

type CredentialsProps = {
  workspaceProject: string;
};

export const Credentials = ({ workspaceProject }: CredentialsProps) => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const fetchedTokens = await listTokens();
      setTokens(fetchedTokens);
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
    }
  };

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
    <div className="workspace__credentials">
      <h2>API Credentials ({workspaceProject})</h2>
      <p>Manage your API tokens here. You can view your existing tokens and request new ones.</p>

      <div className="token-list">
        <h3>Existing Tokens:</h3>
        <ul>
          {tokens.map((token) => (
            <li key={token.id}>
              Token ID: {token.id} - Created on: {new Date(token.createdAt).toLocaleString()}
              <button onClick={() => handleDeleteToken(token.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleCreateToken}>Request New Token</button>
    </div>
  );
};
