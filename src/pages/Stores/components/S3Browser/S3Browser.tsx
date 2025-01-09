import { createStorageBrowser, elementsDefault } from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/storage-browser-styles.css';
import './S3Browser.scss';

const { StorageBrowser } = createStorageBrowser({
  elements: elementsDefault,

  config: {
    listLocations: async () => {
      const resp = await fetch('/api/accounts');
      const data = await resp.json();

      return {
        locations: data.data.accounts[0].workspaces.map((workspace) => ({
          bucketName: workspace.stores[0].object[0].name,
          key: workspace.stores[0].object[0].path,
          region: 'eu-west-2',
          type: 'PREFIX',
          permission: 'READWRITE',
          scope: `s3://${workspace.stores[0].object[0].name}/${workspace.stores[0].object[0].path}/`,
        })),
      };
    },

    getLocationCredentials: async () => {
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

    region: 'eu-west-2',

    registerAuthListener: () => {},
  },
});

export default function S3Browser() {
  return <StorageBrowser />;
}
