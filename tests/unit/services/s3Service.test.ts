import { describe, expect, it, vi } from 'vitest';
import { createToken } from '../../../src/services/S3Service';
import { hubClient } from '../../../src/services/hubClient';

vi.mock('../../../src/services/hubClient', () => ({
  hubClient: {
    fetch: vi.fn(),
  },
}));

describe('createToken', () => {
  it('should create and return a new token', async () => {
    const mockToken = { id: '1', name: 'newToken' };
    (hubClient.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockToken),
    });
    const workspaceName = 'testWorkspace';

    const token = await createToken(workspaceName);

    expect(hubClient.fetch).toHaveBeenCalledWith(`/api/workspaces/${workspaceName}/me/s3-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    expect(token).toEqual(mockToken);
  });

  it('should throw an error if fetch fails', async () => {
    (hubClient.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Fetch failed'));

    const workspaceName = 'testWorkspace';

    await expect(createToken(workspaceName)).rejects.toThrow('Fetch failed');
  });
});
