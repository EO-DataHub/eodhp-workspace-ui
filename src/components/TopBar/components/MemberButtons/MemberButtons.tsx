import '@/styles/main.scss';
import './styles.scss';
import { ToastContainer } from 'react-toastify';

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
