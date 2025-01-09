import { createStorageBrowser, elementsDefault } from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/storage-browser-styles.css';
import './S3Browser.scss';

const { StorageBrowser } = createStorageBrowser({
  // Optional: provide custom elements or keep the default
  elements: elementsDefault,

  config: {
    /**
     * 1) listLocations():
     *    Return the S3 buckets and/or prefixes (i.e. “locations”) that
     *    the user can see in the left-hand side UI.
     *    For example, you might want to show only one bucket,
     *    or multiple buckets if your app logic supports that.
     */
    listLocations: async () => {
      // Hard-code or dynamically fetch the user’s buckets/prefixes if needed.
      // nextToken and pageSize are available in `input` for pagination.
      return {
        locations: [
          {
            bucketName: 'workspaces-eodhp-dev3',
            key: 'sgillies-tpzuk',
            region: 'eu-west-2',
            type: 'PREFIX',
            permission: 'READWRITE',
            scope: 's3://workspaces-eodhp-dev3/sgillies-tpzuk//', // theres a bug in the library that requires both the trailing slashes
          },
        ],
      };
    },

    /**
     * 2) getLocationCredentials():
     *    Called whenever the user attempts to browse or upload/download
     *    in a particular “location.” We must return temporary S3 credentials.
     */
    getLocationCredentials: async () => {
      // scope => e.g. "s3://YOUR_BUCKET_NAME/"
      // permission => e.g. "READWRITE"

      // Call your /api endpoint to get fresh S3 credentials
      const resp = await fetch('/api/workspaces/s3/credentials');
      const data = await resp.json();

      return {
        credentials: {
          accessKeyId: data.accessKeyId,
          secretAccessKey: data.secretAccessKey,
          sessionToken: data.sessionToken,
          expiration: new Date(data.expiration),
        },
      };
    },

    /**
     * 3) region:
     *    The AWS region where your bucket is located.
     */
    region: 'eu-west-2',

    /**
     * 4) registerAuthListener():
     *    Called if you need to watch changes in user auth state.
     *    If you don’t need this, you can leave it empty.
     */
    registerAuthListener: () => {
      // e.g. on sign-out from your custom auth, call onStateChange('signedout')
    },
  },
});

/**
 * Export a simple functional component that renders the Storage Browser.
 */
export default function S3Browser() {
  return <StorageBrowser />;
}
