import { useState } from 'react';
import './styles.scss';

import { ToastContainer, toast } from 'react-toastify';

import CopyIcon from '@/assets/icons/copy.svg';
import { Button } from '@/components/Button/Button';
import { useWorkspace } from '@/hooks/useWorkspace';
import { createToken } from '@/services/S3Service';

export const S3 = () => {
  const { activeWorkspace } = useWorkspace();
  const [newTokenValue, setNewTokenValue] = useState<S3Credentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMessage = (message: string) => {
    toast(message);
  };

  const copyIndividualKey = async (inputString: string) => {
    setMessage('Copied to clipboard');
    await navigator.clipboard.writeText(inputString);
  };

  const copyAllKeys = async (accessKey: string, secretAccessKey: string, sessionToken: string) => {
    const credentials: string =
      `ACCESS_KEY_ID=${accessKey}\n` +
      `SECRET_ACCESS_KEY=${secretAccessKey}\n` +
      `SESSION_TOKEN=${sessionToken}`;
    setMessage('All copied to clipboard');
    await navigator.clipboard.writeText(credentials);
  };

  const handleCreateToken = async () => {
    try {
      setLoading(true);
      setError(null);
      let newToken: S3Credentials;
      if (import.meta.env.VITE_WORKSPACE_LOCAL) {
        newToken = {
          accessKeyId: 'ASIAURNLE34f34f32f3d15U6X2Y',
          secretAccessKey: '0NX6a8irw1x12d1dwfewff3hZh4q2HRGUAdympTOduR',
          sessionToken:
            'IQoJb3JpZ2luX2VjENX//////////wEaCWVsdvf23f23fasd12EXr5zkx3IU6Az/B3A4oOBXFZ7O/vLe+PP6/myujPBdmAiEA0g1D1OxBUuZBNeXRYL7tuvweKgcM5iUhfZ5GKiZ2tjcqnQQIjv//////////ARABGgwzMTIyODA5MTEyNjYiDN+BaVG0qAfERCCSrCrxA0pxYtHQLlVUkt9UHFPLYJPjIfWZYOT17lbjiORQKeTl9inyHkjNwbU5yUeaMudia50XI1XdLyZPTYNAEreM8b7uuEufyi3cnoLUuzit0RBjr7ATt4vV3pE5MIB7UeEeVkbpCw+OOl3yNGN5R3X43+bsdgYh0XnsMXjnYn5jDYwr5b1Qv5LAHE4jJOuDRZUHOddC25YaU9zLCl1rCaRARReQ/41Ywit19i13OI5F1Z63bUITrGjgqhBZgDLW1Zr8bTD609dWfhT+NKToSaxMQXAuOaG98rXYCAAtQyYS2WCoN/DcrZaGGaQdn4HqA/dmDyjII9yk5qb0DvP3l/qdorGq1+aQRi9WMwhBWZEWaKTHmCPptMTF/6hELMbqQ/erc2UZiEt87mOGBl8SEYDy2pP293nOQao91t7W9+Dlws/39ZAmSp/RY/VmiEz0f9XTGJY+31/UlH+SmfTC7ncl0+c09baSFr6AmlnbT9AAtO76HDVDfxKPzR0bhIj3xdGIi0RjQxGRQ3KNm6lzvb+utaVuOkbmoitjbzit5ZcKvWXM3BXwLLZYqdj26T3ovJSWqH8/+fOyyI8+BgtaGxlkdpwO/PSt7CR4zEifVQRT7Xx7rP/PUGAj6c3OTl3lPtQMCb62MjfRH+MTMQmTpI4ePlzlMKbFrMEGOpQBei+2/lrWP9MoXsz6lBqOsYHasiVIVfSxwjMYFlJWcmcCCoXUebT7wyFLlnhV4hwJq4bYYMX8SlriH0IbZCuWS5CEzoWTHK/fOMo+RuGAADoeh0bwD3k7RZ4RfSIHNZJVNR1Krm6M59iUx82uHQRIkLrJapLg6ooMRiUwCQ5Q3BLDVTTEEKrNKvxxzirg2/YImyIonA==',
          expiration: '2025-05-19T13:23:02Z',
        };
      } else {
        newToken = await createToken(activeWorkspace.name);
      }
      setNewTokenValue(newToken);
      setMessage('Please copy credentials as this is your only chance');
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
            className="copy-all-button"
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
          <div className="new-token-section">
            <div className="new-token-section__text">
              <strong className="key-name">Access Key ID: </strong>
              <span className="aws-creds">{newTokenValue.accessKeyId}</span>
            </div>
            <Button
              className="copy-button"
              onClick={() => copyIndividualKey(newTokenValue.accessKeyId)}
            >
              <img alt="copy" src={CopyIcon} />
            </Button>
          </div>
          <div className="new-token-section">
            <div className="new-token-section__text">
              <strong className="key-name">Secret Access Key: </strong>
              <span className="aws-creds">{newTokenValue.secretAccessKey}</span>
            </div>
            <Button
              className="copy-button"
              onClick={() => copyIndividualKey(newTokenValue.secretAccessKey)}
            >
              <img alt="copy" src={CopyIcon} />
            </Button>
          </div>
          <div className="new-token-section">
            <div className="new-token-section__text">
              <strong className="key-name">Session Token: </strong>
              <span className="aws-creds">{newTokenValue.sessionToken}</span>
            </div>
            <Button
              className="copy-button"
              onClick={() => copyIndividualKey(newTokenValue.sessionToken)}
            >
              <img alt="copy" src={CopyIcon} />
            </Button>
          </div>
          <div className="new-token-section">
            <div className="new-token-section__text">
              <strong>Expiration:</strong> {newTokenValue.expiration}
            </div>
          </div>
        </div>
      ) : null}
      <Button className="create-token" disabled={loading} onClick={handleCreateToken}>
        Request Temporary AWS S3 Credentials
      </Button>
      <ToastContainer hideProgressBar position="bottom-left" theme="light" />
    </div>
  );
};
