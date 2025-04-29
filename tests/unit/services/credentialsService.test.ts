import { describe, expect, it, vi } from 'vitest';

import { createToken, deleteToken, listTokens } from '../../../src/services/credentialsService';
import { hubClient } from '../../../src/services/hubClient';

vi.mock('../../../src/services/hubClient', () => ({
  hubClient: {
    fetch: vi.fn(),
  },
}));

describe('listTokens', () => {
  it('should fetch and return a list of tokens', async () => {
    const mockTokens = [
      { id: '1', name: 'token1' },
      { id: '2', name: 'token2' },
    ];
    (hubClient.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockTokens),
    });

    const workspaceName = 'testWorkspace';
    const tokens = await listTokens(workspaceName);

    expect(hubClient.fetch).toHaveBeenCalledWith(`/api/workspaces/${workspaceName}/me/tokens`, {
      credentials: 'include',
    });
    expect(tokens).toEqual(mockTokens);
  });

  it('should throw an error if fetch fails', async () => {
    (hubClient.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Fetch failed'));

    const workspaceName = 'testWorkspace';

    await expect(listTokens(workspaceName)).rejects.toThrow('Fetch failed');
  });
});

describe('createToken', () => {
  it('should create and return a new token', async () => {
    const mockToken = { id: '1', name: 'newToken' };
    (hubClient.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockToken),
    });

    const name = 'newToken';
    const workspaceName = 'testWorkspace';
    const expires = 3600;

    const token = await createToken(name, workspaceName, expires);

    expect(hubClient.fetch).toHaveBeenCalledWith(`/api/workspaces/${workspaceName}/me/tokens`, {
      method: 'POST',
      body: JSON.stringify({ name, expires }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    expect(token).toEqual(mockToken);
  });

  it('should throw an error if fetch fails', async () => {
    (hubClient.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Fetch failed'));

    const name = 'newToken';
    const workspaceName = 'testWorkspace';
    const expires = 3600;

    await expect(createToken(name, workspaceName, expires)).rejects.toThrow('Fetch failed');
  });
});

describe('deleteToken', () => {
  it('should delete a token and return true', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true });

    const workspaceName = 'testWorkspace';
    const tokenId = '1';

    const result = await deleteToken(workspaceName, tokenId);

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/workspaces/${workspaceName}/me/tokens/${tokenId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );
    expect(result).toBe(true);
  });

  it('should throw an error if fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Fetch failed'));

    const workspaceName = 'testWorkspace';
    const tokenId = '1';

    await expect(deleteToken(workspaceName, tokenId)).rejects.toThrow('Fetch failed');
  });
});
