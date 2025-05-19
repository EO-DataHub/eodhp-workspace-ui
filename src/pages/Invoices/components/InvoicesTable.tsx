/* eslint-disable @typescript-eslint/no-unused-vars */
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
  {
    internalName: 'price',
    externalName: 'Price (£)',
  },
];

const InvoicesTable = () => {
  const { skus } = useWorkspace();
  const { getSKUPrice } = useInvoices();

  const rows = skus.map((sku) => {
    const copy = { ...sku };
    copy.event_end = new Date(sku.event_end).toDateString();
    copy.quantity = parseFloat(copy.quantity.toPrecision(3));
    const skuPrice = getSKUPrice(sku.item);
    let price: string | number;
    const sig3 = new Intl.NumberFormat(undefined, {
      minimumSignificantDigits: 3,
      maximumSignificantDigits: 3,
      useGrouping: false,
    });
    if (skuPrice) {
      const raw = skuPrice.price * sku.quantity;
      price = sig3.format(raw);
    } else {
      price = 'Missing pricing';
    }
    return { ...copy, price };
  });

  return (
    <div style={{ width: '100%' }}>
      {<Table headers={headers} maxRowsPerPage={10} rows={rows} />}
    </div>
  );
};

export default InvoicesTable;
