import React from 'react';

import Table from '@/components/Table/Table';
import { useInvoices } from '@/hooks/useInvoices';

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
  {
    internalName: 'unit',
    externalName: 'Unit',
  },
];

const InvoicesTable = () => {
  const { getSKUPrice, getSKUUnit, skus, selectedMonth } = useInvoices();

  let copy = [...skus];
  if (!isNaN(selectedMonth)) {
    const currentYear = new Date().getFullYear();

    copy = copy.filter((sku) => {
      const date = new Date(sku.event_end);
      const monthInt = date.getMonth();
      const yearInt = date.getFullYear();
      return yearInt === currentYear && monthInt === selectedMonth;
    });
  }

  const rows = copy.map((sku) => {
    const copy = { ...sku };
    copy.event_end = new Date(sku.event_end).toDateString();
    copy.quantity = parseFloat(copy.quantity.toPrecision(3));
    const skuPrice = getSKUPrice(sku.item);
    const unit = getSKUUnit(sku.item);
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
    return { ...copy, price, unit };
  });

  return (
    <div style={{ width: '100%' }}>
      {<Table headers={headers} maxRowsPerPage={10} rows={rows} />}
    </div>
  );
};

export default InvoicesTable;
