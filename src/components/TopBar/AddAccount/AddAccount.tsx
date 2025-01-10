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
];

type Status = 'default' | 'running' | 'success' | 'error';

const AddAccount = () => {
  const [modal, setModal] = useState<boolean>();
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<Status>('default');

  const getInitialFormValues = () => {
    const values = {};
    ADD_ACCOUNT_FIELDS.forEach((field) => (values[field.internalName] = field.value));
    return values;
  };
  const [formData, setFormData] = useState<{ [key: string]: string }>(() => getInitialFormValues());

  const resetState = () => {
    setStatus('default');
    setError('');
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
        <div className="add-account-error">{error}</div>
      </div>
    );
  };

  const addAccount = async () => {
    const body = {
      name: formData['name'],
    };
    const res = await fetch(`/api/accounts`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error('Error creating account');
    }
  };

  const validate = () => {
    let valid = true;
    if (!formData['name']) {
      valid = false;
      setError('Account name must not be empty');
    }
    return valid;
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
      setError(error.message);
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
