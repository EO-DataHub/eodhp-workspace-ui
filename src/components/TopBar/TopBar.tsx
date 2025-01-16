/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './TopBar.scss';
import { useEffect, useState } from 'react';

import { IoMdPersonAdd } from 'react-icons/io';
import { MdDelete, MdPersonRemove } from 'react-icons/md';

import { useWorkspace } from '@/hooks/useWorkspace';
import { deleteMember, getMembers } from '@/services/members/members';
import { placeholderMembers } from '@/services/members/placeholder';
import { Member } from '@/services/members/types';

import { WorkspaceMembers } from './components/WorkspaceMembers/WorkspaceMembers';
import { Button } from '../Button/Button';
import { Field } from '../Form/Fields/types';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';
import { ProfileTile } from '../ProfileTile/ProfileTile';

const ADD_MEMBER_FIELDS: Field[] = [
  {
    externalName: 'Id',
    internalName: 'id',
    value: '',
    type: 'string',
  },
  {
    externalName: 'Username',
    internalName: 'username',
    value: '',
    type: 'string',
  },
  {
    externalName: 'First name',
    internalName: 'firstName',
    value: '',
    type: 'string',
  },
  {
    externalName: 'Last name',
    internalName: 'lastName',
    value: '',
    type: 'string',
  },
  {
    externalName: 'Email',
    internalName: 'email',
    value: '',
    type: 'string',
  },
];

export const TopBar = () => {
  const { activeWorkspace } = useWorkspace();
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [members, setMembers] = useState<Member[]>();
  const [modal, setModal] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<'add' | 'remove'>();

  useEffect(() => {
    const workspace = document.getElementById('workspace');
    if (workspace) {
      if (workspace.classList.contains('light-theme') && !isLightTheme) {
        workspace.classList.remove('light-theme');
      }
      if (!workspace.classList.contains('light-theme') && isLightTheme) {
        workspace.classList.add('light-theme');
      }
    }
  }, [isLightTheme]);

  useEffect(() => {
    const func = async () => {
      await getAndSetMembers();
    };
    func();
  }, [activeWorkspace]);

  const getAndSetMembers = async () => {
    try {
      const _members = await getMembers(activeWorkspace.id);
      setMembers(_members);
    } catch (error) {
      setMembers(placeholderMembers);
    }
  };

  const renderModalContent = () => {
    if (modalStatus === 'add') {
      return (
        <Form
          fieldData={ADD_MEMBER_FIELDS}
          header={'Add member'}
          onChange={(data) => console.log(data)}
        />
      );
    }
    if (modalStatus === 'remove') {
      return (
        <div>
          {members.map((member) => {
            return (
              <div key={member.id} className="top-bar-remove__row">
                <ProfileTile username={member.username} />
                <span>{member.username}</span>
                <div
                  className="top-bar-remove__row-delete"
                  onClick={async () => {
                    await deleteMember(activeWorkspace.id, member.id);
                    await getAndSetMembers();
                  }}
                >
                  <MdDelete />
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div>
      {modal && (
        <Modal
          content={renderModalContent()}
          onCancel={() => setModal(false)}
          onSubmit={() => console.log('Submit')}
        />
      )}
      <div className="disclaimer">
        <p>The Workspace UI is still in development. Many features are not yet implemented.</p>
        <Button className="theme-switcher" onClick={() => setIsLightTheme(!isLightTheme)}>
          Set theme to {isLightTheme ? 'dark' : 'light'}
        </Button>
      </div>
      <div className="top-bar">
        {activeWorkspace && (
          <div className="top-bar__left">
            <ProfileTile borderColor="#a19d9d" color="#4c72ba" username={activeWorkspace.name} />
            <h2>EODH Workspace</h2>
          </div>
        )}

        <div className="top-bar__right">
          <Button
            icon={<IoMdPersonAdd />}
            onClick={() => {
              setModalStatus('add');
              setModal(true);
            }}
          >
            Add Member
          </Button>
          <Button
            icon={<MdPersonRemove />}
            onClick={() => {
              setModalStatus('remove');
              setModal(true);
            }}
          >
            Remove Member
          </Button>
          {members && <WorkspaceMembers members={members} />}
        </div>
      </div>
    </div>
  );
};
