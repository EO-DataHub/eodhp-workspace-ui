import React, { useState } from 'react';

import { MdAddCircleOutline } from 'react-icons/md';

import { Field } from '@/components/Form/Fields/types';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import { useWorkspace } from '@/hooks/useWorkspace';
import { WorkspaceAdd } from '@/services/workspaces/types';
import { createWorkspace } from '@/services/workspaces/workspaces';

const AddWorkspace = () => {
  const { getAndSetWorkspaces, accounts } = useWorkspace();
  const ADD_WORKSPACE_FIELDS: Field[] = [
    {
      externalName: 'Name',
      internalName: 'name',
      type: 'string',
      value: '',
    },
    {
      externalName: 'Account',
      internalName: 'account',
      type: 'dropdown',
      value: '',
      options: accounts.map((account) => account.id),
    },
    {
      externalName: 'Member group',
      internalName: 'memberGroup',
      type: 'string',
      value: '',
    },
  ];

  const [showModal, setShowModal] = useState<boolean>(false);

  const getInitialFormData = () => {
    const data = {};
    ADD_WORKSPACE_FIELDS.forEach((field) => {
      data[field.internalName] = field.value;
    });
    return data;
  };

  const [formData, setFormData] = useState<{ [key: string]: string }>(getInitialFormData());
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const renderModalContent = () => {
    return (
      <Form
        fieldData={ADD_WORKSPACE_FIELDS}
        formErrors={formErrors}
        header={'Add new workspace'}
        onChange={(data) => setFormData(data)}
      />
    );
  };

  const validate = () => {
    const errors = [];
    if (!formData.name) {
      errors.push('Name cannot be empty');
    }
    setFormErrors(errors);
    return !errors.length;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    const workspaceAdd: WorkspaceAdd = {
      account: formData.account,
      memberGroup: formData.memberGroup,
      name: formData.name,
      status: formData.status,
    };
    try {
      await createWorkspace(workspaceAdd);
      await getAndSetWorkspaces();
      setShowModal(false);
      setFormData(getInitialFormData());
      setFormErrors([]);
    } catch (error) {
      setFormErrors([error.message]);
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          content={renderModalContent()}
          onCancel={() => {
            setShowModal(false);
            setFormData(getInitialFormData());
            setFormErrors([]);
          }}
          onSubmit={async () => await onSubmit()}
        />
      )}
      <MdAddCircleOutline
        className="workspace-selection__add icon-primary"
        onClick={() => {
          setShowModal(true);
        }}
      />
    </>
  );
};

export default AddWorkspace;
