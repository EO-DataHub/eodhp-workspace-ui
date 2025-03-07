const API_BASE_URL = '/api/tokens';

// Function to list all tokens
export const listTokens = async (workspaceName: string): Promise<DataHubToken[]> => {
  try {
    const URL = `/api/workspaces/${workspaceName}/me/tokens`;
    const response = await fetch(URL, {
      credentials: 'include',
    });

    if (response.ok) {
      const tokens: DataHubToken[] = await response.json();
      return tokens;
    }
    throw new Error('Failed to fetch tokens');
  } catch (error) {
    console.error('Error listing tokens:', error);
    throw error;
  }
};

// Function to create a new token
export const createToken = async (
  name: string,
  workspaceName: string,
  expires: number,
): Promise<DataHubToken> => {
  try {
    const URL = `/api/workspaces/${workspaceName}/me/tokens`;
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        expires: expires,
      } as CreateDataHubToken),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 202) {
      const newToken: DataHubToken = await response.json();
      return newToken;
    }
    if (response.status === 401 || response.status === 403) {
      window.location.href = '/sign_in/';
      throw new Error('Unauthorized or forbidden');
    }
    throw new Error('Failed to create token');
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

// Function to delete a token
export const deleteToken = async (workspaceName: string, tokenId: string): Promise<boolean> => {
  try {
    const URL = `/api/workspaces/${workspaceName}/me/tokens/${tokenId}`;
    const response = await fetch(URL, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.status === 204) {
      return true;
    }
    throw new Error('Failed to delete token');
  } catch (error) {
    console.error('Error deleting token:', error);
    throw error;
  }
};
