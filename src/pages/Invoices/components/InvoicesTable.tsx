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
    internalName: 'event_start',
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
  const { getSKUPrice, getSKUUnit, skus, selectedMonth, breakdown, setPricingValid } =
    useInvoices();

  let copy = [...skus];
  if (breakdown === 'month' && !isNaN(selectedMonth)) {
    const currentYear = new Date().getFullYear();

    copy = copy.filter((sku) => {
      const date = new Date(sku.event_start);
      const monthInt = date.getMonth();
      const yearInt = date.getFullYear();
      return yearInt === currentYear && monthInt === selectedMonth;
    });
  }

  const rows = copy.map((sku) => {
    const copy = { ...sku };
    copy.event_start = new Date(sku.event_start).toDateString();
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
      setPricingValid(false);
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
