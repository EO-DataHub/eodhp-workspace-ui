export const createToken = async (workspaceId: string): Promise<S3Credentials> => {
  try {
    const url = `/api/workspaces/${workspaceId}/me/s3-tokens`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.ok) {
      const newToken: S3Credentials = await response.json();
      return newToken;
    }
    if (response.status === 401 || response.status === 403) {
      window.location.href = '/sign_in/';
    }
    throw new Error('Failed to create token');
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};
