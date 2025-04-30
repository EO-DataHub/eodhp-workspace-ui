import { hubClient } from './hubClient';

export const createToken = async (workspaceName: string): Promise<S3Credentials> => {
  const path = `/api/workspaces/${workspaceName}/me/s3-tokens`;
  const response = await hubClient
    .fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    .catch((error) => {
      console.error('Error creating token:', error);
      throw error;
    });

  const newToken: S3Credentials = await response.json();
  return newToken;
};
