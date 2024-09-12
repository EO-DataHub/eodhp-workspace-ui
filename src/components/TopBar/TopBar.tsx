import { useState } from 'react';

import './TopBar.scss';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const TopBar = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <div className="top-bar">
      <div>
        <p className="greeting">Good evening, James.</p>
        <p className="date">Monday, 12th April 2021</p>
      </div>

      <Select
        className="workspace-select"
        defaultValue={selectedOption}
        options={options}
        onChange={setSelectedOption}
      />
    </div>
  );
};

export default TopBar;
