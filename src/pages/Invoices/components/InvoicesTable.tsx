import React, { useEffect, useState } from 'react';

import Table from '@/components/Table/Table';
import { SKU } from '@/context/WorkspaceContext/types';
import { useInvoices } from '@/hooks/useInvoices';
import { useWorkspace } from '@/hooks/useWorkspace';

const headers = [
  {
    internalName: 'item',
    externalName: 'Item',
  },
  {
    internalName: 'quantity',
    externalName: 'Quantity',
  },
  {
    internalName: 'event_end',
    externalName: 'Issue date',
  },
];

const InvoicesTable = () => {
  const { skus } = useWorkspace();

  const [rows, setRows] = useState<SKU[]>(() =>
    skus.map((sku) => {
      const copy = { ...sku };
      copy.event_end = new Date(sku.event_end).toDateString();
      return copy;
    }),
  );

  useEffect(() => {}, [skus]);

  return (
    <div style={{ width: '100%' }}>
      {<Table headers={headers} maxRowsPerPage={10} rows={rows} />}
    </div>
  );
};

export default InvoicesTable;
