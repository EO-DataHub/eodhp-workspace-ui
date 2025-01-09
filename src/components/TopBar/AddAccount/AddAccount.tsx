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
    if (status === 'running') {
      return <div>Creating Account</div>;
    }
    if (status === 'success') {
      return <SuccessTextBox content={'Account created'} />;
    }
    if (status === 'error') {
      return <div className="add-account-error">Error creating account {error}</div>;
    }
    return (
      <>
        <Form
          fieldData={ADD_ACCOUNT_FIELDS}
          header={'Create new workspace account'}
          onChange={(data) => setFormData(data)}
        />
        <div className="add-account-error">{error}</div>
      </>
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
    } catch (error) {
      setStatus('success');
      setError(error.message);
    } finally {
      setFormData(getInitialFormValues());
    }
  };

  return (
    <div>
      {modal && (
        <Modal
          cancelText={status === 'success' ? 'Dismiss' : 'Cancel'}
          content={renderModalContent()}
          hideSubmit={status === 'success'}
          submitText="Create"
          onCancel={() => resetState()}
          onSubmit={async () => await submit()}
        />
      )}
      <button onClick={() => setModal(true)}>AddAccount</button>
    </div>
  );
};

export default AddAccount;
