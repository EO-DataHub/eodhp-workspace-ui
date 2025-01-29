import React from 'react';
import './styles.scss';

import { Store } from '@/context/WorkspaceContext/types';
import { useWorkspace } from '@/hooks/useWorkspace';

const BlockStore = () => {
  const { activeWorkspace } = useWorkspace();

  const renderBlocks = (store: Store) => {
    const blocks = store.block;

    return blocks.map((block) => {
      return (
        <div key={block.access_point_id} className="block-store__block">
          <h2>{block.name}</h2>
          <div className="block-store__block-rows">
            {renderBlockRow('Access point Id', block.access_point_id)}
            {renderBlockRow('Fs Id', block.fs_id)}
            {renderBlockRow('Store Id', block.store_id)}
          </div>
        </div>
      );
    });
  };

  const renderBlockRow = (label: string, value: string) => {
    return (
      <div className="block-store__block-row">
        <div className="block-store__block-row__label">{label}</div>
        <div className="block-store__block-row__value">{value}</div>
      </div>
    );
  };

  return (
    <div className="block-store">{activeWorkspace.stores.map((store) => renderBlocks(store))}</div>
  );
};

export default BlockStore;
