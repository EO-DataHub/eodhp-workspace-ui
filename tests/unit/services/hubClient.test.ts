import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HubClient } from '../../../src/services/hubClient';

describe('HubClient', () => {
  const loginRedirectUrl = '/login';
  let hubClient: HubClient;

  beforeEach(() => {
    hubClient = new HubClient(loginRedirectUrl);
  });

  it('should redirect to login on 401 response', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
      status: 401,
      ok: false,
      json: vi.fn(),
    } as unknown as Response);

    const mockLocation = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        set href(url: string) {
          mockLocation(url);
        },
      },
    });

    try {
      await expect(hubClient.fetch('/test')).rejects.toThrow('Unauthorized - Redirecting to login');
      expect(mockLocation).toHaveBeenCalledWith(loginRedirectUrl);
    } finally {
      mockFetch.mockRestore();
      mockLocation.mockRestore();
    }
  });

  it('should return response on successful fetch', async () => {
    const mockResponse = {
      status: 200,
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    try {
      const response = await hubClient.fetch('/test');
      expect(response).toBe(mockResponse);
    } finally {
      mockFetch.mockRestore();
    }
  });

  it('should throw an error on fetch failure', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    await expect(hubClient.fetch('/test')).rejects.toThrow('Network error');

    mockFetch.mockRestore();
  });

  it('should throw an error on 403 response', async () => {
    const mockResponse = {
      status: 403,
      ok: false,
      text: vi.fn().mockResolvedValue('Forbidden'),
    } as unknown as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    try {
      await expect(hubClient.fetch('/test')).rejects.toThrow(
        'HTTP error! status: 403, message: Forbidden',
      );
    } finally {
      mockFetch.mockRestore();
    }
  });
});
