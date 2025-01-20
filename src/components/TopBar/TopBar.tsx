/* eslint-disable react-hooks/exhaustive-deps */
import './TopBar.scss';
import { useEffect, useState } from 'react';

import { IoMdPersonAdd } from 'react-icons/io';
import { MdPersonRemove } from 'react-icons/md';

import { useWorkspace } from '@/hooks/useWorkspace';
import { addMember, getMembers } from '@/services/members/members';
import { Member } from '@/services/members/types';

import DeleteRow from './components/DeleteRow/DeleteRow';
import { WorkspaceMembers } from './components/WorkspaceMembers/WorkspaceMembers';
import { Button } from '../Button/Button';
import { Field } from '../Form/Fields/types';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';
import { ProfileTile } from '../ProfileTile/ProfileTile';

const ADD_MEMBER_FIELDS: Field[] = [
  {
    externalName: 'Id',
    internalName: 'id',
    value: '',
    type: 'string',
  },
  {
    externalName: 'Username',
    internalName: 'username',
    value: '',
    type: 'string',
  },
  {
    externalName: 'First name',
    internalName: 'firstName',
    value: '',
    type: 'string',
  },
  {
    externalName: 'Last name',
    internalName: 'lastName',
    value: '',
    type: 'string',
  },
  {
    externalName: 'Email',
    internalName: 'email',
    value: '',
    type: 'string',
  },
];

export const TopBar = () => {
  const { activeWorkspace, isWorkspaceOwner } = useWorkspace();
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [members, setMembers] = useState<Member[]>();
  const [modal, setModal] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<'add' | 'remove'>();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const initialFormData = () => {
    const data = {};
    ADD_MEMBER_FIELDS.forEach((field) => {
      data[field.internalName] = field.value;
    });
    return data;
  };

  const [formData, setFormData] = useState<{ [key: string]: string }>(initialFormData);

  useEffect(() => {
    const workspace = document.getElementById('workspace');
    if (workspace) {
      if (workspace.classList.contains('light-theme') && !isLightTheme) {
        workspace.classList.remove('light-theme');
      }
      if (!workspace.classList.contains('light-theme') && isLightTheme) {
        workspace.classList.add('light-theme');
      }
    }
  }, [isLightTheme]);

  useEffect(() => {
    const func = async () => {
      await getAndSetMembers();
    };
    func();
  }, [activeWorkspace]);

  const getAndSetMembers = async () => {
    try {
      const _members = await getMembers(activeWorkspace.name);
      setMembers(_members);
    } catch (error) {
      console.error(error);
      console.error('Error getting workspace members');
    }
  };

  const renderModalContent = () => {
    if (modalStatus === 'add') {
      return (
        <div className="top-bar-form-container">
          <Form
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
  };

  const renderMemberButtons = () => {
    if (!isWorkspaceOwner) return null;
    return (
      <>
        <Button
          icon={<IoMdPersonAdd />}
          onClick={() => {
            setModalStatus('add');
            setModal(true);
          }}
        >
          Add Member
        </Button>
        <Button
          icon={<MdPersonRemove />}
          onClick={() => {
            setModalStatus('remove');
            setModal(true);
          }}
        >
          Remove Member
        </Button>
      </>
    );
  };

  const validateAddMember = () => {
    const errors = [];
    if (!formData['id']) {
      errors.push("Please enter the user's Id");
    }
    setFormErrors(errors);
    return !errors.length;
  };

  return (
    <div>
      {modal && (
        <Modal
          cancelText="Close"
          content={renderModalContent()}
          hideSubmit={modalStatus === 'add' ? false : true}
          onCancel={() => {
            setModal(false);
            setFormData(initialFormData);
            setFormErrors([]);
          }}
          onSubmit={async () => {
            if (!validateAddMember()) return;
            const member: Member = {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              username: formData.username,
              id: formData.id,
            };
            try {
              await addMember(activeWorkspace.name, member);
              await getAndSetMembers();
              setFormData(initialFormData());
              setModal(false);
            } catch (error) {
              setFormErrors(['Error adding member']);
            }
          }}
        />
      )}
      <div className="disclaimer">
        <p>The Workspace UI is still in development. Many features are not yet implemented.</p>
        <Button className="theme-switcher" onClick={() => setIsLightTheme(!isLightTheme)}>
          Set theme to {isLightTheme ? 'dark' : 'light'}
        </Button>
      </div>
      <div className="top-bar">
        {activeWorkspace && (
          <div className="top-bar__left">
            <ProfileTile borderColor="#a19d9d" color="#4c72ba" username={activeWorkspace.name} />
            <h2>{activeWorkspace.name} Workspace</h2>
          </div>
        )}

        <div className="top-bar__right">
          {renderMemberButtons()}
          {members && <WorkspaceMembers members={members} />}
        </div>
      </div>
    </div>
  );
};
