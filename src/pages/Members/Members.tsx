/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import './styles.scss';

import calendarIcon from '@/assets/icons/calendar.svg';
import deleteIcon from '@/assets/icons/Delete.svg';
import emailIcon from '@/assets/icons/email.svg';
import memberGroupIcon from '@/assets/icons/member-group.svg';
import memberIcon from '@/assets/icons/members.svg';
import Table from '@/components/Table/Table';
import MemberButtons from '@/components/TopBar/components/MemberButtons/MemberButtons';
import { useWorkspace } from '@/hooks/useWorkspace';
import { deleteMember } from '@/services/members/members';
import { Member } from '@/services/members/types';

const Members = () => {
  const { members, workspaceOwner, activeWorkspace, getAndSetMembers } = useWorkspace();

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

  const renderDelete = (role: 'Admin' | 'Member', member: Member) => {
    if (role === 'Admin') return '';
    return (
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
      </div>
    );
  };

  const renderTable = () => {
    const rows = members.map((member) => {
      const role = workspaceOwner === member.id ? 'Admin' : 'Member';

      return {
        email: member.email,
        name: `${member.firstName} ${member.lastName}`,
        role: role,
        date: new Date().toDateString(),
        delete: renderDelete(role, member),
      };
    });

    return (
      <Table
        headers={[
          {
            externalName: 'Email',
            internalName: 'email',
            icon: emailIcon,
          },
          {
            externalName: 'Name',
            internalName: 'name',
            icon: memberIcon,
          },
          {
            externalName: 'Role',
            internalName: 'role',
          },
          {
            externalName: 'Date added',
            internalName: 'date',
            icon: calendarIcon,
          },
          {
            externalName: '',
            internalName: 'delete',
          },
        ]}
        maxRowsPerPage={10}
        rows={rows}
      />
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
