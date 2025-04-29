import { hubClient } from './hubClient';

// Function to list all tokens
export const listTokens = async (workspaceName: string): Promise<DataHubToken[]> => {
  const path = `/api/workspaces/${workspaceName}/me/tokens`;
  const response = await hubClient
    .fetch(path, {
      credentials: 'include',
    })
    .catch((error) => {
      console.error('Error fetching tokens:', error);
      throw error;
    });

  const tokens: DataHubToken[] = await response.json();
  return tokens;
};

// Function to create a new token
export const createToken = async (
  name: string,
  workspaceName: string,
  expires: number,
): Promise<DataHubToken> => {
  const path = `/api/workspaces/${workspaceName}/me/tokens`;
  const response = await hubClient
    .fetch(path, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        expires: expires,
      } as CreateDataHubToken),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    .catch((error) => {
      console.error('Error creating token:', error);
      throw error;
    });

  const newToken: DataHubToken = await response.json();
  return newToken;
};

// Function to delete a token
export const deleteToken = async (workspaceName: string, tokenId: string): Promise<boolean> => {
  const URL = `/api/workspaces/${workspaceName}/me/tokens/${tokenId}`;
  await fetch(URL, {
    method: 'DELETE',
    credentials: 'include',
  }).catch((error) => {
    console.error('Error deleting token:', error);
    throw error;
  });

  return true;
};
