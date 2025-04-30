export class HubClient {
  private loginRedirect: string;

  constructor(loginRedirectUrl: string) {
    this.loginRedirect = loginRedirectUrl;
  }

  async fetch(path: string, options?: RequestInit): Promise<Response> {
    try {
      const response = await fetch(path, options);

      if (response.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = this.loginRedirect;
        return Promise.reject(new Error('Unauthorized - Redirecting to login'));
      }

      if (!response.ok) {
        // Handle other HTTP errors
        const errorText = await response.text();
        return Promise.reject(
          new Error(`HTTP error! status: ${response.status}, message: ${errorText}`),
        );
      }

      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const loginRedirectUrl = '/sign_in/';
export const hubClient = new HubClient(loginRedirectUrl);
