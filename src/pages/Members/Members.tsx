import React from 'react';
import './styles.scss';

import memberGroupIcon from '@/assets/icons/member-group.svg';
import MemberButtons from '@/components/TopBar/components/MemberButtons/MemberButtons';
import { useWorkspace } from '@/hooks/useWorkspace';

const Members = () => {
  const { members, isWorkspaceOwner } = useWorkspace();

  const renderHeader = () => {
    return (
      <div className="members-header">
        <h2>Members</h2>
        <div className="members-header-paragraph">
          <img alt="member icon" src={memberGroupIcon} />
          <span>Members area</span> is dedicated to managing the members associated to this
          workspace.
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    return <MemberButtons />;
  };

  const constructTableHeader = (name: string) => {
    return <div className="members-table-header">{name}</div>;
  };

  const renderTable = () => {
    const columns = {
      name: [constructTableHeader('Name')],
      email: [constructTableHeader('Email')],
      role: [constructTableHeader('Role')],
    };
    members.forEach((member) => {
      columns.email.push(<div>{member.email}</div>);
      columns.name.push(<div>{`${member.firstName} ${member.lastName}`}</div>);
      const role = isWorkspaceOwner ? 'Admin' : 'Member';
      columns.role.push(<div>{role}</div>);
    });
    return (
      <div className="members-table">
        <div className="members-table-column">{columns.name}</div>
        <div className="members-table-column">{columns.email}</div>
        <div className="members-table-column">{columns.role}</div>
      </div>
    );
  };

  return (
    <div className="content-page">
      {renderHeader()}
      {renderButtons()}
      {renderTable()}
    </div>
  );
};

export default Members;
