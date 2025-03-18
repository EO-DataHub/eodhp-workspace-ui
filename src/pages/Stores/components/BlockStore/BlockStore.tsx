import React from 'react';
import './styles.scss';

import Help from '@/components/Table/Components/Help/Help';
import Table from '@/components/Table/Table';
import { Store } from '@/context/WorkspaceContext/types';
import { useWorkspace } from '@/hooks/useWorkspace';

const BlockStore = () => {
  const { activeWorkspace } = useWorkspace();

  const renderBlocks = (store: Store) => {
    const blocks = store.block;

    const headers = [
      {
        internalName: 'name',
        externalName: 'Name',
      },
      {
        internalName: 'mountPoint',
        help: <Help content="Location in notebooks and workflows" type="Tooltip" />,
        externalName: 'Mount point',
      },
    ];
    const rows = [];

    blocks.map((block) => {
      rows.push({
        name: block.name,
        mountPoint: block.mount_point,
      });
    });
    return <Table headers={headers} maxRowsPerPage={10} rows={rows} />;
  };

  if (!activeWorkspace) return;
  if (!activeWorkspace.stores) return;
  return (
    <div className="block-store">
      {activeWorkspace?.stores?.map((store) => renderBlocks(store))}
    </div>
  );
};

export default BlockStore;
