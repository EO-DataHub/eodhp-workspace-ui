import React from 'react';
import './styles.scss';

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
        internalName: 'accessPointId',
        externalName: 'Access point Id',
      },
      {
        internalName: 'mountPoint',
        externalName: 'Mount point',
      },
    ];
    const rows = [];

    blocks.map((block) => {
      rows.push({
        name: block.name,
        accessPointId: block.access_point_id,
        mountPoint: block.mount_point,
      });
    });
    return <Table headers={headers} maxRowsPerPage={10} rows={rows} />;
  };

  return (
    <div className="block-store">{activeWorkspace.stores.map((store) => renderBlocks(store))}</div>
  );
};

export default BlockStore;
