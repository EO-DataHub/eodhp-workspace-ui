import React, { useState } from 'react';

import { MdDeleteForever } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';

import { Button } from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import { useWorkspace } from '@/hooks/useWorkspace';
import { deleteWorkspace } from '@/services/workspaces/workspaces';

const DeleteWorkspaceButton = () => {
  const { activeWorkspace, getAndSetWorkspaces } = useWorkspace();

  const [modalOpen, setModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const setMessage = (msg: string) => toast(msg);

  const validate = () => {
    const errors = [];
    if (!confirmDelete) {
      errors.push('You must confirm deletion by ticking the checkbox.');
    }
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await deleteWorkspace(activeWorkspace.name);
      setMessage('Workspace deleted successfully.');

      await new Promise((resolve) => setTimeout(resolve, 10000));
      setModalOpen(false);
      setConfirmDelete(false);
      setIsLoading(false);
      await getAndSetWorkspaces();
    } catch {
      setIsLoading(false);
      setFormErrors(['Error deleting workspace']);
      setMessage('Error deleting workspace');
    }
  };

  const getModalDescription = () => {
    return (
      <div>
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
        </div>
      </div>
    );
  };

  const getModalContent = () => {
    return (
      <div className="top-bar-form-container">
        <Form
          description={getModalDescription()}
          fieldData={[]}
          header="Delete Workspace"
          onChange={() => {}}
        />
        <ul className="top-bar-form-container__errors">
          {formErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      {modalOpen && (
        <Modal
          cancelText="Close"
          content={getModalContent()}
          isLoading={isLoading}
          submitDisabled={!confirmDelete}
          onCancel={() => {
            setModalOpen(false);
            setFormErrors([]);
            setConfirmDelete(false);
            setIsLoading(false);
          }}
          onSubmit={handleSubmit}
        />
      )}
      <Button icon={<MdDeleteForever />} onClick={() => setModalOpen(true)}>
        Delete Workspace
      </Button>
      <ToastContainer hideProgressBar position="bottom-left" theme="light" />
    </>
  );
};

export default DeleteWorkspaceButton;
