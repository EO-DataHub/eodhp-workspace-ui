import React, { useState } from 'react';
import './styles.scss';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Account, Workspace } from '@/typings/global';

interface ExpandableProps {
  data: Account | Workspace;
  title: string;
  depth?: number;
}

const Expandable = ({ data, title, depth = 0 }: ExpandableProps) => {
  const [expanded, setExpanded] = useState<boolean>();

  const renderData = () => {
    return (
      <div>
        {Object.entries(data).map(([key, value]) => {
          if (Array.isArray(value)) {
            return (
              <div key={key}>
                <h3>{key}</h3>
                {value.map((entry) => {
                  return (
                    <Expandable
                      key={entry.id || key}
                      data={entry}
                      depth={depth + 1}
                      title={entry.name || key}
                    />
                  );
                })}
              </div>
            );
          }
          return (
            <div key={key} className="expandable-item">
              <div className="expandable-item__key">{key}</div>
              <div className="expandable-item__value">{value}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div style={{ marginLeft: 10 * depth }}>
      {
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className="expandable-title-container" onClick={(e) => handleClick(e)}>
          <h3>{title}</h3>
          <FontAwesomeIcon
            className={`expandable-title-chevron ${expanded ? 'expandable-title-chevron-active' : ''}`}
            icon={faChevronRight}
          />
        </div>
      }
      {expanded && renderData()}
    </div>
  );
};

export default Expandable;
