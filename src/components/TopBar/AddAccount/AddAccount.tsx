import React, { useState } from 'react';
import './styles.scss';

import { Field } from '@/components/Form/Fields/types';
import Form from '@/components/Form/Form';
import SuccessTextBox from '@/components/Info/Success/SuccessTextBox';
import Modal from '@/components/Modal/Modal';

const ADD_ACCOUNT_FIELDS: Field[] = [
  {
    externalName: 'Account name',
    internalName: 'name',
    type: 'string',
    value: '',
  },
  {
    externalName: 'Organisation name',
    internalName: 'organisation_name',
    type: 'string',
    value: '',
  },
  {
    externalName: 'Organisation address',
    internalName: 'organisation_address',
    type: 'string',
    value: '',
  },
  {
    externalName: 'Reason for account opening',
    internalName: 'account_opening_reason',
    type: 'textarea',
    value: '',
  },
  {
    externalName: (
      <>
        Accept{' '}
        <a href="/" target="_blank">
          Terms and Conditions
        </a>
      </>
    ),
    internalName: 'terms_and_conditions',
    type: 'boolean',
    value: '',
  },
];

type Status = 'default' | 'running' | 'success' | 'error';

const AddAccount = () => {
  const [modal, setModal] = useState<boolean>();
  const [status, setStatus] = useState<Status>('default');

  const getInitialFormValues = () => {
    const values = {};
    ADD_ACCOUNT_FIELDS.forEach((field) => (values[field.internalName] = field.value));
    return values;
  };
  const [formData, setFormData] = useState<{ [key: string]: string }>(() => getInitialFormValues());
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [requestError, setRequestError] = useState<string>();

  const resetState = () => {
    setStatus('default');
    setFormErrors([]);
    setRequestError('');
    setModal(false);
    setFormData(getInitialFormValues());
  };

  const renderModalContent = () => {
    if (status === 'success') {
      return <SuccessTextBox content={'Account created'} />;
    }
    return (
      <div className="add-account-modal-container">
        <Form
          fieldData={ADD_ACCOUNT_FIELDS}
          header={'Create new workspace account'}
          onChange={(data) => setFormData(data)}
        />
        {status === 'running' && <div className="add-account-error">Creating account</div>}
        {requestError && <div className="add-account-errors__error">{requestError}</div>}
        {!!formErrors.length && (
          <ul className="add-account-errors">
            {formErrors.map((error) => (
              <li key={error} className="add-account-errors__error">
                {error}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const addAccount = async () => {
    const res = await fetch(`/api/accounts`, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      throw new Error('Error creating account');
    }
  };

  const validate = () => {
    const errors: string[] = [];
    if (!formData['name']) {
      errors.push('Account name must not be empty');
    }
    if (!formData['organisation_name']) {
      errors.push('Organisation name must not be empty');
    }
    if (!formData['organisation_address']) {
      errors.push('Organisation address must not be empty');
    }
    if (!formData['account_opening_reason']) {
      errors.push('Please provide a reason for why you are requesting to open an account');
    }
    if (!formData['terms_and_conditions']) {
      errors.push('Please accept the terms and conditions');
    }
    setFormErrors(errors);
    return !errors.length;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      setStatus('running');
      await addAccount();
      setStatus('success');
      setFormData(getInitialFormValues());
    } catch (error) {
      setStatus('error');
      setRequestError(error.message);
    }
  };

  return (
    <div className="add-account">
      {modal && (
        <Modal
          cancelText={status === 'success' ? 'Dismiss' : 'Cancel'}
          content={renderModalContent()}
          hideSubmit={status === 'success'}
          submitDisabled={status === 'running'}
          submitText="Create"
          onCancel={() => resetState()}
          onSubmit={async () => await submit()}
        />
      )}
      <button className="blue-button" onClick={() => setModal(true)}>
        Add Account
      </button>
    </div>
  );
};

export default AddAccount;
