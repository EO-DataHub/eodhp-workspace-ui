import { ReactNode, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import { useWorkspace } from '@/hooks/useWorkspace';

export interface OpenCosmosUser {
  sub?: string;
  name?: string;
  email?: string;
}

type OpenCosmosAuthContextType = {
  isConnected: boolean;
  isLoading: boolean;
  hasConfiguration: boolean;
  error?: string;
  user?: OpenCosmosUser;
  connect: (returnTo?: string, organizationId?: number) => Promise<void>;
  disconnect: () => void;
  getAccessToken: () => Promise<string | undefined>;
};

type OpenCosmosProviderProps = {
  initialState?: Partial<OpenCosmosAuthContextType>;
  children: ReactNode;
};

interface OpenCosmosSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  scope?: string;
  tokenType?: string;
  user?: OpenCosmosUser;
  organizationId?: number;
}

interface OpenCosmosTransaction {
  codeVerifier: string;
  returnTo: string;
  workspaceName: string;
  organizationId: number;
}

interface TokenExchangeResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

const OPEN_COSMOS_AUTH_DOMAIN = import.meta.env.VITE_OPEN_COSMOS_AUTH_DOMAIN as string | undefined;
const OPEN_COSMOS_CLIENT_ID = import.meta.env.VITE_OPEN_COSMOS_CLIENT_ID as string | undefined;
const OPEN_COSMOS_AUDIENCE = import.meta.env.VITE_OPEN_COSMOS_AUDIENCE as string | undefined;
const OPEN_COSMOS_REDIRECT_URI = import.meta.env.VITE_OPEN_COSMOS_REDIRECT_URI as
  | string
  | undefined;
const OPEN_COSMOS_SCOPE =
  (import.meta.env.VITE_OPEN_COSMOS_SCOPE as string | undefined) ??
  'openid profile email offline_access';

const TRANSACTION_STORAGE_KEY = 'openCosmosAuthTransaction';
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;
const CODE_VERIFIER_BYTE_LENGTH = 64;

export const OpenCosmosAuthContext = createContext<OpenCosmosAuthContextType | null>(null);
OpenCosmosAuthContext.displayName = 'OpenCosmosAuthContext';

const getRedirectUri = () =>
  OPEN_COSMOS_REDIRECT_URI || `${window.location.origin}${window.location.pathname}`;

const getDefaultReturnTo = () => `${window.location.pathname}${window.location.search}`;

const persistTransaction = (transaction: OpenCosmosTransaction) => {
  sessionStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transaction));
};

const readTransaction = (): OpenCosmosTransaction | undefined => {
  const stored = sessionStorage.getItem(TRANSACTION_STORAGE_KEY);
  if (!stored) return undefined;

  try {
    return JSON.parse(stored) as OpenCosmosTransaction;
  } catch {
    sessionStorage.removeItem(TRANSACTION_STORAGE_KEY);
    return undefined;
  }
};

const clearTransaction = () => {
  sessionStorage.removeItem(TRANSACTION_STORAGE_KEY);
};

const base64UrlEncode = (bytes: Uint8Array) => {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const generateRandomString = (length: number) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
};

const createCodeChallenge = async (verifier: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64UrlEncode(new Uint8Array(digest));
};

const parseJwtPayload = (token?: string): OpenCosmosUser | undefined => {
  if (!token) return undefined;

  const [, payload] = token.split('.');
  if (!payload) return undefined;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as OpenCosmosUser;
  } catch {
    return undefined;
  }
};

const buildSession = (
  tokenResponse: TokenExchangeResponse,
  fallbackUser?: OpenCosmosUser,
): OpenCosmosSession => ({
  accessToken: tokenResponse.access_token,
  refreshToken: tokenResponse.refresh_token,
  expiresAt: Date.now() + tokenResponse.expires_in * 1000,
  scope: tokenResponse.scope,
  tokenType: tokenResponse.token_type,
  user:
    parseJwtPayload(tokenResponse.id_token) ??
    parseJwtPayload(tokenResponse.access_token) ??
    fallbackUser,
});

const isSessionActive = (session?: OpenCosmosSession) => {
  if (!session?.accessToken) return false;
  return session.expiresAt - TOKEN_EXPIRY_BUFFER_MS > Date.now();
};

export const OpenCosmosAuthProvider = ({
  initialState = {},
  children,
}: OpenCosmosProviderProps) => {
  const { activeWorkspace } = useWorkspace();
  const callbackHandledRef = useRef(false);
  const [session, setSession] = useState<OpenCosmosSession>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const hasConfiguration = useMemo(
    () => Boolean(OPEN_COSMOS_AUTH_DOMAIN && OPEN_COSMOS_CLIENT_ID && OPEN_COSMOS_AUDIENCE),
    [],
  );

  const exchangeToken = useCallback(async (params: URLSearchParams) => {
    if (!OPEN_COSMOS_AUTH_DOMAIN) {
      throw new Error('Open Cosmos authentication is not configured.');
    }

    const response = await fetch(new URL('/oauth/token', OPEN_COSMOS_AUTH_DOMAIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Open Cosmos token exchange failed.');
    }

    return (await response.json()) as TokenExchangeResponse;
  }, []);

  const storeSession = useCallback(
    async (workspaceName: string, nextSession: OpenCosmosSession) => {
      if (!nextSession.refreshToken) {
        throw new Error('Open Cosmos did not return a refresh token.');
      }
      if (nextSession.organizationId === undefined) {
        throw new Error('Open Cosmos organization ID is required.');
      }

      const sessionPayload = {
        accessToken: nextSession.accessToken,
        refreshToken: nextSession.refreshToken,
        expiresAt: nextSession.expiresAt,
        scope: nextSession.scope,
        tokenType: nextSession.tokenType,
        organization_id: nextSession.organizationId,
      };

      const response = await fetch(
        `/api/workspaces/${encodeURIComponent(workspaceName)}/open-cosmos/session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionPayload),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unable to store the Open Cosmos session.');
      }
    },
    [],
  );

  const refreshSession = useCallback(async () => {
    if (!session?.refreshToken || !OPEN_COSMOS_CLIENT_ID) {
      return undefined;
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: OPEN_COSMOS_CLIENT_ID,
      refresh_token: session.refreshToken,
    });

    const tokenResponse = await exchangeToken(params);
    const nextSession = {
      ...buildSession(tokenResponse, session.user),
      organizationId: session.organizationId,
    };
    if (!nextSession.refreshToken) {
      nextSession.refreshToken = session.refreshToken;
    }

    if (!activeWorkspace?.name) {
      throw new Error('Select a workspace before refreshing the Open Cosmos session.');
    }

    await storeSession(activeWorkspace.name, nextSession);
    setSession(nextSession);
    setError(undefined);

    return nextSession;
  }, [activeWorkspace?.name, exchangeToken, session, storeSession]);

  useEffect(() => {
    if (!hasConfiguration) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const oauthError = params.get('error');

    if (!code && !oauthError) return;
    if (callbackHandledRef.current) return;

    // OAuth authorization codes are single-use. StrictMode runs effects twice in development,
    // so mark this callback as handled before starting the asynchronous token exchange.
    callbackHandledRef.current = true;

    const handleCallback = async () => {
      setIsLoading(true);

      try {
        if (oauthError) {
          throw new Error(params.get('error_description') ?? 'Open Cosmos sign-in failed.');
        }

        if (!code) {
          throw new Error('Open Cosmos callback is missing the authorization code.');
        }

        const transaction = readTransaction();
        if (!transaction) {
          throw new Error('Open Cosmos sign-in session was not found.');
        }

        if (!OPEN_COSMOS_CLIENT_ID) {
          throw new Error('Open Cosmos OAuth configuration is incomplete.');
        }

        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: OPEN_COSMOS_CLIENT_ID,
          code,
          code_verifier: transaction.codeVerifier,
          redirect_uri: getRedirectUri(),
        });

        const tokenResponse = await exchangeToken(body);
        const nextSession = {
          ...buildSession(tokenResponse),
          organizationId: transaction.organizationId,
        };

        await storeSession(transaction.workspaceName, nextSession);
        setSession(nextSession);
        setError(undefined);
        clearTransaction();

        window.history.replaceState(
          {},
          document.title,
          transaction.returnTo || getDefaultReturnTo(),
        );
      } catch (callbackError) {
        clearTransaction();
        setSession(undefined);

        const message =
          callbackError instanceof Error ? callbackError.message : 'Open Cosmos sign-in failed.';
        setError(message);
        toast.error(message);
        window.history.replaceState({}, document.title, getDefaultReturnTo());
      } finally {
        setIsLoading(false);
      }
    };

    void handleCallback();
  }, [exchangeToken, hasConfiguration, storeSession]);

  const connect = useCallback(
    async (returnTo?: string, organizationId?: number) => {
      if (!hasConfiguration || !OPEN_COSMOS_AUTH_DOMAIN || !OPEN_COSMOS_CLIENT_ID) {
        const message = 'Open Cosmos authentication is not configured.';
        setError(message);
        toast.error(message);
        return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
        if (!activeWorkspace?.name) {
          throw new Error('Select a workspace before connecting Open Cosmos.');
        }
        if (organizationId === undefined || organizationId < 0) {
          throw new Error('Enter a valid Open Cosmos organization ID before connecting.');
        }

        const codeVerifier = generateRandomString(CODE_VERIFIER_BYTE_LENGTH);
        const codeChallenge = await createCodeChallenge(codeVerifier);

        persistTransaction({
          codeVerifier,
          returnTo: returnTo ?? getDefaultReturnTo(),
          workspaceName: activeWorkspace.name,
          organizationId,
        });

        const authorizeUrl = new URL('/authorize', OPEN_COSMOS_AUTH_DOMAIN);
        authorizeUrl.searchParams.set('response_type', 'code');
        authorizeUrl.searchParams.set('client_id', OPEN_COSMOS_CLIENT_ID);
        authorizeUrl.searchParams.set('redirect_uri', getRedirectUri());
        authorizeUrl.searchParams.set('scope', OPEN_COSMOS_SCOPE);
        authorizeUrl.searchParams.set('code_challenge', codeChallenge);
        authorizeUrl.searchParams.set('code_challenge_method', 'S256');

        if (OPEN_COSMOS_AUDIENCE) {
          authorizeUrl.searchParams.set('audience', OPEN_COSMOS_AUDIENCE);
        }

        window.location.assign(authorizeUrl.toString());
      } catch (connectError) {
        const message =
          connectError instanceof Error
            ? connectError.message
            : 'Unable to start Open Cosmos sign-in.';
        setError(message);
        setIsLoading(false);
        toast.error(message);
      }
    },
    [activeWorkspace?.name, hasConfiguration],
  );

  const disconnect = useCallback(() => {
    clearTransaction();
    setSession(undefined);
    setError(undefined);
  }, []);

  const getAccessToken = useCallback(async () => {
    if (isSessionActive(session)) {
      return session?.accessToken;
    }

    try {
      const refreshedSession = await refreshSession();
      return refreshedSession?.accessToken;
    } catch (refreshError) {
      disconnect();
      const message =
        refreshError instanceof Error
          ? refreshError.message
          : 'Open Cosmos session refresh failed.';
      setError(message);
      toast.error(message);
      return undefined;
    }
  }, [disconnect, refreshSession, session]);

  return (
    <OpenCosmosAuthContext.Provider
      value={{
        isConnected: Boolean(session?.accessToken),
        isLoading,
        hasConfiguration,
        error,
        user: session?.user,
        connect,
        disconnect,
        getAccessToken,
        ...initialState,
      }}
    >
      {children}
    </OpenCosmosAuthContext.Provider>
  );
};
