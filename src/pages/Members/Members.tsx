import React from 'react';

import { MdDelete } from 'react-icons/md';
import './styles.scss';

import memberGroupIcon from '@/assets/icons/member-group.svg';
import Help from '@/components/Table/Components/Help/Help';
import Table from '@/components/Table/Table';
import MemberButtons from '@/components/TopBar/components/MemberButtons/MemberButtons';
import { useWorkspace } from '@/hooks/useWorkspace';
import { deleteMember } from '@/services/members/members';
import { Member } from '@/services/members/types';

const Members = () => {
  const { members, workspaceOwner, activeWorkspace, getAndSetMembers, isWorkspaceOwner } =
    useWorkspace();

  const handleDelete = async (member: Member) => {
    try {
      await deleteMember(activeWorkspace.name, member.username);
      await getAndSetMembers();
    } catch (error) {
      console.error(error);
    }
  };

  const headers = [
    { externalName: 'Username', internalName: 'username' },
    { externalName: 'Name', internalName: 'name' },
    { externalName: 'Email', internalName: 'email' },
    {
      externalName: 'Role',
      internalName: 'role',
      help: (
        <Help
          content={
            'Admin:\nThe admin is the owner of the workspace. They can add and remove members.\n\nMember:\nMembers can view the workspace but not manage members.'
          }
          type="Tooltip"
        />
      ),
    },
    { externalName: '', internalName: 'delete' },
  ];

  const getDelete = (role, member) => {
    if (!isWorkspaceOwner) return null;
    if (role === 'Admin') return null;
    return (
      <button
        aria-label={`Delete ${member.username}`}
        className="table-column-delete-button"
        style={{ all: 'unset', cursor: 'pointer' }}
        onClick={() => handleDelete(member)}
      >
        <MdDelete size={22} />
      </button>
    );
  };

  const rows =
    members?.map((member) => {
      const role = workspaceOwner === member.username ? 'Admin' : 'Member';

      return {
        username: member.username,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        role,
        delete: getDelete(role, member),
      };
    }) ?? [];

  return (
    <div className="content-page">
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

      <MemberButtons hideRemoveButton />

      <Table headers={headers} maxRowsPerPage={10} rows={rows} />
    </div>
  );
};

export default Members;
