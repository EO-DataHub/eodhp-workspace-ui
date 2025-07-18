import React, { useEffect, useState } from 'react';
import './styles.scss';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accounts.length) return;
    const filteredAccounts = accounts.filter((accounts) => accounts.status === 'Approved');
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
        options: filteredAccounts.map((account) => {
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

  const getModalDescription = () => {
    return (
      <div className="add-workspace-modal-description">
        <div>
          A workspace will allow workflows, data and results to be stored on the Hub. It provides
          the facility for users to analyze data, process datasets, make commercial orders and
          generate value-added outputs within the hosted Hub environment. You can find out more{' '}
          <a href="/docs/account-setup/workspaces/" target="_blank">
            here
          </a>
        </div>
      </div>
    );
  };

  const renderModalContent = () => {
    return (
      <div className="add-workspace-modal">
        <Form
          description={getModalDescription()}
          fieldData={addWorkspaceFields}
          formErrors={formErrors}
          header={'Add New Workspace'}
          onChange={(data) => setFormData(data)}
        />
        <span>
          Only Approved accounts will be shown here. You can view the status of your accounts at{' '}
          <a href="/accounts/">accounts</a>
        </span>
      </div>
    );
  };

  const isDnsCompliant = (domain: string) => {
    const domainRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    const labels = domain.split('.');
    return labels.every((label) => domainRegex.test(label));
  };

  const validate = () => {
    const errors = [];

    if (formData.name?.length > 50) {
      errors.push('Name cannot exceed 50 characters');
    }
    if (formData.name?.length < 3) {
      errors.push('Name must be at least 3 characters');
    }

    if (!formData.name) {
      errors.push('Name cannot be empty');
    }
    if (!formData.account) {
      errors.push('Account cannot be empty');
    }
    if (formData.name && !isDnsCompliant(formData.name)) {
      errors.push(
        'Invalid name: only lowercase letters, numbers, and hyphens are allowed, and it can’t start or end with a hyphen.',
      );
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
      setIsLoading(true);
      await createWorkspace(workspaceAdd);

      await new Promise((resolve) => setTimeout(resolve, 5000));
      await getAndSetWorkspaces();
      setShowModal(false);
      setFormData(getInitialFormData());
      setFormErrors([]);
      setIsLoading(false);
      // Trigger OAuth2 flow to refresh the token
      await fetch('/oauth2/start', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      setIsLoading(false);
      setFormErrors([error.message]);
    }
  };

  return (
    <>
      {showModal ? (
        <Modal
          content={renderModalContent()}
          isLoading={isLoading}
          submitDisabled={!formData['name'] || !formData['account']}
          onCancel={() => {
            setShowModal(false);
            setFormData(getInitialFormData());
            setFormErrors([]);
            setIsLoading(false);
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
