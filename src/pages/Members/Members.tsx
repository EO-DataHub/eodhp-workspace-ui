/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';

import './styles.scss';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

import calendarIcon from '@/assets/icons/calendar.svg';
import deleteIcon from '@/assets/icons/Delete.svg';
import emailIcon from '@/assets/icons/email.svg';
import memberGroupIcon from '@/assets/icons/member-group.svg';
import memberIcon from '@/assets/icons/members.svg';
import MemberButtons from '@/components/TopBar/components/MemberButtons/MemberButtons';
import { useWorkspace } from '@/hooks/useWorkspace';
import { deleteMember } from '@/services/members/members';

const MAX_MEMBERS_PER_PAGE = 10;

const Members = () => {
  const { members, workspaceOwner, activeWorkspace, getAndSetMembers } = useWorkspace();
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Members</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={memberGroupIcon} />
          <div className="header-right-text">
            <span className="header-right-title">Members area</span> is dedicated to managing the
            members associated to this workspace.
          </div>
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    return <MemberButtons hideRemoveButton />;
  };

  const constructTableHeader = (name: string, iconSrc?: string) => {
    return (
      <div className="members-table-header">
        {iconSrc ? <img alt={`${name} icon`} src={iconSrc} /> : null}
        {name}
      </div>
    );
  };

  const renderTable = () => {
    const columns = {
      name: [constructTableHeader('Name', memberIcon)],
      email: [constructTableHeader('Email', emailIcon)],
      role: [constructTableHeader('Role')],
      date: [constructTableHeader('Date added', calendarIcon)],
      delete: [constructTableHeader('Delete')],
    };

    const membersSegment = members.slice(
      MAX_MEMBERS_PER_PAGE * selectedPage - MAX_MEMBERS_PER_PAGE,
      MAX_MEMBERS_PER_PAGE * selectedPage,
    );

    membersSegment.forEach((member) => {
      columns.email.push(<div>{member.email}</div>);
      columns.name.push(<div>{`${member.firstName} ${member.lastName}`}</div>);
      const role = workspaceOwner === member.id ? 'Admin' : 'Member';
      columns.role.push(<div>{role}</div>);
      columns.date.push(<div>{new Date().toDateString()}</div>);
      if (role === 'Member') {
        columns.delete.push(
          <div
            onClick={async () => {
              try {
                await deleteMember(activeWorkspace.name, member.id);
                await getAndSetMembers();
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <img alt="delete" className="members-table-column-delete" src={deleteIcon} />
          </div>,
        );
      }
    });
    return (
      <div className="members-table">
        <div className="members-table-column">{columns.name}</div>
        <div className="members-table-column">{columns.email}</div>
        <div className="members-table-column">{columns.role}</div>
        <div className="members-table-column">{columns.date}</div>
        <div className="members-table-column">{columns.delete}</div>
      </div>
    );
  };

  return (
    <div className="content-page">
      {renderHeader()}
      {renderButtons()}
      {renderTable()}
      <ResponsivePagination
        className="pagination members-pagination"
        current={selectedPage}
        total={Math.ceil(members.length / MAX_MEMBERS_PER_PAGE)}
        onPageChange={(e) => setSelectedPage(e)}
      />
    </div>
  );
};

export default Members;
