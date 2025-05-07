import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { useWorkspace } from '@/hooks/useWorkspace';
import { createToken } from '@/services/S3Service';

export const S3 = () => {
  const { activeWorkspace } = useWorkspace();
  const [newTokenValue, setNewTokenValue] = useState<S3Credentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyIndividualKey = async (inputString: string) => {
    await navigator.clipboard.writeText(inputString);
  };

  const copyAllKeys = async (
    access_key: string,
    secret_access_key: string,
    session_token: string,
  ) => {
    const credentials: string =
      `ACCESS_KEY_ID=${access_key}\n` +
      `SECRET_ACCESS_KEY=${secret_access_key}\n` +
      `SESSION_TOKEN=${session_token}`;

    await navigator.clipboard.writeText(credentials);
  };

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
          <Button
            onClick={() =>
              copyAllKeys(
                newTokenValue.accessKeyId,
                newTokenValue.secretAccessKey,
                newTokenValue.sessionToken,
              )
            }
          >
            Copy credentials to .env file
          </Button>
          <p>
            <strong>Access Key ID:</strong>
            <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {newTokenValue.accessKeyId}
            </span>
            <Button
              style={{ display: 'inline-flex', marginLeft: '10px' }}
              onClick={() => copyIndividualKey(newTokenValue.accessKeyId)}
            >
              ⧉
            </Button>
          </p>
          <p>
            <strong>Secret Access Key:</strong>
            <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {newTokenValue.secretAccessKey}
            </span>
            <Button
              style={{ display: 'inline-flex', marginLeft: '10px' }}
              onClick={() => copyIndividualKey(newTokenValue.secretAccessKey)}
            >
              ⧉
            </Button>
          </p>
          <p>
            <strong>Session Token:</strong>{' '}
            <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {newTokenValue.sessionToken}
            </span>
            <Button
              style={{ display: 'inline-flex', marginLeft: '10px' }}
              onClick={() => copyIndividualKey(newTokenValue.sessionToken)}
            >
              ⧉
            </Button>
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
