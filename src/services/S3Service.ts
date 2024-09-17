const API_BASE_URL = '/api/workspaces/s3/credentials';

export const createToken = async (): Promise<S3Credentials> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.status === 202) {
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
