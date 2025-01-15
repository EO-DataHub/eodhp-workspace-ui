import { createStorageBrowser, elementsDefault } from '@aws-amplify/ui-react-storage/browser';

import '@aws-amplify/ui-react-storage/storage-browser-styles.css';
import './S3Browser.scss';
import { Workspace } from '@/context/WorkspaceContext/types';
import { useWorkspace } from '@/hooks/useWorkspace';

const createStorageBrowserWithWorkspace = (activeWorkspace: Workspace) =>
  createStorageBrowser({
    elements: elementsDefault,

    config: {
      listLocations: async () => {
        console.log('activeWorkspace', activeWorkspace);

        return {
          locations: activeWorkspace.stores.map((store) => ({
            bucketName: store.object[0].name,
            key: store.object[0].path,
            region: 'eu-west-2',
            type: 'PREFIX',
            permission: 'READWRITE',
            scope: `s3://${store.object[0].name}/${store.object[0].path}/`,
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
  const { activeWorkspace } = useWorkspace();
  const { StorageBrowser } = createStorageBrowserWithWorkspace(activeWorkspace);

  return <StorageBrowser />;
}
