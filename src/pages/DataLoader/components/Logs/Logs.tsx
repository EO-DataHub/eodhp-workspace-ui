import React, { useRef } from 'react';
import './styles.scss';

import { LazyLog } from 'react-lazylog';
import { ToastContainer } from 'react-toastify';

import { useDataLoader } from '@/hooks/useDataLoader';
import { displayUTCTime } from '@/utils/time';

const Logs = () => {
  const { logsError, logs } = useDataLoader();

  const renderError = () => {
    return <div className="logs__error">{logsError}</div>;
  };

  const calculateContainerHeight = () => {
    const container = document.getElementsByClassName('workspace-content')[0];
    if (!container) return 0;
    const containerHeight = container.clientHeight;
    const newHeight = Math.min(containerHeight - 150, 400);
    return `${newHeight}`;
  };
  const heightRef = useRef(calculateContainerHeight());

  const renderLogs = () => {
    return (
      <LazyLog
        enableSearch
        follow
        selectableLines
        extraLines={1}
        height={heightRef.current}
        overscanRowCount={100}
        text={getText()}
      />
    );
  };

  const getText = () => {
    const text = logs.map((log) => {
      return `[${displayUTCTime(log.datetime)}] ${log.message}`;
    });
    return text.join('\n');
  };

  return (
    <div className="content-page logs">
      {logsError && renderError()}
      {renderLogs()}
      <ToastContainer hideProgressBar position="bottom-left" theme="light" />
    </div>
  );
};

export default Logs;
