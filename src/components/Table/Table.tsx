import React, { ReactElement, useState } from 'react';
import './styles.scss';

import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

interface TableProps {
  maxRowsPerPage: number;
  headers: { internalName: string; externalName: string; icon?: string; help?: ReactElement }[];
  // The keys in the rows need to match the internalNames in the headers
  rows: { [key: string]: string | ReactElement }[];
}

const Table = ({ maxRowsPerPage, headers, rows }: TableProps) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const renderTable = () => {
    const columns = {};
    headers.forEach((header) => {
      columns[header.internalName] = [
        constructTableHeader(header.externalName, header.icon || null, header.help || null),
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
      <div className="table">
        {Object.keys(columns).map((column) => {
          return (
            <div key={column} className="table-column">
              {columns[column]}
            </div>
          );
        })}
      </div>
    );
  };

  const constructTableHeader = (name: string, iconSrc?: string, help?: ReactElement) => {
    return (
      <div className="table-header">
        {iconSrc ? <img alt={`${name} icon`} src={iconSrc} /> : null}
        {name}
        {help ? help : null}
      </div>
    );
  };

  if (!rows) return;
  if (!rows.length) return;
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
