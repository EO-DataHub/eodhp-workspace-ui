import React, { useState } from 'react';
import '../../../../styles/main.scss';

import { IoMdPersonAdd } from 'react-icons/io';
import { MdPersonRemove } from 'react-icons/md';

import { Button } from '@/components/Button/Button';
import { Field } from '@/components/Form/Fields/types';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import { useWorkspace } from '@/hooks/useWorkspace';
import { addMember } from '@/services/members/members';
import { Member } from '@/services/members/types';

import DeleteRow from '../DeleteRow/DeleteRow';

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

const MemberButtons = () => {
  const { activeWorkspace, members, getAndSetMembers } = useWorkspace();

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

  const validateAddMember = () => {
    const errors = [];
    if (!formData['id']) {
      errors.push("Please enter the user's Id");
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
      <div className="flex gap-small margin-small">
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
      </div>
    </>
  );
};

export default MemberButtons;
