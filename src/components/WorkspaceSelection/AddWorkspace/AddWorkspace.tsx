import React, { useEffect, useState } from 'react';

import { MdAddCircleOutline } from 'react-icons/md';

import { Field } from '@/components/Form/Fields/types';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import { useWorkspace } from '@/hooks/useWorkspace';
import { WorkspaceAdd } from '@/services/workspaces/types';
import { createWorkspace } from '@/services/workspaces/workspaces';

const AddWorkspace = () => {
  const { getAndSetWorkspaces, accounts } = useWorkspace();
  const [addWorkspaceFields, setAddWorkspaceFields] = useState<Field[]>([]);

  useEffect(() => {
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
        options: accounts?.map((account) => {
          return {
            externalName: account.name,
            internalName: account.id,
          };
        }),
      },
    ];
    setAddWorkspaceFields(ADD_WORKSPACE_FIELDS);
  }, [accounts]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const getInitialFormData = () => {
    const data = {};
    addWorkspaceFields.forEach((field) => {
      data[field.internalName] = field.value;
    });
    return data;
  };

  const [formData, setFormData] = useState<{ [key: string]: string }>(getInitialFormData());
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const renderModalContent = () => {
    return (
      <Form
        fieldData={addWorkspaceFields}
        formErrors={formErrors}
        header={'Add new Workspace'}
        onChange={(data) => setFormData(data)}
      />
    );
  };

  const isDnsCompliant = (domain: string) => {
    const domainRegex = /^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)$/;
    if (domain.length > 253) return false;

    const labels = domain.split('.');
    return labels.every((label) => domainRegex.test(label));
  };

  const validate = () => {
    const errors = [];
    if (!formData.name) {
      errors.push('Name cannot be empty');
    }
    if (!formData.account) {
      errors.push('Account cannot be empty');
    }
    if (formData.name && !isDnsCompliant(formData.name)) {
      errors.push('Name must be DNS compliant. e.g workspace_name not workspace name');
    }
    setFormErrors(errors);
    return !errors.length;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    const workspaceAdd: WorkspaceAdd = {
      account: formData.account,
      name: formData.name,
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
      {showModal ? (
        <Modal
          content={renderModalContent()}
          onCancel={() => {
            setShowModal(false);
            setFormData(getInitialFormData());
            setFormErrors([]);
          }}
          onSubmit={async () => await onSubmit()}
        />
      ) : null}
      <MdAddCircleOutline
        className={`workspace-selection__add icon-primary ${accounts?.length ? '' : 'disabled'}`}
        onClick={() => {
          if (!accounts.length) return;
          setShowModal(true);
        }}
      />
    </>
  );
};

export default AddWorkspace;
