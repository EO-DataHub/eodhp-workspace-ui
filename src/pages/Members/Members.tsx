/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import './styles.scss';

import calendarIcon from '@/assets/icons/calendar.svg';
import deleteIcon from '@/assets/icons/Delete.svg';
import emailIcon from '@/assets/icons/email.svg';
import memberGroupIcon from '@/assets/icons/member-group.svg';
import memberIcon from '@/assets/icons/members.svg';
import Help from '@/components/Table/Components/Help/Help';
import Table from '@/components/Table/Table';
import MemberButtons from '@/components/TopBar/components/MemberButtons/MemberButtons';
import { useWorkspace } from '@/hooks/useWorkspace';
import { deleteMember } from '@/services/members/members';
import { Member } from '@/services/members/types';

const Members = () => {
  const { members, workspaceOwner, activeWorkspace, getAndSetMembers, isWorkspaceOwner } =
    useWorkspace();

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
    if (!isWorkspaceOwner) return '';
    if (role === 'Admin') return '';
    return (
      <div
        onClick={async () => {
          try {
            await deleteMember(activeWorkspace.name, member.username);
            await getAndSetMembers();
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <img alt="delete" className="table-column-delete" src={deleteIcon} />
      </div>
    );
  };

  const renderTable = () => {
    if (!members) return;
    const rows = members.map((member) => {
      const role = workspaceOwner === member.username ? 'Admin' : 'Member';

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
            help: (
              <Help
                content={
                  'Admin:  \n' +
                  'The admin is the owner of the workspace. They are able to add and remove members from the workspace. \n \n' +
                  'Member: \n' +
                  'Members have access to the workspace but are unable to add or remove members.'
                }
                type="Tooltip"
              />
            ),
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
