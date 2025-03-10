/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';

import ReactDOM from 'react-dom';
import './styles.scss';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import Modal from '@/components/Modal/Modal';

import QuestionMark from '../../../../assets/icons/question-mark.svg';

interface HelpProps {
  type: 'Tooltip' | 'Modal';
  content: string;
}

const Help = ({ type = 'Tooltip', content }: HelpProps) => {
  const [modal, setModal] = useState<boolean>(false);

  const tooltipPortal =
    typeof document !== 'undefined'
      ? ReactDOM.createPortal(
          <Tooltip
            className="profile-tile-tooltip"
            id={`tooltip`}
            place="top"
            style={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}
          />,
          document.body,
        )
      : null;

  const render = () => {
    if (type === 'Modal') {
      return (
        <div className="help" onClick={() => setModal(true)}>
          <img alt="Help icon" src={QuestionMark} />
        </div>
      );
    }
    return (
      <div className="help" data-tooltip-content={content} data-tooltip-id={`tooltip`}>
        <img alt="Help icon" src={QuestionMark} />
        {tooltipPortal}
      </div>
    );
  };

  return (
    <>
      {modal ? (
        <Modal
          hideSubmit
          cancelText="Close"
          content={content}
          onCancel={() => setModal(false)}
          onSubmit={() => null}
        />
      ) : null}
      {render()}
    </>
  );
};

export default Help;
