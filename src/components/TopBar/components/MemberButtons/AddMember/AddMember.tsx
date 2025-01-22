import React from 'react';

import { IoMdPersonAdd } from 'react-icons/io';

import { Button } from '@/components/Button/Button';

interface AddMemberProps {
  onClick: () => void;
}

const AddMember = ({ onClick }: AddMemberProps) => {
  return (
    <Button icon={<IoMdPersonAdd />} onClick={() => onClick()}>
      Add Member
    </Button>
  );
};

export default AddMember;
