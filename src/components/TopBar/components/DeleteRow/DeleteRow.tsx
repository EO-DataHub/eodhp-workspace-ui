/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import './styles.scss';

import { ToastContainer, toast } from 'react-toastify';

import { MdDelete } from 'react-icons/md';

import { ProfileTile } from '@/components/ProfileTile/ProfileTile';
import { useWorkspace } from '@/hooks/useWorkspace';
import { deleteMember } from '@/services/members/members';
import { Member } from '@/services/members/types';

interface DeleteRowProps {
  member: Member;
  onDeleteSuccess: () => void;
}

const setMessage = (message: string) => {
    toast(message);
  };

const DeleteRow = ({ member, onDeleteSuccess }: DeleteRowProps) => {
  const { activeWorkspace } = useWorkspace();
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const renderDeleteContent = () => {
    if (!showWarning) {
      return (
        <MdDelete
          onClick={async () => {
            setShowWarning(true);
          }}
        />
      );
    }
    return (
      <div className="delete-row__warning">
        <div
          className="delete-row__warning-yes"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await deleteMember(activeWorkspace.name, member.username);
              await onDeleteSuccess();
            } catch (error) {
              console.error(error);
              console.error(`Error deleting ${member.username}`);
              setMessage(`Error deleting ${member.username}`);
            }
          }}
        >
          Remove
        </div>
        <ToastContainer hideProgressBar position="bottom-left" theme="light" />
        <div
          className="delete-row__warning-no"
          onClick={(e) => {
            e.stopPropagation();
            setShowWarning(false);
          }}
        >
          Cancel
        </div>
      </div>
    );
  };

  return (
    <div key={member.id} className="top-bar-remove__row">
      <ProfileTile username={member.username} />
      <span>{member.username}</span>
      <div className="top-bar-remove__row-delete">{renderDeleteContent()}</div>
    </div>
  );
};

export default DeleteRow;
