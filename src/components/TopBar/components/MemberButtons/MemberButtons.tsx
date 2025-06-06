import React, { useState } from 'react';
import '@/styles/main.scss';
import './styles.scss';

import { IoMdPersonAdd } from 'react-icons/io';
import { MdPersonRemove } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';

import { Button } from '@/components/Button/Button';
import { Field } from '@/components/Form/Fields/types';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import { useWorkspace } from '@/hooks/useWorkspace';
import { addMember } from '@/services/members/members';
import { deleteWorkspace } from '@/services/workspaces/workspaces';

import DeleteRow from '../DeleteRow/DeleteRow';

const ADD_MEMBER_FIELDS: Field[] = [
  {
    externalName: 'Username',
    internalName: 'username',
    value: '',
    type: 'string',
  },
];

interface MemberButtonsProps {
  hideRemoveButton?: boolean;
}

const MemberButtons = ({ hideRemoveButton }: MemberButtonsProps) => {
  const { activeWorkspace, members, getAndSetMembers } = useWorkspace();

  const [modal, setModal] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<'add' | 'remove' | 'delete_workspace'>();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const setMessage = (message: string) => {
    toast(message);
  };

  const initialFormData = () => {
    const data = {};
    ADD_MEMBER_FIELDS.forEach((field) => {
      data[field.internalName] = field.value;
    });
    return data;
  };

  const [formData, setFormData] = useState<{ [key: string]: string }>(initialFormData);

  const getModalDescription = () => {
    return (
      <div>
        <div>
          Here you can add new members to your workspace using their username. Your username can be
          found by clicking on your profile icon on the far right of the header. You can find out
          more{' '}
          <a href="/docs/account-setup/workspaces/member-management/" target="_blank">
            here
          </a>
        </div>
      </div>
    );
  };

  const renderModalContent = () => {
    if (modalStatus === 'add') {
      return (
        <div className="top-bar-form-container">
          <Form
            description={getModalDescription()}
            fieldData={ADD_MEMBER_FIELDS}
            header={'Add member'}
            onChange={(data) => setFormData(data)}
          />
          <ul className="top-bar-form-container__errors">
            {formErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      );
    }
    if (modalStatus === 'remove') {
      return (
        <div>
          {members.map((member) => {
            return (
              <DeleteRow
                key={member.id}
                member={member}
                onDeleteSuccess={async () => await getAndSetMembers()}
              />
            );
          })}
        </div>
      );
    }
    if (modalStatus === 'delete_workspace') {
      return (
        <div className="delete-workspace-confirmation">
          <p>
            Deleting this workspace will <strong>permanently remove all associated data</strong>,
            including members and resources. This action cannot be undone.
          </p>
          <label>
            <input
              checked={confirmDelete}
              type="checkbox"
              onChange={(e) => setConfirmDelete(e.target.checked)}
            />{' '}
            I understand that this action will delete everything permanently.
          </label>
          {formErrors.length > 0 && (
            <ul className="top-bar-form-container__errors">
              {formErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  };

  const validateAddMember = () => {
    const errors = [];
    if (!formData['username']) {
      errors.push("Please enter the user's Username");
    }
    setFormErrors(errors);
    return !errors.length;
  };

  return (
    <>
      {modal && (
        <Modal
          cancelText="Close"
          content={renderModalContent()}
          //hideSubmit={modalStatus === 'add' ? false : true}
          onCancel={() => {
            setModal(false);
            setFormData(initialFormData);
            setFormErrors([]);
            setConfirmDelete(false);
          }}
          onSubmit={async () => {
            if (modalStatus === 'add') {
              if (!validateAddMember()) return;
              try {
                await addMember(activeWorkspace.name, formData['username']);
                await getAndSetMembers();
                setFormData(initialFormData());
                setModal(false);
              } catch (error) {
                setFormErrors(['Error adding member']);
                setMessage('Error adding member');
              }
            } else if (modalStatus === 'delete_workspace') {
              if (!confirmDelete) {
                setFormErrors(['You must confirm deletion by ticking the checkbox.']);
                return;
              }
              try {
                await deleteWorkspace(activeWorkspace.name);
                setMessage('Workspace deleted successfully.');
                setModal(false);
                // You can redirect user or refresh list depending on the app flow
              } catch (error) {
                setFormErrors(['Error deleting workspace']);
                setMessage('Error deleting workspace');
              }
            }
          }}
          // onSubmit={async () => {
          //   if (!validateAddMember()) return;
          //   try {
          //     await addMember(activeWorkspace.name, formData['username']);
          //     await getAndSetMembers();
          //     setFormData(initialFormData());
          //     setModal(false);
          //   } catch (error) {
          //     setFormErrors(['Error adding member']);
          //     setMessage('Error adding member');
          //   }
          // }}
        />
      )}
      <div className="member-buttons">
        <Button
          icon={<IoMdPersonAdd />}
          onClick={() => {
            setModalStatus('add');
            setModal(true);
          }}
        >
          Add Member
        </Button>
        {hideRemoveButton ? null : (
          <Button
            icon={<MdPersonRemove />}
            onClick={() => {
              setModalStatus('remove');
              setModal(true);
            }}
          >
            Remove Member
          </Button>
        )}
        {hideRemoveButton ? null : (
          <Button
            icon={<MdPersonRemove />}
            onClick={() => {
              setModalStatus('delete_workspace');
              setModal(true);
            }}
          >
            Delete Workspace
          </Button>
        )}
        <ToastContainer hideProgressBar position="bottom-left" theme="light" />
      </div>
    </>
  );
};

export default MemberButtons;
