import React from 'react';

import DataTable, { TableColumn } from 'react-data-table-component';

interface Header {
  internalName: string;
  externalName: string;
  icon?: string;
  help?: React.ReactElement;
}

interface TableProps<T extends Record<string, unknown>> {
  maxRowsPerPage: number;
  headers: Header[];
  rows: T[];
}

function Table<T extends Record<string, unknown>>({
  maxRowsPerPage,
  headers,
  rows,
}: TableProps<T>) {
  if (!rows?.length) return null;

  const columns: TableColumn<T>[] = headers.map((header) => ({
    name: (
      <div className="table-header">
        {header.icon && <img alt={`${header.externalName} icon`} src={header.icon} />}
        {header.externalName}
        {header.help}
      </div>
    ),
    cell: (row) => <div>{row[header.internalName] as React.ReactNode}</div>,
    sortable: true,
    wrap: true,
  }));

  return (
    <DataTable
      highlightOnHover
      pagination
      persistTableHead
      responsive
      className="members"
      columns={columns}
      data={rows}
      paginationPerPage={maxRowsPerPage}
    />
  );
}

export default Table;
