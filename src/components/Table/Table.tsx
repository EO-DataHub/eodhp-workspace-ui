import React, { ReactElement, useState } from 'react';

import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

interface TableProps {
  maxRowsPerPage: number;
  headers: { internalName: string; externalName: string; icon?: string }[];
  // The keys in the rows need to match the internalNames in the headers
  rows: { [key: string]: string | ReactElement }[];
}

const Table = ({ maxRowsPerPage, headers, rows }: TableProps) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const renderTable = () => {
    const columns = {};
    headers.forEach((header) => {
      columns[header.internalName] = [
        constructTableHeader(header.externalName, header.icon || null),
      ];
    });

    const segment = rows.slice(
      maxRowsPerPage * selectedPage - maxRowsPerPage,
      maxRowsPerPage * selectedPage,
    );

    segment.forEach((entry) => {
      headers.forEach((header) => {
        columns[header.internalName].push(<div>{entry[header.internalName]}</div>);
      });
    });
    return (
      <div className="members-table">
        {Object.keys(columns).map((column) => {
          return (
            <div key={column} className="members-table-column">
              {columns[column]}
            </div>
          );
        })}
      </div>
    );
  };

  const constructTableHeader = (name: string, iconSrc?: string) => {
    return (
      <div className="members-table-header">
        {iconSrc ? <img alt={`${name} icon`} src={iconSrc} /> : null}
        {name}
      </div>
    );
  };

  return (
    <div>
      {renderTable()}
      <ResponsivePagination
        className="pagination members-pagination"
        current={selectedPage}
        total={Math.ceil(rows.length / maxRowsPerPage)}
        onPageChange={(e) => setSelectedPage(e)}
      />
    </div>
  );
};

export default Table;
