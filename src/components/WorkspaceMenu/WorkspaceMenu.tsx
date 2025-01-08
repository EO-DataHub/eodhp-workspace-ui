/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';

import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

import ComingSoon from './ComingSoon';
import { NavItem, navItems } from './navigation';
import './WorkspaceMenu.scss';

type WorkspaceMenuProps = {
  setContent: (content: React.ReactNode) => void;
};

export const WorkspaceMenu = ({ setContent }: WorkspaceMenuProps) => {
  const [selectedItemPath, setSelectedItemPath] = useState<string[]>([]);
  const [expandedSet, setExpandedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (navItems.length > 0) {
      setSelectedItemPath([navItems[0].label]);
      setContent(navItems[0].content || <ComingSoon title={navItems[0].label} />);
    }
  }, [setContent]);

  const handleToggle = (label: string) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const renderNavItems = (items: NavItem[], parentPath: string[] = []) => {
    return items.map((item) => {
      const currentPath = [...parentPath, item.label];
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isExpanded = hasSubItems && expandedSet.has(item.label);

      return (
        <div
          key={item.label}
          className={`workspace-menu__item ${parentPath.length > 0 ? 'workspace-menu__subitem' : ''}`}
        >
          <div
            className={`workspace-menu__item-header ${selectedItemPath.join('/') === currentPath.join('/') ? 'active' : ''}`}
            onClick={() => {
              setSelectedItemPath(currentPath);
              if (hasSubItems) {
                handleToggle(item.label);
              } else {
                setContent(item.content || <ComingSoon title={item.label} />);
              }
            }}
          >
            {item.icon && (
              <img alt={item.label} className="workspace-menu__item-icon" src={item.icon} />
            )}
            <span className="workspace-menu__item-label">{item.label}</span>
            {hasSubItems && (
              <span className="workspace-menu__item-chevron">
                {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            )}
          </div>
          {hasSubItems && isExpanded && (
            <div className="workspace-menu__subitems">
              {renderNavItems(item.subItems!, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="workspace-menu">
      <div className="workspace-menu__sidebar">{renderNavItems(navItems)}</div>
    </div>
  );
};
