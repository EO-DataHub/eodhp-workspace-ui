import { createStorageBrowser, elementsDefault } from '@aws-amplify/ui-react-storage/browser';

import '@aws-amplify/ui-react-storage/storage-browser-styles.css';
import './S3Browser.scss';
import { Workspace } from '@/context/WorkspaceContext/types';
import { useWorkspace } from '@/hooks/useWorkspace';

const createStorageBrowserWithWorkspace = (activeWorkspace: Workspace) => {
  const locations = [];
  activeWorkspace.stores.forEach((store) => {
    store.object.forEach((object) => {
      locations.push({
        bucketName: object.name,
        key: object.path,
        region: 'eu-west-2',
        type: 'PREFIX',
        permission: 'READWRITE',
        scope: `s3://${object.name}/${object.path}/`,
      });
    });
  });

  return createStorageBrowser({
    elements: elementsDefault,

    config: {
      listLocations: async () => {
        console.log('activeWorkspace', activeWorkspace);

        return {
          locations,
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
};

export default function S3Browser() {
  const { activeWorkspace } = useWorkspace();
  const { StorageBrowser } = createStorageBrowserWithWorkspace(activeWorkspace);

  return <StorageBrowser />;
}
