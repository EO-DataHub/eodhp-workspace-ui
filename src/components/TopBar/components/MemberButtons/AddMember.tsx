import React, { useState } from 'react';

import { IoMdPersonAdd } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';

import { Button } from '@/components/Button/Button';
import { Field } from '@/components/Form/Fields/types';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import { useWorkspace } from '@/hooks/useWorkspace';
import { addMember } from '@/services/members/members';

const ADD_MEMBER_FIELDS: Field[] = [
  {
    externalName: 'Username',
    internalName: 'username',
    value: '',
    type: 'string',
  },
];

const AddMemberButton = () => {
  const { activeWorkspace, getAndSetMembers } = useWorkspace();

  const [modalOpen, setModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string }>(() =>
    Object.fromEntries(ADD_MEMBER_FIELDS.map((f) => [f.internalName, String(f.value)])),
  );

  const setMessage = (msg: string) => toast(msg);

  const validate = () => {
    const errors = [];
    if (!formData['username']) errors.push("Please enter the user's Username");
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await addMember(activeWorkspace.name, formData['username']);
      await getAndSetMembers();
      setMessage('Member added successfully');
      setModalOpen(false);
      setFormData({ username: '' });
    } catch {
      setFormErrors(['Error adding member']);
      setMessage('Error adding member');
    }
  };

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

  return (
    <>
      {modalOpen && (
        <Modal
          cancelText="Close"
          content={
            <div className="top-bar-form-container">
              <Form
                description={getModalDescription()}
                fieldData={ADD_MEMBER_FIELDS}
                header="Add Member"
                onChange={setFormData}
              />
              <ul className="top-bar-form-container__errors">
                {formErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          }
          submitDisabled={!formData['username']}
          onCancel={() => {
            setFormData({ username: '' });
            setModalOpen(false);
            setFormErrors([]);
          }}
          onSubmit={handleSubmit}
        />
      )}
      <Button icon={<IoMdPersonAdd />} onClick={() => setModalOpen(true)}>
        Add Member
      </Button>
      <ToastContainer hideProgressBar position="bottom-left" theme="light" />
    </>
  );
};

export default AddMemberButton;
