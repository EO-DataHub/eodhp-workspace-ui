import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { useWorkspace } from '@/hooks/useWorkspace';
import { createToken } from '@/services/S3Service';

export const S3 = () => {
  const { activeWorkspace } = useWorkspace();
  const [newTokenValue, setNewTokenValue] = useState<S3Credentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateToken = async () => {
    try {
      setLoading(true);
      setError(null);
      const newToken: S3Credentials = await createToken(activeWorkspace.name);
      setNewTokenValue(newToken);
    } catch (error) {
      console.error('Failed to create token:', error);
      setError(error.message || 'Failed to create token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="s3 application-page">
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {newTokenValue ? (
        <div className="new-token-message">
          <p>
            <strong>Access Key ID:</strong> {newTokenValue.accessKeyId}
          </p>
          <p>
            <strong>Secret Access Key:</strong> {newTokenValue.secretAccessKey}
          </p>
          <p>
            <strong>Session Token:</strong> {newTokenValue.sessionToken}
          </p>
          <p>
            <strong>Expiration:</strong> {newTokenValue.expiration}
          </p>
          <p>This is your only chance to copy it!</p>
        </div>
      ) : null}

      {/* <button className="create-token" disabled={loading} onClick={handleCreateToken}>
        Request Temporary AWS S3 Credentials
      </button> */}
      <Button className="create-token" disabled={loading} onClick={handleCreateToken}>
        Request Temporary AWS S3 Credentials
      </Button>
    </div>
  );
};
