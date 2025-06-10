// import React, { useState } from 'react';
// import '@/styles/main.scss';
// import './styles.scss';

// import { MdPersonRemove } from 'react-icons/md';
// import { ToastContainer, toast } from 'react-toastify';

// import { Button } from '@/components/Button/Button';
// import Modal from '@/components/Modal/Modal';
// import { useWorkspace } from '@/hooks/useWorkspace';
// import { deleteWorkspace } from '@/services/workspaces/workspaces';

// import DeleteRow from '../DeleteRow/DeleteRow';

// const MemberButtons = () => {
//   const { activeWorkspace, members, getAndSetMembers } = useWorkspace();

//   const [modal, setModal] = useState<boolean>(false);
//   const [modalStatus, setModalStatus] = useState<'add' | 'remove' | 'delete_workspace'>();
//   const [formErrors, setFormErrors] = useState<string[]>([]);
//   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

//   const setMessage = (message: string) => {
//     toast(message);
//   };

//   const renderModalContent = () => {
//     if (modalStatus === 'remove') {
//       return (
//         <div>
//           {members.map((member) => {
//             return (
//               <DeleteRow
//                 key={member.id}
//                 member={member}
//                 onDeleteSuccess={async () => await getAndSetMembers()}
//               />
//             );
//           })}
//         </div>
//       );
//     }
//     if (modalStatus === 'delete_workspace') {
//       return (
//         <div className="delete-workspace-confirmation">
//           <h2>Delete Workspace</h2>
//           <p>
//             Deleting this workspace will <strong>permanently remove all associated data</strong>,
//             including members and resources. This action cannot be undone.
//           </p>
//           <label>
//             <input
//               checked={confirmDelete}
//               type="checkbox"
//               onChange={(e) => setConfirmDelete(e.target.checked)}
//             />{' '}
//             I understand that this action will delete everything permanently.
//           </label>
//           {formErrors.length > 0 && (
//             <ul className="top-bar-form-container__errors">
//               {formErrors.map((error) => (
//                 <li key={error}>{error}</li>
//               ))}
//             </ul>
//           )}
//         </div>
//       );
//     }
//   };

//   return (
//     <>
//       {modal && (
//         <Modal
//           cancelText="Close"
//           content={renderModalContent()}
//           onCancel={() => {
//             setModal(false);
//             setFormErrors([]);
//             setConfirmDelete(false);
//           }}
//           onSubmit={async () => {
//             if (modalStatus === 'delete_workspace') {
//               if (!confirmDelete) {
//                 setFormErrors(['You must confirm deletion by ticking the checkbox.']);
//                 return;
//               }
//               try {
//                 await deleteWorkspace(activeWorkspace.name);
//                 setMessage('Workspace deleted successfully.');
//                 setModal(false);
//                 // You can redirect user or refresh list depending on the app flow
//               } catch (error) {
//                 setFormErrors(['Error deleting workspace']);
//                 setMessage('Error deleting workspace');
//               }
//             }
//           }}
//         />
//       )}
//       <div className="member-buttons">
//         <Button
//           icon={<MdPersonRemove />}
//           onClick={() => {
//             setModalStatus('delete_workspace');
//             setModal(true);
//           }}
//         >
//           Delete Workspace
//         </Button>

//         <ToastContainer hideProgressBar position="bottom-left" theme="light" />
//       </div>
//     </>
//   );
// };

// export default MemberButtons;

import React from 'react';

import '@/styles/main.scss';
import './styles.scss';
import { ToastContainer } from 'react-toastify';

// import AddMemberButton from './AddMember';
import DeleteWorkspaceButton from './DeleteWorkspace';

const MemberButtons = () => {
  return (
    <div className="member-buttons">
      <DeleteWorkspaceButton />

      <ToastContainer hideProgressBar position="bottom-left" theme="light" />
    </div>
  );
};

export default MemberButtons;
